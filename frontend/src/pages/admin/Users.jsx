import { useState, useEffect, useMemo } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import TextField from '../../components/TextField';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Table from '../../components/Table';
import Pagination from '../../components/Pagination';
import Card from '../../components/Card';
import Button from '../../components/Button';
import UserFormModal from '../../components/UserFormModal';
import ConfirmDialog from '../../components/ConfirmDialog';
import DataDetailModal from '../../components/DataDetailModal';
import { getUsers, createUser, updateUser, deleteUser, getRoles, exportUsers, syncCache } from '../../api/admin';
import { usePermission } from '../../hooks/usePermission';
import { PERMS } from '../../utils/permissions';
import { toast } from 'react-hot-toast';

const Users = () => {
    const { hasPermission } = usePermission();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1); // Reset to first page on search
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const queryClient = useQueryClient();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['users', currentPage, itemsPerPage, debouncedSearch],
        queryFn: () => getUsers(currentPage, itemsPerPage, debouncedSearch),
    });

    // Fetch roles for mapping role_id to role name
    const { data: rolesData } = useQuery({
        queryKey: ['roles', 'user'],
        queryFn: () => getRoles(1, 100, '', 'user'), // Get all user roles
    });

    const createMutation = useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            setIsCreateModalOpen(false);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => updateUser(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            setIsEditModalOpen(false);
            setSelectedUser(null);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            setIsDeleteDialogOpen(false);
            setSelectedUser(null);
        },
    });

    const handleCreate = (formData) => {
        createMutation.mutate(formData);
    };

    const handleEdit = (formData) => {
        updateMutation.mutate({ id: selectedUser.id, data: formData });
    };

    const handleDelete = () => {
        deleteMutation.mutate(selectedUser.id);
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const openDeleteDialog = (user) => {
        setSelectedUser(user);
        setIsDeleteDialogOpen(true);
    };

    const openDetailModal = (user) => {
        const enrichedUser = {
            ...user,
            role_name: rolesMap[user.role_id] || `Role ${user.role_id}`
        };
        setSelectedUser(enrichedUser);
        setIsDetailModalOpen(true);
    };

    const handleExport = async (format) => {
        setIsExporting(true);
        try {
            const response = await exportUsers(format);
            const blob = new Blob([response.data], {
                type: format === 'excel' 
                    ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
                    : 'text/csv'
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `users-${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'csv'}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            toast.error(`Failed to export users: ${error.message}`);
        } finally {
            setIsExporting(false);
        }
    };

    const handleSyncCache = async () => {
        setIsRefreshing(true);
        try {
            await syncCache('users');
            toast.success('User cache refreshed successfully');
            refetch(); // Refresh current page data
        } catch (error) {
            toast.error(`Failed to refresh cache: ${error.message}`);
        } finally {
            setIsRefreshing(false);
        }
    };

    // Create role lookup map
    const rolesMap = {};
    if (rolesData?.data) {
        rolesData.data.forEach(role => {
            rolesMap[role.id] = role.name;
        });
    }

    const columns = [
        { header: 'Email', accessor: 'email' },
        {
            header: 'Role',
            render: (row) => rolesMap[row.role_id] || `Role ${row.role_id}`
        },
        {
            header: 'Status',
            render: (row) => (
                <span className={`px-2.5 py-1 text-[10px] rounded-full font-bold uppercase tracking-wider ${
                    row.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    row.status === 'freezed' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                    {row.status ? row.status : 'Active'}
                </span>
            ),
        },
    ];

    const tableActions = useMemo(() => [
        { label: 'Detail', onClick: openDetailModal, icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> },
        hasPermission(PERMS.USER_EDIT) && { label: 'Edit', onClick: openEditModal },
        hasPermission(PERMS.USER_DELETE) && { label: 'Delete', onClick: openDeleteDialog, className: 'text-error' },
    ].filter(Boolean), [hasPermission, rolesMap]);

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500">Error loading users: {error.message}</p>
            </div>
        );
    }

    const users = data?.data || [];
    const meta = data?.meta?.pagination || { total_data: 0, total_pages: 1 };

    return (
        <div>
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-surface-on">Users Management</h1>
                    <p className="text-surface-on-variant mt-2">Manage user accounts and roles</p>
                </div>
                <div className="flex gap-2">
                    {hasPermission(PERMS.SYSTEM_EXPORT) && (
                        <div className="flex bg-surface-variant/20 p-1 rounded-lg">
                            <button
                                onClick={handleSyncCache}
                                className="px-3 py-1.5 text-xs font-semibold hover:bg-surface-variant/30 rounded-md transition-all flex items-center gap-1.5 text-surface-on disabled:opacity-50"
                                disabled={isRefreshing}
                                title="Refresh Cache"
                            >
                                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                            </button>
                            <div className="w-px h-4 bg-outline-variant/30 self-center mx-1" />
                            <button
                                onClick={() => handleExport('excel')}
                                className="px-3 py-1.5 text-xs font-semibold hover:bg-surface-variant/30 rounded-md transition-all flex items-center gap-1.5 text-surface-on disabled:opacity-50"
                                disabled={isExporting}
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Excel
                            </button>
                            <button
                                onClick={() => handleExport('csv')}
                                className="px-3 py-1.5 text-xs font-semibold hover:bg-surface-variant/30 rounded-md transition-all flex items-center gap-1.5 text-surface-on disabled:opacity-50"
                                disabled={isExporting}
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                CSV
                            </button>
                        </div>
                    )}
                    {hasPermission(PERMS.USER_CREATE) && (
                        <Button onClick={() => setIsCreateModalOpen(true)}>
                            Add New User
                        </Button>
                    )}
                </div>
            </div>

            {/* Search Input */}
            <div className="mb-4">
                <TextField
                    name="search"
                    placeholder="Search by email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    leftIcon={<Search size={18} />}
                />
            </div>

            <Card className="p-0 overflow-hidden">
                <Table columns={columns} data={users} loading={isLoading} actions={tableActions} />
                {!isLoading && users.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={meta.total_pages}
                        totalItems={meta.total_data}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onLimitChange={(newLimit) => {
                            setItemsPerPage(newLimit);
                            setCurrentPage(1);
                        }}
                    />
                )}
            </Card>

            {/* Create Modal */}
            <UserFormModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreate}
                loading={createMutation.isPending}
            />

            {/* Edit Modal */}
            <UserFormModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedUser(null);
                }}
                onSubmit={handleEdit}
                user={selectedUser}
                loading={updateMutation.isPending}
            />

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => {
                    setIsDeleteDialogOpen(false);
                    setSelectedUser(null);
                }}
                onConfirm={handleDelete}
                title="Delete User"
                message={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
                loading={deleteMutation.isPending}
            />

            {/* Detail Modal */}
            <DataDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false);
                    setSelectedUser(null);
                }}
                title="User Detail"
                data={selectedUser}
            />
        </div>
    );
};

export default Users;
