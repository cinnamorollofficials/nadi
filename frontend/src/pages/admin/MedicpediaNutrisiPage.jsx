import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Table from "../../components/Table";
import Modal from "../../components/Modal";
import Pagination from "../../components/Pagination";
import TextField from "../../components/TextField";
import WysiwygEditor from "../../components/WysiwygEditor";
import usePermission from "../../hooks/usePermission";
import { PERMS } from "../../utils/permissions";
import {
  getAllMedicpediaNutrisis,
  createMedicpediaNutrisi,
  updateMedicpediaNutrisi,
  deleteMedicpediaNutrisi,
  exportMedicpediaNutrisi,
} from "../../api/medicpedianutrisi";

const MedicpediaNutrisiPage = () => {
  const can = usePermission();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [paginationMeta, setPaginationMeta] = useState({
    total_data: 0,
    total_pages: 1,
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    image: "",
    description: "",
    benefits: "",
    sources: "",
    daily_needs: "",
    risks_deficiency: "",
    status: "Published",
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
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, "");
  };

  const columns = [
    { header: "ID", accessor: "id" },
    {
      header: "Name",
      accessor: "name",
    },
    {
      header: "Slug",
      accessor: "slug",
    },
    {
      header: "Image",
      accessor: "image",
    },
    {
      header: "Description",
      accessor: "description",
      render: (row) => (
        <div className="max-w-xs truncate">{stripHtml(row.description)}</div>
      ),
    },
    {
      header: "Benefits",
      accessor: "benefits",
      render: (row) => (
        <div className="max-w-xs truncate">{stripHtml(row.benefits)}</div>
      ),
    },
    {
      header: "Sources",
      accessor: "sources",
      render: (row) => (
        <div className="max-w-xs truncate">{stripHtml(row.sources)}</div>
      ),
    },
    {
      header: "DailyNeeds",
      accessor: "daily_needs",
      render: (row) => (
        <div className="max-w-xs truncate">{stripHtml(row.daily_needs)}</div>
      ),
    },
    {
      header: "RisksDeficiency",
      accessor: "risks_deficiency",
      render: (row) => (
        <div className="max-w-xs truncate">
          {stripHtml(row.risks_deficiency)}
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
    },
    {
      header: "Created At",
      accessor: "created_at",
      render: (row) => new Date(row.created_at).toLocaleString(),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getAllMedicpediaNutrisis({
          page: currentPage,
          limit: itemsPerPage,
          search: debouncedSearch,
        });
        setData(res.data?.data || []);
        setPaginationMeta(res.data?.meta || { total_data: 0, total_pages: 1 });
      } catch (err) {
        toast.error("Failed to fetch data");
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
        benefits: item.benefits,
        sources: item.sources,
        daily_needs: item.daily_needs,
        risks_deficiency: item.risks_deficiency,
        status: item.status,
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        slug: "",
        image: "",
        description: "",
        benefits: "",
        sources: "",
        daily_needs: "",
        risks_deficiency: "",
        status: "Published",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMedicpediaNutrisi(editingId, formData);
        toast.success("Updated successfully");
      } else {
        await createMedicpediaNutrisi(formData);
        toast.success("Created successfully");
      }
      setIsModalOpen(false);
      setRefreshTrigger((t) => t + 1);
    } catch (err) {
      toast.error(err.response?.data?.meta?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteMedicpediaNutrisi(id);
        toast.success("Deleted successfully");
        setRefreshTrigger((t) => t + 1);
      } catch (err) {
        toast.error("Failed to delete");
      }
    }
  };

  const handleExport = async (format) => {
    setIsExporting(true);
    try {
      const response = await exportMedicpediaNutrisi(format);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const filename =
        format === "csv" ? "medicpedianutrisi.csv" : "medicpedianutrisi.xlsx";
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export failed:", err);
      toast.error("Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  const tableActions = [
    ...(can(PERMS.UPDATE_MEDICPEDIANUTRISI)
      ? [{ label: "Edit", onClick: handleOpenModal }]
      : []),
    ...(can(PERMS.DELETE_MEDICPEDIANUTRISI)
      ? [
          {
            label: "Delete",
            onClick: (row) => handleDelete(row.id),
            className: "text-error",
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-surface-on tracking-tight">
            MedicpediaNutrisi Management
          </h1>
          <p className="text-sm text-surface-on-variant mt-1">
            Manage your medicpedianutrisi instances.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-surface-variant/20 p-1 rounded-lg shrink-0">
            <button
              onClick={() => handleExport("excel")}
              className="px-3 py-1.5 text-xs font-semibold hover:bg-surface-variant/30 rounded-md transition-all flex items-center gap-1.5 text-surface-on disabled:opacity-50"
              disabled={isExporting}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Excel
            </button>
            <button
              onClick={() => handleExport("csv")}
              className="px-3 py-1.5 text-xs font-semibold hover:bg-surface-variant/30 rounded-md transition-all flex items-center gap-1.5 text-surface-on disabled:opacity-50"
              disabled={isExporting}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              CSV
            </button>
          </div>
          {can(PERMS.CREATE_MEDICPEDIANUTRISI) && (
            <Button variant="primary" onClick={() => handleOpenModal()}>
              Add MedicpediaNutrisi
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
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
        title={editingId ? "Edit MedicpediaNutrisi" : "Add MedicpediaNutrisi"}
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
          <TextField
            label="Image"
            name="image"
            value={formData.image.toString()}
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.value })
            }
            required
          />
          <WysiwygEditor
            label="Description"
            name="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          />
          <WysiwygEditor
            label="Benefits"
            name="benefits"
            value={formData.benefits}
            onChange={(e) =>
              setFormData({ ...formData, benefits: e.target.value })
            }
            required
          />
          <WysiwygEditor
            label="Sources"
            name="sources"
            value={formData.sources}
            onChange={(e) =>
              setFormData({ ...formData, sources: e.target.value })
            }
            required
          />
          <WysiwygEditor
            label="DailyNeeds"
            name="daily_needs"
            value={formData.daily_needs}
            onChange={(e) =>
              setFormData({ ...formData, daily_needs: e.target.value })
            }
            required
          />
          <WysiwygEditor
            label="RisksDeficiency"
            name="risks_deficiency"
            value={formData.risks_deficiency}
            onChange={(e) =>
              setFormData({ ...formData, risks_deficiency: e.target.value })
            }
            required
          />
          <div className="space-y-1.5 px-1">
            <label className="text-sm font-medium text-surface-on block uppercase tracking-widest text-[10px]">
              Status
            </label>
            <select
              className="text-field bg-surface-container-high"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              required
            >
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>
            <p className="text-[10px] text-surface-on-variant font-medium uppercase tracking-[0.1em]">
              Hanya status "Published" yang akan muncul di halaman publik.
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="tonal"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingId ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MedicpediaNutrisiPage;
