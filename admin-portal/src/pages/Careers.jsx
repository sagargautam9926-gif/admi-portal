
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  MapPin,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import FormField from '../components/FormField';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';
import { jobsService } from '../api/jobsService';
import { useAuth } from '../context/AuthContext';
import { JOB_TYPES, JOB_STATUSES } from '../utils/constants';
import toast from 'react-hot-toast';

const jobSchema = z.object({
  title: z.string().min(2, { message: 'Job title is required' }),
  location: z.string().min(2, { message: 'Location is required' }),
  type: z.string().min(1, { message: 'Please select employment type' }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters',
  }),
  status: z.enum(['Open', 'Closed']).default('Open'),
});

export const Careers = () => {
  const { isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get('status') || JOB_STATUSES.ALL
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: '',
      location: 'Indore, India',
      type: 'Full Time',
      description: '',
      status: 'Open',
    },
  });

  // Fetch Jobs
  const fetchJobs = async () => {
    try {
      setLoading(true);

      const data = await jobsService.getJobs({
        search,
        status: statusFilter,
      });

      setJobs(data);
    } catch (err) {
      toast.error('Failed to load career listings.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchJobs, 250);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  // Handle URL query actions
  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      openAddModal();

      const params = new URLSearchParams(searchParams);
      params.delete('action');
      setSearchParams(params, { replace: true });
    }
  }, [searchParams]);

  // Open Add Modal
  const openAddModal = () => {
    setEditingJob(null);

    reset({
      title: '',
      location: 'Indore, India',
      type: 'Full Time',
      description: '',
      status: 'Open',
    });

    setModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (job) => {
    setEditingJob(job);

    reset({
      title: job.title,
      location: job.location,
      type: job.type,
      description: job.description,
      status: job.status,
    });

    setModalOpen(true);
  };

  // Add / Update Job
  const handleFormSubmit = async (data) => {
    setActionLoading(true);

    try {
      if (editingJob) {
        const updated = await jobsService.updateJob(editingJob.id, data);

        setJobs((prev) =>
          prev.map((j) => (j.id === editingJob.id ? updated : j))
        );

        toast.success(`Job opening "${updated.title}" updated.`);
      } else {
        const created = await jobsService.createJob(data);

        setJobs((prev) => [created, ...prev]);

        toast.success(
          `Job opening "${created.title}" posted successfully.`
        );
      }

      setModalOpen(false);
    } catch (err) {
      toast.error(err?.message || 'Failed to save job opening.');
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle Job Status
  const handleToggleStatus = async (job) => {
    try {
      const updated = await jobsService.toggleJobStatus(job.id);

      setJobs((prev) =>
        prev.map((j) => (j.id === job.id ? updated : j))
      );

      toast.success(
        `Job "${job.title}" is now marked as ${updated.status}.`
      );
    } catch (err) {
      toast.error('Failed to toggle status.');
      console.error(err);
    }
  };

  // Delete Job
  const confirmDelete = (job) => {
    setJobToDelete(job);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!jobToDelete) return;

    setActionLoading(true);

    try {
      await jobsService.deleteJob(jobToDelete.id);

      setJobs((prev) =>
        prev.filter((j) => j.id !== jobToDelete.id)
      );

      toast.success(`Job opening "${jobToDelete.title}" deleted.`);

      setDeleteConfirmOpen(false);
      setJobToDelete(null);
    } catch (err) {
      toast.error('Failed to delete job.');
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Table Columns
  const columns = [
    {
      header: 'Position Title',
      key: 'title',
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-900">
            {row.title}
          </span>

          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
            {row.description}
          </p>
        </div>
      ),
    },
    {
      header: 'Location',
      key: 'location',
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          {row.location}
        </span>
      ),
    },
    {
      header: 'Type',
      key: 'type',
      render: (row) => (
        <span className="px-2.5 py-1 rounded-full text-xs bg-blue-50 border border-blue-100 text-blue-700">
          {row.type}
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <StatusBadge status={row.status} />,
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
            onClick={() => handleToggleStatus(row)}
            className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            title={row.status === 'Open' ? 'Close job' : 'Re-open job'}
            aria-label={`Toggle status for ${row.title}`}
          >
            {row.status === 'Open' ? (
              <ToggleRight className="w-4 h-4 text-emerald-600" />
            ) : (
              <ToggleLeft className="w-4 h-4 text-slate-400" />
            )}
          </button>

          <button
            type="button"
            onClick={() => openEditModal(row)}
            className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
            title="Edit Opening"
            aria-label={`Edit ${row.title}`}
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          {isAdmin && (
            <button
              type="button"
              onClick={() => confirmDelete(row)}
              className="p-1.5 rounded-lg bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 hover:border-red-300 transition-colors"
              title="Delete Opening"
              aria-label={`Delete ${row.title}`}
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

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-600" />
            Career Openings
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish, edit, and manage engineering and design vacancies in Indore
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-medium flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Post a Job
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 flex flex-col md:flex-row items-center justify-between gap-4">

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search job title or keyword..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
            <Filter className="w-3.5 h-3.5 text-blue-600 ml-2 mr-1" />

            {['All', 'Open', 'Closed'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <DataTable
        columns={columns}
        data={jobs}
        loading={loading}
        emptyTitle="No job openings found"
        emptyDescription={
          search || statusFilter !== 'All'
            ? 'No postings match the current filter. Try resetting search filters.'
            : 'No career vacancies currently listed. Click "Post a Job" to add one.'
        }
        emptyActionLabel={
          search || statusFilter !== 'All'
            ? 'Reset Filters'
            : 'Post First Job'
        }
        onEmptyAction={
          search || statusFilter !== 'All'
            ? () => {
                setSearch('');
                setStatusFilter('All');
              }
            : openAddModal
        }
      />

      {/* Add / Edit Job Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingJob ? 'Edit Career Opening' : 'Post New Job Opening'}
        subtitle="Specify candidate requirements and employment terms"
      >
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4"
        >
          <FormField
            id="job-title"
            label="Job Title"
            required
            error={errors.title?.message}
          >
            <input
              id="job-title"
              type="text"
              placeholder="e.g. Senior React Developer"
              className={`w-full px-3 py-2.5 rounded-lg border bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-500' : 'border-slate-200'
              }`}
              {...register('title')}
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              id="job-location"
              label="Location"
              required
              error={errors.location?.message}
            >
              <input
                id="job-location"
                type="text"
                placeholder="Indore, India"
                className={`w-full px-3 py-2.5 rounded-lg border bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.location ? 'border-red-500' : 'border-slate-200'
                }`}
                {...register('location')}
              />
            </FormField>

            <FormField
              id="job-type"
              label="Employment Type"
              required
              error={errors.type?.message}
            >
              <select
                id="job-type"
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register('type')}
              >
                {JOB_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <FormField
            id="job-status"
            label="Initial Status"
            error={errors.status?.message}
          >
            <select
              id="job-status"
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('status')}
            >
              <option value="Open">Open (Accepting Applicants)</option>
              <option value="Closed">Closed (Hidden/Archived)</option>
            </select>
          </FormField>

          <FormField
            id="job-description"
            label="Role Overview & Requirements"
            required
            error={errors.description?.message}
            helperText="Include core responsibilities, key tech stack, and experience."
          >
            <textarea
              id="job-description"
              rows={4}
              placeholder="We are looking for an experienced engineer to build..."
              className={`w-full px-3 py-2.5 rounded-lg border bg-white text-sm text-slate-700 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-500' : 'border-slate-200'
              }`}
              {...register('description')}
            />
          </FormField>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              disabled={actionLoading}
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs sm:text-sm font-medium hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={actionLoading}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium flex items-center gap-2 disabled:opacity-50 transition-colors"
            >
              {actionLoading && <Loader size="sm" text="" />}

              {editingJob ? 'Save Opening' : 'Publish Job'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        isLoading={actionLoading}
        title="Delete Job Opening"
        message={`Are you sure you want to delete "${jobToDelete?.title}"? This cannot be undone.`}
        confirmText="Yes, Delete Job"
        isDanger={true}
      />

    </div>
  );
};

export default Careers;
