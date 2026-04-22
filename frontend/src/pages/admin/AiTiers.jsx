import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Plus, Edit2, Trash2, Info, Check } from 'lucide-react';
import TextField from '../../components/TextField';
import toast from 'react-hot-toast';
import Table from '../../components/Table';
import Pagination from '../../components/Pagination';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { getAiTiers, createAiTier, updateAiTier, deleteAiTier } from '../../api/admin';

const AiTiers = () => {
    const queryClient = useQueryClient();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Modal state
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedTier, setSelectedTier] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        daily_limit: 20,
        description: '',
        is_default: false
    });

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const { data, isLoading, error } = useQuery({
        queryKey: ['ai-tiers', currentPage, itemsPerPage, debouncedSearch],
        queryFn: () => getAiTiers(currentPage, itemsPerPage, debouncedSearch),
    });

    const mutation = useMutation({
        mutationFn: (payload) => {
            if (selectedTier) {
                return updateAiTier(selectedTier.id, payload);
            }
            return createAiTier(payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['ai-tiers']);
            setIsFormModalOpen(false);
            toast.success(`Tier ${selectedTier ? 'updated' : 'created'} successfully`);
        },
        onError: (err) => {
            toast.error(err.response?.data?.meta?.message || 'Action failed');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteAiTier,
        onSuccess: () => {
            queryClient.invalidateQueries(['ai-tiers']);
            setIsDeleteOpen(false);
            toast.success('Tier deleted');
        },
        onError: (err) => {
            toast.error(err.response?.data?.meta?.message || 'Delete failed');
        },
    });

    const openModal = (tier = null) => {
        if (tier) {
            setSelectedTier(tier);
            setFormData({
                name: tier.name,
                daily_limit: tier.daily_limit,
                description: tier.description || '',
                is_default: tier.is_default
            });
        } else {
            setSelectedTier(null);
            setFormData({
                name: '',
                daily_limit: 20,
                description: '',
                is_default: false
            });
        }
        setIsFormModalOpen(true);
    };

    const columns = [
        { header: 'Name', accessor: 'name' },
        { 
            header: 'Daily Limit', 
            render: (row) => (
                <div className="flex items-center gap-2">
                    <span className="font-bold text-primary">{row.daily_limit}</span>
                    <span className="text-xs text-surface-on-variant">tokens/day</span>
                </div>
            )
        },
        { 
            header: 'Type', 
            render: (row) => row.is_default ? (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-bold rounded-full uppercase tracking-wider">
                    Default
                </span>
            ) : null
        },
        { header: 'Description', accessor: 'description' },
    ];

    const actions = [
        { label: 'Edit', icon: <Edit2 className="w-4 h-4" />, onClick: openModal },
        { label: 'Delete', icon: <Trash2 className="w-4 h-4" />, onClick: (tier) => { setSelectedTier(tier); setIsDeleteOpen(true); }, className: 'text-error' }
    ];

    if (error) return <div className="p-8 text-error">Error: {error.message}</div>;

    const tiers = data?.data || [];
    const meta = data?.meta?.pagination || { total_data: 0, total_pages: 1 };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">AI Usage Tiers</h1>
                    <p className="text-surface-on-variant">Manage daily message limits for different user classes</p>
                </div>
                <Button onClick={() => openModal()} icon={<Plus className="w-4 h-4" />}>
                    New Tier
                </Button>
            </div>

            <Card className="p-4 flex gap-4 items-center">
                <div className="flex-1">
                    <TextField
                        placeholder="Search tiers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        leftIcon={<Search className="w-4 h-4" />}
                    />
                </div>
            </Card>

            <Card className="p-0 overflow-hidden">
                <Table columns={columns} data={tiers} loading={isLoading} actions={actions} />
                <Pagination
                    currentPage={currentPage}
                    totalPages={meta.total_pages}
                    totalItems={meta.total_data}
                    onPageChange={setCurrentPage}
                />
            </Card>

            {/* Form Modal */}
            <Modal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                title={selectedTier ? 'Edit AI Tier' : 'Create AI Tier'}
            >
                <div className="space-y-4 py-2">
                    <TextField
                        label="Tier Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Diamond"
                        required
                    />
                    <TextField
                        label="Daily Message Limit"
                        type="number"
                        value={formData.daily_limit}
                        onChange={(e) => setFormData({ ...formData, daily_limit: parseInt(e.target.value) })}
                        required
                    />
                    <div>
                        <label className="text-field-label">Description</label>
                        <textarea
                            className="text-field min-h-[100px] py-3"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer p-3 bg-surface-variant/20 rounded-xl">
                        <input
                            type="checkbox"
                            checked={formData.is_default}
                            onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                            className="w-5 h-5 rounded-md border-outline accent-primary"
                        />
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold">Default Tier</span>
                            <span className="text-xs text-surface-on-variant">Automatically assigned to new users</span>
                        </div>
                    </label>
                </div>
                <div className="flex justify-end gap-3 mt-8">
                    <Button variant="outline" onClick={() => setIsFormModalOpen(false)}>Cancel</Button>
                    <Button onClick={() => mutation.mutate(formData)} loading={mutation.isPending}>
                        {selectedTier ? 'Update' : 'Create'}
                    </Button>
                </div>
            </Modal>

            {/* Delete Dialog */}
            <ConfirmDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={() => deleteMutation.mutate(selectedTier.id)}
                title="Delete Tier"
                message={`Are you sure you want to delete ${selectedTier?.name}? This might affect users assigned to it.`}
                loading={deleteMutation.isPending}
            />
        </div>
    );
};

export default AiTiers;
