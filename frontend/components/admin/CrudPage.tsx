'use client';
import { useEffect, useState, useCallback } from 'react';

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface Props<T extends { _id: string }> {
  title: string;
  fetchFn: (params: { page: number, limit: number, search: string }) => Promise<{ data: { data: T[], total: number } }>;
  createFn: (data: Partial<T>) => Promise<unknown>;
  updateFn: (id: string, data: Partial<T>) => Promise<unknown>;
  deleteFn: (id: string) => Promise<unknown>;
  columns: Column<T>[];
  FormComponent: React.ComponentType<{
    initialData?: Partial<T>;
    onSubmit: (data: Partial<T>) => Promise<void>;
    onCancel: () => void;
    loading: boolean;
  }>;
  emptyMessage?: string;
}

export default function CrudPage<T extends { _id: string }>({
  title,
  fetchFn,
  createFn,
  updateFn,
  deleteFn,
  columns,
  FormComponent,
  emptyMessage = 'No items yet. Add one!',
}: Props<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [selected, setSelected] = useState<T | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Pagination & Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  const loadData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetchFn({ page: currentPage, limit, search: searchTerm });
      setItems(res.data.data);
      setTotalItems(res.data.total || res.data.data.length);
    } catch {
      showToast('error', 'Failed to load data');
    } finally {
      if (!silent) setLoading(false);
    }
  }, [fetchFn, currentPage, searchTerm]);

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      loadData(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [loadData]);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const handleCreate = async (data: Partial<T>) => {
    setFormLoading(true);
    try {
      await createFn(data);
      showToast('success', 'Created successfully!');
      setModal(null);
      await loadData(true);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      showToast('error', e?.response?.data?.message || 'Create failed');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (data: Partial<T>) => {
    if (!selected) return;
    setFormLoading(true);
    try {
      await updateFn(selected._id, data);
      showToast('success', 'Updated successfully!');
      setModal(null);
      setSelected(null);
      await loadData(true);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      showToast('error', e?.response?.data?.message || 'Update failed');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFn(id);
      showToast('success', 'Deleted successfully!');
      setDeleteConfirm(null);
      await loadData(true);
    } catch {
      showToast('error', 'Delete failed');
    }
  };

  const openEdit = (item: T) => {
    setSelected(item);
    setModal('edit');
  };

  const getVal = (row: T, key: string): React.ReactNode => {
    const val = (row as Record<string, unknown>)[key];
    if (Array.isArray(val)) return val.join(', ');
    if (val === null || val === undefined) return '—';
    if (typeof val === 'boolean') return val ? 'Yes' : 'No';
    return String(val);
  };

  const totalPages = Math.ceil(totalItems / limit);

  return (
    <div>
      <div className="crud-header">
        <h1 className="crud-title">{title}</h1>
        <div className="crud-header-actions">
          <div className="search-box">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <button className="btn btn-primary" id={`add-${title.toLowerCase()}-btn`} onClick={() => { setSelected(null); setModal('create'); }}>
            + Add {title.replace('s', '').trim()}
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div className="spinner" />
        </div>
      ) : items.length === 0 ? (
        <div className="crud-empty card">
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <>
          <div className="crud-table-wrap card" style={{ overflow: 'auto' }}>
            <table className="crud-table">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={String(col.key)}>{col.label}</th>
                  ))}
                  <th style={{ width: 120 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr key={row._id}>
                    {columns.map((col) => (
                      <td key={String(col.key)}>
                        {col.render ? col.render(row) : getVal(row, String(col.key))}
                      </td>
                    ))}
                    <td>
                      <div className="crud-actions">
                        <button className="btn-icon edit" id={`edit-btn-${row._id}`} onClick={() => openEdit(row)} title="Edit">
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                          </svg>
                        </button>
                        <button className="btn-icon del" id={`delete-btn-${row._id}`} onClick={() => setDeleteConfirm(row._id)} title="Delete">
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-secondary btn-sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="btn btn-secondary btn-sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Create / Edit Modal */}
      {modal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">{modal === 'create' ? `Add ${title}` : `Edit ${title}`}</h2>
              <button className="modal-close" onClick={() => setModal(null)}>×</button>
            </div>
            <FormComponent
              initialData={selected || undefined}
              onSubmit={modal === 'create' ? handleCreate : handleUpdate}
              onCancel={() => setModal(null)}
              loading={formLoading}
            />
          </div>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 400, textAlign: 'center' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 600 }}>
              Are you sure you want to delete this item?
            </p>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: '0.875rem' }}>
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" id="confirm-delete-btn" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            <span>{toast.type === 'success' ? '✓' : '✕'}</span>
            {toast.msg}
          </div>
        </div>
      )}

      <style>{`
        .crud-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .crud-title { font-size: 1.75rem; font-weight: 800; }
        .crud-header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          flex: 1;
          justify-content: flex-end;
        }
        .search-box {
          position: relative;
          min-width: 260px;
          flex: 1;
          max-width: 400px;
        }
        .search-box svg {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-muted);
        }
        .search-box input {
          width: 100%;
          padding: 0.6rem 1rem 0.6rem 2.5rem;
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          color: var(--color-text-primary);
          font-size: 0.875rem;
          transition: all var(--transition-fast);
        }
        .search-box input:focus {
          outline: none;
          border-color: var(--color-accent);
          box-shadow: 0 0 0 2px rgba(0,212,255,0.1);
        }
        .crud-empty {
          padding: 4rem 2rem;
          text-align: center;
          color: var(--color-text-muted);
          font-style: italic;
        }
        .crud-table-wrap { padding: 0; background: var(--color-bg-card); border-radius: var(--radius-lg); }
        .crud-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
        }
        .crud-table th {
          text-align: left;
          padding: 1rem;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-text-muted);
          border-bottom: 1px solid var(--color-border);
          background: rgba(255,255,255,0.01);
        }
        .crud-table td {
          padding: 1rem;
          color: var(--color-text-secondary);
          border-bottom: 1px solid var(--color-border);
        }
        .crud-table tr:last-child td { border-bottom: none; }
        .crud-table tr:hover td { background: rgba(255,255,255,0.02); }
        .crud-actions { display: flex; gap: 0.5rem; }
        .btn-icon {
          width: 34px; height: 34px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          display: flex; align-items: center; justify-content: center;
          background: var(--color-bg-card);
          color: var(--color-text-muted);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .btn-icon:hover { color: var(--color-text-primary); border-color: var(--color-text-muted); }
        .btn-icon.edit:hover { background: rgba(0,212,255,0.1); color: var(--color-accent); border-color: var(--color-accent); }
        .btn-icon.del:hover { background: rgba(255,107,107,0.1); color: var(--color-error); border-color: var(--color-error); }
        
        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          margin-top: 2rem;
        }
        .pagination-info { font-size: 0.875rem; color: var(--color-text-muted); font-weight: 500; }
        .btn-sm { padding: 0.4rem 0.8rem; font-size: 0.75rem; }
      `}</style>
    </div>
  );
}
