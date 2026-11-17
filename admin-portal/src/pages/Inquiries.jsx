import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Mail,
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  Calendar,
  Phone,
  User,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import StatusBadge from '../components/StatusBadge';
import { inquiriesService } from '../api/inquiriesService';
import { useAuth } from '../context/AuthContext';
import { INQUIRY_STATUSES } from '../utils/constants';
import toast from 'react-hot-toast';

export const Inquiries = () => {
  const { isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [inquiriesData, setInquiriesData] = useState({
    inquiries: [],
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 1,
    allFiltered: [],
  });

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get('status') || INQUIRY_STATUSES.ALL
  );
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' | 'asc'
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [inquiryToDelete, setInquiryToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const data = await inquiriesService.getInquiries({
        search,
        status: statusFilter,
        page: currentPage,
        limit: 5,
        sortOrder,
      });
      setInquiriesData(data);
    } catch (err) {
      toast.error('Failed to load inquiries.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInquiries();
    }, 200);
    return () => clearTimeout(timer);
  }, [search, statusFilter, sortOrder, currentPage]);

  const handleStatusChange = async (inquiryId, newStatus) => {
    try {
      const updated = await inquiriesService.updateInquiryStatus(inquiryId, newStatus);
      setInquiriesData((prev) => ({
        ...prev,
        inquiries: prev.inquiries.map((i) => (i.id === inquiryId ? updated : i)),
      }));
      if (selectedInquiry && selectedInquiry.id === inquiryId) {
        setSelectedInquiry(updated);
      }
      toast.success(`Inquiry status updated to "${newStatus}".`);
    } catch (err) {
      toast.error('Failed to update status.');
      console.error(err);
    }
  };

  const confirmDelete = (inquiry) => {
    setInquiryToDelete(inquiry);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!inquiryToDelete) return;
    setActionLoading(true);
    try {
      await inquiriesService.deleteInquiry(inquiryToDelete.id);
      toast.success(`Inquiry from ${inquiryToDelete.name} deleted.`);
      setDeleteConfirmOpen(false);
      setInquiryToDelete(null);
      if (selectedInquiry?.id === inquiryToDelete.id) {
        setSelectedInquiry(null);
      }
      fetchInquiries();
    } catch (err) {
      toast.error('Failed to delete inquiry.');
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleExportCSV = () => {
    const listToExport = inquiriesData.allFiltered || inquiriesData.inquiries || [];
    if (listToExport.length === 0) {
      toast.error('No inquiry records available to export.');
      return;
    }

    const headers = ['ID', 'Name', 'Email', 'Phone', 'Service', 'Status', 'Date', 'Message'];
    const rows = listToExport.map((item) => [
      `"${item.id}"`,
      `"${item.name.replace(/"/g, '""')}"`,
      `"${item.email.replace(/"/g, '""')}"`,
      `"${item.phone.replace(/"/g, '""')}"`,
      `"${item.service.replace(/"/g, '""')}"`,
      `"${item.status}"`,
      `"${new Date(item.date).toLocaleDateString()}"`,
      `"${(item.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `code_eagle_inquiries_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Exported ${listToExport.length} inquiries to CSV.`);
  };

  const toggleSort = () => {
    setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
  };

  // Columns definition
  const columns = [
    {
      header: 'Client / Contact',
      key: 'name',
      render: (row) => (
        <div>
          <div className="font-semibold text-white group-hover:text-brand-cyan transition-colors">
            {row.name}
          </div>
          <div className="text-xs text-brand-muted mt-0.5 flex items-center gap-2">
            <span>{row.email}</span>
            <span>•</span>
            <span>{row.phone}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Service Requested',
      key: 'service',
      render: (row) => (
        <span className="text-xs font-medium text-white px-2.5 py-1 rounded-full bg-navy-850 border border-border-blue inline-block">
          {row.service}
        </span>
      ),
    },
    {
      header: 'Message Preview',
      key: 'message',
      render: (row) => (
        <p className="text-xs text-brand-text/80 line-clamp-1 max-w-xs">
          {row.message}
        </p>
      ),
    },
    {
      header: 'Date Received',
      key: 'date',
      sortable: true,
      render: (row) => (
        <span className="text-xs text-brand-muted whitespace-nowrap flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-brand-cyan" />
          <span>{new Date(row.date).toLocaleDateString()}</span>
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => (
        <div className="flex items-center gap-2">
          <select
            value={row.status}
            onChange={(e) => handleStatusChange(row.id, e.target.value)}
            className="text-xs bg-navy-900 border border-border-blue rounded-lg px-2 py-1 text-white focus:outline-none focus:border-brand-cyan cursor-pointer"
            aria-label={`Change status for inquiry from ${row.name}`}
          >
            <option value="New" className="bg-navy-900 text-cyan-300">New</option>
            <option value="In Progress" className="bg-navy-900 text-amber-300">In Progress</option>
            <option value="Resolved" className="bg-navy-900 text-emerald-300">Resolved</option>
          </select>
        </div>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setSelectedInquiry(row)}
            className="p-1.5 rounded-lg bg-navy-900 border border-border-blue text-brand-text hover:text-white hover:border-brand-cyan transition-colors"
            title="View Full Message"
            aria-label={`View message from ${row.name}`}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* Delete button: strictly hidden for Editors! */}
          {isAdmin && (
            <button
              type="button"
              onClick={() => confirmDelete(row)}
              className="p-1.5 rounded-lg bg-red-950/40 border border-red-900/60 text-red-300 hover:text-white hover:border-red-500 hover:bg-red-900/60 transition-colors"
              title="Delete Inquiry"
              aria-label={`Delete inquiry from ${row.name}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Mail className="w-6 h-6 text-brand-cyan" />
            <span>Client Inquiries</span>
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            Prospect contact requests, RFPs, and service inquiries from the website
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="btn-primary text-xs sm:text-sm py-2.5 px-5 flex items-center gap-2"
        >
          <Download className="w-4 h-4 text-brand-cyan" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-gradient border border-border-blue/60 p-4 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by client, email, phone, message..."
            className="input-field pl-10 text-xs sm:text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1 bg-navy-900 p-1 rounded-xl border border-border-blue text-xs">
            {['All', 'New', 'In Progress', 'Resolved'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => {
                  setStatusFilter(st);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  statusFilter === st
                    ? 'bg-brand-blue text-white shadow-glow-sm'
                    : 'text-brand-muted hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Sort order toggle button */}
          <button
            type="button"
            onClick={toggleSort}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy-900 border border-border-blue text-xs text-brand-text hover:text-white hover:border-brand-cyan transition-colors"
            title="Toggle sort direction"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-brand-cyan" />
            <span>Date: {sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
          </button>
        </div>
      </div>

      {/* Inquiries Table */}
      <DataTable
        columns={columns}
        data={inquiriesData.inquiries}
        loading={loading}
        sortConfig={{
          key: 'date',
          direction: sortOrder,
          onSort: toggleSort,
        }}
        pagination={{
          page: inquiriesData.page,
          totalPages: inquiriesData.totalPages,
          total: inquiriesData.total,
          limit: inquiriesData.limit,
          onPageChange: (newPage) => setCurrentPage(newPage),
        }}
        emptyTitle="No inquiries found"
        emptyDescription={
          search || statusFilter !== 'All'
            ? 'No inquiries match the current search or status filter.'
            : 'No inquiries have been received yet.'
        }
        emptyActionLabel="Reset Filters"
        onEmptyAction={() => {
          setSearch('');
          setStatusFilter('All');
          setCurrentPage(1);
        }}
      />

      {/* View Message Modal */}
      <Modal
        isOpen={!!selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        title="Client Inquiry Message"
        subtitle={`Submitted on ${
          selectedInquiry ? new Date(selectedInquiry.date).toLocaleString() : ''
        }`}
      >
        {selectedInquiry && (
          <div className="space-y-5 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-navy-900/80 border border-border-blue/60">
              <div>
                <p className="text-[11px] text-brand-muted uppercase font-semibold">
                  Sender Name
                </p>
                <p className="font-semibold text-white mt-0.5">
                  {selectedInquiry.name}
                </p>
              </div>

              <div>
                <p className="text-[11px] text-brand-muted uppercase font-semibold">
                  Current Status
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <select
                    value={selectedInquiry.status}
                    onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value)}
                    className="text-xs bg-navy-950 border border-border-blue rounded-lg px-2 py-1 text-white focus:outline-none focus:border-brand-cyan"
                  >
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <div>
                <p className="text-[11px] text-brand-muted uppercase font-semibold">
                  Email
                </p>
                <a
                  href={`mailto:${selectedInquiry.email}`}
                  className="font-medium text-brand-cyan mt-0.5 block hover:underline"
                >
                  {selectedInquiry.email}
                </a>
              </div>

              <div>
                <p className="text-[11px] text-brand-muted uppercase font-semibold">
                  Phone Number
                </p>
                <a
                  href={`tel:${selectedInquiry.phone}`}
                  className="font-medium text-white mt-0.5 block hover:underline"
                >
                  {selectedInquiry.phone}
                </a>
              </div>

              <div className="sm:col-span-2">
                <p className="text-[11px] text-brand-muted uppercase font-semibold">
                  Service Category
                </p>
                <p className="font-semibold text-brand-cyan mt-0.5">
                  {selectedInquiry.service}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-brand-muted uppercase mb-1.5">
                Full Inquiry Text
              </p>
              <div className="p-4 rounded-xl bg-[#061445] border border-border-blue/80 text-brand-text leading-relaxed whitespace-pre-wrap">
                {selectedInquiry.message}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border-blue/50">
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => confirmDelete(selectedInquiry)}
                  className="btn-danger text-xs px-3 py-1.5 flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              )}

              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => setSelectedInquiry(null)}
                  className="btn-secondary text-xs sm:text-sm"
                >
                  Close
                </button>
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Regarding your Code Eagle inquiry on ${selectedInquiry.service}`}
                  className="btn-primary text-xs sm:text-sm flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        isLoading={actionLoading}
        title="Delete Inquiry Record"
        message={`Are you sure you want to delete the inquiry from "${inquiryToDelete?.name}"?`}
        confirmText="Yes, Delete Inquiry"
        isDanger={true}
      />
    </div>
  );
};

export default Inquiries;

