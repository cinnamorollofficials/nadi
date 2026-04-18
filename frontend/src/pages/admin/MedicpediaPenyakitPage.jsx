import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import DataDetailModal from '../../components/DataDetailModal';
import Pagination from '../../components/Pagination';
import TextField from '../../components/TextField';
import WysiwygEditor from '../../components/WysiwygEditor';
import ImageUpload from '../../components/ImageUpload';
import { usePermission } from '../../hooks/usePermission';
import { PERMS } from '../../utils/permissions';
import { 
    getAllMedicpediaPenyakits, 
    createMedicpediaPenyakit, 
    updateMedicpediaPenyakit, 
    deleteMedicpediaPenyakit,
    exportMedicpediaPenyakit
} from '../../api/medicpediapenyakit';

const MedicpediaPenyakitPage = () => {
    const { hasPermission: can } = usePermission();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [paginationMeta, setPaginationMeta] = useState({ total_data: 0, total_pages: 1 });
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        image: '',
        description: '',
        causes: '',
        factors_symptoms: '',
        diagnosis: '',
        when_to_see_doctor: '',
        prevention: '',
        status: 'Published',
    });

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1); // Reset to first page on search
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const stripHtml = (html) => {
        if (!html) return '';
        return html.replace(/<[^>]*>?/gm, '');
    };

    const columns = [
        { 
            header: 'Name', 
            accessor: 'name',
        },
        { 
            header: 'Status', 
            accessor: 'status',
            render: (row) => {
                const statusStr = String(row.status).toLowerCase();
                const colors = {
                    published: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                    draft: 'bg-surface-variant/30 text-surface-on-variant',
                    archived: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                };
                const colorClass = colors[statusStr] || 'bg-surface-variant/30 text-surface-on-variant';
                return (
                    <span className={`px-2.5 py-1 text-[10px] rounded-full font-bold uppercase tracking-wider ${colorClass}`}>
                        {String(row.status)}
                    </span>
                );
            }
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await getAllMedicpediaPenyakits({ 
                    page: currentPage, 
                    limit: itemsPerPage,
                    search: debouncedSearch 
                });
                setData(res.data?.data || []);
                setPaginationMeta(res.data?.meta || { total_data: 0, total_pages: 1 });
            } catch (err) {
                toast.error('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentPage, itemsPerPage, refreshTrigger, debouncedSearch]);

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingId(item.id);
            setFormData({
                name: item.name,
                slug: item.slug,
                image: item.image,
                description: item.description,
                causes: item.causes,
                factors_symptoms: item.factors_symptoms,
                diagnosis: item.diagnosis,
                when_to_see_doctor: item.when_to_see_doctor,
                prevention: item.prevention,
                status: item.status,
            });
        } else {
            setEditingId(null);
            setFormData({
                name: '',
                slug: '',
                image: '',
                description: '',
                causes: '',
                factors_symptoms: '',
                diagnosis: '',
                when_to_see_doctor: '',
                prevention: '',
                status: 'Published',
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateMedicpediaPenyakit(editingId, formData);
                toast.success('Updated successfully');
            } else {
                await createMedicpediaPenyakit(formData);
                toast.success('Created successfully');
            }
            setIsModalOpen(false);
            setRefreshTrigger(t => t + 1);
        } catch (err) {
            toast.error(err.response?.data?.meta?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await deleteMedicpediaPenyakit(id);
                toast.success('Deleted successfully');
                setRefreshTrigger(t => t + 1);
            } catch (err) {
                toast.error('Failed to delete');
            }
        }
    };

    const handleExport = async (format) => {
        setIsExporting(true);
        try {
            const response = await exportMedicpediaPenyakit(format);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const filename = format === 'csv' ? 'medicpediapenyakit.csv' : 'medicpediapenyakit.xlsx';
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Export failed:', err);
            toast.error('Export failed');
        } finally {
            setIsExporting(false);
        }
    };

    const handleDetail = (item) => {
        setSelectedItem(item);
        setIsDetailOpen(true);
    };

    const tableActions = [
        { label: 'Detail', onClick: handleDetail, icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> },
        ...(can(PERMS.PENYAKIT_EDIT) ? [{ label: 'Edit', onClick: handleOpenModal }] : []),
        ...(can(PERMS.PENYAKIT_DELETE) ? [{ label: 'Delete', onClick: (row) => handleDelete(row.id), className: 'text-error' }] : []),
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-surface-on tracking-tight">MedicpediaPenyakit Management</h1>
                    <p className="text-sm text-surface-on-variant mt-1">Manage your medicpediapenyakit instances.</p>
                </div>
                <div className="flex gap-2">
                    {can(PERMS.SYSTEM_EXPORT) && (
                        <div className="flex bg-surface-variant/20 p-1 rounded-lg shrink-0">
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
                    {can(PERMS.PENYAKIT_CREATE) && (
                        <Button variant="primary" onClick={() => handleOpenModal()}>
                            Add MedicpediaPenyakit
                        </Button>
                    )}
                </div>
            </div>

            <div className="mb-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="text-field"
                    />
                    <svg
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-on-variant"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <Card className="p-0 overflow-hidden">
                <Table 
                    columns={columns} 
                    data={data} 
                    loading={loading}
                    actions={tableActions}
                />
                {!loading && data.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={paginationMeta.total_pages}
                        totalItems={paginationMeta.total_data}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onLimitChange={(newLimit) => {
                            setItemsPerPage(newLimit);
                            setCurrentPage(1);
                        }}
                    />
                )}
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingId ? 'Edit MedicpediaPenyakit' : 'Add MedicpediaPenyakit'}
                maxWidth="max-w-4xl"
            >
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <TextField
                        label="Name"
                        name="name"
                        value={formData.name.toString()}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        
                        
                        required
                    />
                    <TextField
                        label="Slug"
                        name="slug"
                        value={formData.slug.toString()}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        
                        
                        required
                    />
                    <ImageUpload
                        label="Image"
                        value={formData.image.toString()}
                        onChange={(url) => setFormData({ ...formData, image: url })}
                        required
                    />
                    <WysiwygEditor
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                    />
                    <WysiwygEditor
                        label="Causes"
                        name="causes"
                        value={formData.causes}
                        onChange={(e) => setFormData({ ...formData, causes: e.target.value })}
                        required
                    />
                    <WysiwygEditor
                        label="FactorsSymptoms"
                        name="factors_symptoms"
                        value={formData.factors_symptoms}
                        onChange={(e) => setFormData({ ...formData, factors_symptoms: e.target.value })}
                        required
                    />
                    <WysiwygEditor
                        label="Diagnosis"
                        name="diagnosis"
                        value={formData.diagnosis}
                        onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                        required
                    />
                    <WysiwygEditor
                        label="WhenToSeeDoctor"
                        name="when_to_see_doctor"
                        value={formData.when_to_see_doctor}
                        onChange={(e) => setFormData({ ...formData, when_to_see_doctor: e.target.value })}
                        required
                    />
                    <WysiwygEditor
                        label="Prevention"
                        name="prevention"
                        value={formData.prevention}
                        onChange={(e) => setFormData({ ...formData, prevention: e.target.value })}
                        required
                    />
                    <div className="space-y-1.5 px-1">
                        <label className="text-sm font-medium text-surface-on block uppercase tracking-widest text-[10px]">Status</label>
                        <select
                            className="text-field bg-surface-container-high"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            required
                        >
                            <option value="Published">Published</option>
                            <option value="Draft">Draft</option>
                            <option value="Archived">Archived</option>
                        </select>
                        <p className="text-[10px] text-surface-on-variant font-medium uppercase tracking-[0.1em]">Hanya status "Published" yang akan muncul di halaman publik.</p>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="tonal" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            {editingId ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </form>
            </Modal>

            <DataDetailModal
                isOpen={isDetailOpen}
                onClose={() => {
                    setIsDetailOpen(false);
                    setSelectedItem(null);
                }}
                title="Penyakit Detail"
                data={selectedItem}
            />
        </div>
    );
};

export default MedicpediaPenyakitPage;
