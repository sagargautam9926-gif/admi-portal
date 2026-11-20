import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Mail,
  Search,
  Download,
  Eye,
  Trash2,
  Calendar,
  ArrowUpDown,
  CheckCircle2,
} from 'lucide-react';

import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { inquiriesService } from '../api/inquiriesService';
import { useAuth } from '../context/AuthContext';
import { INQUIRY_STATUSES } from '../utils/constants';
import toast from 'react-hot-toast';

export const Inquiries = () => {
  const { isAdmin } = useAuth();
  const [searchParams] = useSearchParams();

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
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [inquiryToDelete, setInquiryToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch inquiries
  const fetchInquiries = useCallback(async () => {
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
  }, [search, statusFilter, currentPage, sortOrder]);

  useEffect(() => {
    const timer = setTimeout(fetchInquiries, 200);
    return () => clearTimeout(timer);
  }, [fetchInquiries]);

  // Update inquiry status
  const handleStatusChange = async (inquiryId, newStatus) => {
    const existingInquiry = inquiriesData.inquiries.find(
      (item) => item.id === inquiryId
    );

    if (existingInquiry?.status === 'Resolved') {
      toast.error('Resolved inquiries cannot be moved back to New or In Progress.');
      return;
    }

    try {
      const updated = await inquiriesService.updateInquiryStatus(
        inquiryId,
        newStatus
      );

      setInquiriesData((prev) => ({
        ...prev,
        inquiries: prev.inquiries.map((item) =>
          item.id === inquiryId ? updated : item
        ),
      }));

      if (selectedInquiry?.id === inquiryId) {
        setSelectedInquiry(updated);
      }

      toast.success(`Inquiry status updated to "${newStatus}".`);
      await fetchInquiries();
    } catch (err) {
      toast.error('Failed to update status.');
      console.error(err);
    }
  };

  // Open delete confirmation
  const confirmDelete = (inquiry) => {
    setInquiryToDelete(inquiry);
    setDeleteConfirmOpen(true);
  };

  // Delete inquiry
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

      await fetchInquiries();
    } catch (err) {
      toast.error('Failed to delete inquiry.');
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Export inquiries to CSV
  const handleExportCSV = () => {
    const listToExport =
      inquiriesData.allFiltered || inquiriesData.inquiries || [];

    if (listToExport.length === 0) {
      toast.error('No inquiry records available to export.');
      return;
    }

    const escapeCSV = (value) =>
      `"${String(value ?? '').replace(/"/g, '""').replace(/\n/g, ' ')}"`;

    const headers = [
      'ID',
      'Name',
      'Email',
      'Phone',
      'Service',
      'Status',
      'Date',
      'Message',
    ];

    const rows = listToExport.map((item) => [
      escapeCSV(item.id),
      escapeCSV(item.name),
      escapeCSV(item.email),
      escapeCSV(item.phone),
      escapeCSV(item.service),
      escapeCSV(item.status),
      escapeCSV(new Date(item.date).toLocaleDateString()),
      escapeCSV(item.message),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `code_eagle_inquiries_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Exported ${listToExport.length} inquiries to CSV.`);
  };

  const toggleSort = () => {
    setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
  };

  // Table columns
  const columns = [
    {
      header: 'Client / Contact',
      key: 'name',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-800">
            {row.name}
          </p>
          <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
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
        <span className="text-xs font-medium text-blue-700 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 inline-block">
          {row.service}
        </span>
      ),
    },
    {
      header: 'Message Preview',
      key: 'message',
      render: (row) => (
        <p className="text-xs text-slate-600 line-clamp-1 max-w-xs">
          {row.message}
        </p>
      ),
    },
    {
      header: 'Date Received',
      key: 'date',
      sortable: true,
      render: (row) => (
        <span className="text-xs text-slate-500 whitespace-nowrap flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-blue-500" />
          {new Date(row.date).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) =>
        row.status === 'Resolved' ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 select-none">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Resolved
          </span>
        ) : (
          <select
            value={row.status}
            onChange={(e) =>
              handleStatusChange(row.id, e.target.value)
            }
            className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 cursor-pointer"
            aria-label={`Change status for inquiry from ${row.name}`}
          >
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
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
            className="p-2 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 hover:bg-blue-100 transition-colors"
            title="View Full Message"
            aria-label={`View message from ${row.name}`}
          >
            <Eye className="w-4 h-4" />
          </button>

          {isAdmin && (
            <button
              type="button"
              onClick={() => confirmDelete(row)}
              className="p-2 rounded-lg bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 transition-colors"
              title="Delete Inquiry"
              aria-label={`Delete inquiry from ${row.name}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Mail className="w-6 h-6 text-blue-600" />
            Client Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage prospect contact requests, RFPs, and service inquiries.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">

        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by client, email, phone, message..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">

          {/* Status Filters */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
            {['All', 'New', 'In Progress', 'Resolved'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => {
                  setStatusFilter(st);
                  setCurrentPage(1);
                }}
                className={`px-3 py-2 rounded-lg font-medium transition-all ${
                  statusFilter === st
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Sort Button */}
          <button
            type="button"
            onClick={toggleSort}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
            title="Toggle sort direction"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-blue-600" />
            Date: {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
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
          onPageChange: setCurrentPage,
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

      {/* View Inquiry Modal */}
      <Modal
        isOpen={!!selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        title="Client Inquiry Message"
        subtitle={`Submitted on ${
          selectedInquiry
            ? new Date(selectedInquiry.date).toLocaleString()
            : ''
        }`}
      >
        {selectedInquiry && (
          <div className="space-y-5 text-xs sm:text-sm">

            {/* Client Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">

              <div>
                <p className="text-[11px] text-slate-500 uppercase font-semibold">
                  Sender Name
                </p>
                <p className="font-semibold text-slate-800 mt-1">
                  {selectedInquiry.name}
                </p>
              </div>

              <div>
                <p className="text-[11px] text-slate-500 uppercase font-semibold">
                  Current Status
                </p>
                {selectedInquiry.status === 'Resolved' ? (
                  <span className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 select-none">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Resolved
                  </span>
                ) : (
                  <select
                    value={selectedInquiry.status}
                    onChange={(e) =>
                      handleStatusChange(selectedInquiry.id, e.target.value)
                    }
                    className="mt-1 text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                )}
              </div>

              <div>
                <p className="text-[11px] text-slate-500 uppercase font-semibold">
                  Email
                </p>
                <a
                  href={`mailto:${selectedInquiry.email}`}
                  className="font-medium text-blue-600 mt-1 block hover:underline break-all"
                >
                  {selectedInquiry.email}
                </a>
              </div>

              <div>
                <p className="text-[11px] text-slate-500 uppercase font-semibold">
                  Phone Number
                </p>
                <a
                  href={`tel:${selectedInquiry.phone}`}
                  className="font-medium text-slate-700 mt-1 block hover:text-blue-600"
                >
                  {selectedInquiry.phone}
                </a>
              </div>

              <div className="sm:col-span-2">
                <p className="text-[11px] text-slate-500 uppercase font-semibold">
                  Service Category
                </p>
                <p className="font-semibold text-blue-700 mt-1">
                  {selectedInquiry.service}
                </p>
              </div>
            </div>

            {/* Full Message */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
                Full Inquiry Text
              </p>
              <div className="p-4 rounded-xl bg-white border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-wrap break-words">
                {selectedInquiry.message}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => confirmDelete(selectedInquiry)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 text-xs font-medium transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              )}

              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => setSelectedInquiry(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs sm:text-sm font-medium transition-colors"
                >
                  Close
                </button>

                <a
                  href={`mailto:${selectedInquiry.email}?subject=Regarding your Code Eagle inquiry on ${selectedInquiry.service}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Reply via Email
                </a>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
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