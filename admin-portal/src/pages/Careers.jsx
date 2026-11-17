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
  Clock,
  Sparkles,
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
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
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

  // Modal states
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
    const timer = setTimeout(() => {
      fetchJobs();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  // Handle URL query actions
  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      openAddModal();
      searchParams.delete('action');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams]);

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

  const handleFormSubmit = async (data) => {
    setActionLoading(true);
    try {
      if (editingJob) {
        const updated = await jobsService.updateJob(editingJob.id, data);
        setJobs((prev) => prev.map((j) => (j.id === editingJob.id ? updated : j)));
        toast.success(`Job opening "${updated.title}" updated.`);
      } else {
        const created = await jobsService.createJob(data);
        setJobs((prev) => [created, ...prev]);
        toast.success(`Job opening "${created.title}" posted successfully.`);
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err?.message || 'Failed to save job opening.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (job) => {
    try {
      const updated = await jobsService.toggleJobStatus(job.id);
      setJobs((prev) => prev.map((j) => (j.id === job.id ? updated : j)));
      toast.success(
        `Job "${job.title}" is now marked as ${updated.status}.`
      );
    } catch (err) {
      toast.error('Failed to toggle status.');
      console.error(err);
    }
  };

  const confirmDelete = (job) => {
    setJobToDelete(job);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!jobToDelete) return;
    setActionLoading(true);
    try {
      await jobsService.deleteJob(jobToDelete.id);
      setJobs((prev) => prev.filter((j) => j.id !== jobToDelete.id));
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

  // Define Table Columns
  const columns = [
    {
      header: 'Position Title',
      key: 'title',
      render: (row) => (
        <div>
          <span className="font-semibold text-white group-hover:text-brand-cyan transition-colors">
            {row.title}
          </span>
          <p className="text-xs text-brand-muted line-clamp-1 mt-0.5">
            {row.description}
          </p>
        </div>
      ),
    },
    {
      header: 'Location',
      key: 'location',
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 text-xs text-brand-text">
          <MapPin className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
          <span>{row.location}</span>
        </span>
      ),
    },
    {
      header: 'Type',
      key: 'type',
      render: (row) => (
        <span className="px-2.5 py-1 rounded-full text-xs bg-navy-850 border border-border-blue text-brand-text">
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
          {/* Quick status toggle button */}
          <button
            type="button"
            onClick={() => handleToggleStatus(row)}
            className="p-1.5 rounded-lg bg-navy-900 border border-border-blue text-brand-text hover:text-brand-cyan transition-colors"
            title={row.status === 'Open' ? 'Close job' : 'Re-open job'}
            aria-label={`Toggle status for ${row.title}`}
          >
            {row.status === 'Open' ? (
              <ToggleRight className="w-4 h-4 text-emerald-400" />
            ) : (
              <ToggleLeft className="w-4 h-4 text-slate-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => openEditModal(row)}
            className="p-1.5 rounded-lg bg-navy-900 border border-border-blue text-brand-text hover:text-white hover:border-brand-cyan transition-colors"
            title="Edit Opening"
            aria-label={`Edit ${row.title}`}
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          {/* Delete button: strictly hidden for Editors! */}
          {isAdmin && (
            <button
              type="button"
              onClick={() => confirmDelete(row)}
              className="p-1.5 rounded-lg bg-red-950/40 border border-red-900/60 text-red-300 hover:text-white hover:border-red-500 hover:bg-red-900/60 transition-colors"
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
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-brand-cyan" />
            <span>Career Openings</span>
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            Publish, edit, and manage engineering and design vacancies in Indore
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="btn-primary text-xs sm:text-sm py-2.5 px-5 flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-brand-cyan" />
          <span>Post a Job</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-gradient border border-border-blue/60 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search job title or keyword..."
            className="input-field pl-10 text-xs sm:text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1.5 bg-navy-900 p-1 rounded-xl border border-border-blue text-xs">
            <Filter className="w-3.5 h-3.5 text-brand-cyan ml-2 mr-1" />
            {['All', 'Open', 'Closed'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
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
        </div>
      </div>

      {/* Jobs DataTable */}
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
        emptyActionLabel={search || statusFilter !== 'All' ? 'Reset Filters' : 'Post First Job'}
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
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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
              className={`input-field ${errors.title ? 'border-red-500' : ''}`}
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
                className={`input-field ${errors.location ? 'border-red-500' : ''}`}
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
                className="input-field bg-navy-900 text-white cursor-pointer"
                {...register('type')}
              >
                {JOB_TYPES.map((t) => (
                  <option key={t} value={t} className="bg-navy-900 text-white">
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
              className="input-field bg-navy-900 text-white cursor-pointer"
              {...register('status')}
            >
              <option value="Open" className="bg-navy-900 text-white">Open (Accepting Applicants)</option>
              <option value="Closed" className="bg-navy-900 text-white">Closed (Hidden/Archived)</option>
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
              className={`input-field resize-none ${
                errors.description ? 'border-red-500' : ''
              }`}
              {...register('description')}
            />
          </FormField>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-blue/50">
            <button
              type="button"
              disabled={actionLoading}
              onClick={() => setModalOpen(false)}
              className="btn-secondary text-xs sm:text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="btn-primary text-xs sm:text-sm flex items-center gap-2"
            >
              {actionLoading && <Loader size="sm" text="" />}
              <span>{editingJob ? 'Save Opening' : 'Publish Job'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Dialog */}
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

