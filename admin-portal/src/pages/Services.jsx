import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Globe,
  Smartphone,
  Brain,
  Cloud,
  Palette,
  Briefcase,
  Database,
  Shield,
  Cpu,
  Code,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Layers,
  Sparkles,
} from 'lucide-react';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import FormField from '../components/FormField';
import StatusBadge from '../components/StatusBadge';
import { servicesService } from '../api/servicesService';
import { useAuth } from '../context/AuthContext';
import { SERVICE_ICONS } from '../utils/constants';
import toast from 'react-hot-toast';

const iconMap = {
  Globe,
  Smartphone,
  Brain,
  Cloud,
  Palette,
  Briefcase,
  Database,
  Shield,
  Cpu,
  Code,
};

const serviceSchema = z.object({
  name: z.string().min(2, { message: 'Service name must be at least 2 characters' }),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters' }),
  icon: z.string().min(1, { message: 'Please select an icon' }),
  active: z.boolean().default(true),
});

export const Services = () => {
  const { isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      description: '',
      icon: 'Globe',
      active: true,
    },
  });

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await servicesService.getServices({ search });
      setServices(data);
    } catch (err) {
      toast.error('Failed to load services.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchServices();
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  // Check URL query param ?action=new to open modal automatically
  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      openAddModal();
      searchParams.delete('action');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams]);

  const openAddModal = () => {
    setEditingService(null);
    reset({
      name: '',
      description: '',
      icon: 'Globe',
      active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    reset({
      name: service.name,
      description: service.description,
      icon: service.icon || 'Globe',
      active: service.active,
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (data) => {
    setActionLoading(true);
    try {
      if (editingService) {
        const updated = await servicesService.updateService(editingService.id, data);
        setServices((prev) =>
          prev.map((s) => (s.id === editingService.id ? updated : s))
        );
        toast.success(`Service "${updated.name}" updated successfully.`);
      } else {
        const created = await servicesService.createService(data);
        setServices((prev) => [created, ...prev]);
        toast.success(`New service "${created.name}" created successfully.`);
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err?.message || 'Failed to save service.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleActive = async (service) => {
    try {
      const updated = await servicesService.toggleServiceActive(service.id);
      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? updated : s))
      );
      toast.success(
        `Service "${service.name}" is now ${updated.active ? 'Visible' : 'Hidden'}.`
      );
    } catch (err) {
      toast.error('Failed to change visibility.');
      console.error(err);
    }
  };

  const confirmDelete = (service) => {
    setServiceToDelete(service);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;
    setActionLoading(true);
    try {
      await servicesService.deleteService(serviceToDelete.id);
      setServices((prev) => prev.filter((s) => s.id !== serviceToDelete.id));
      toast.success(`Service "${serviceToDelete.name}" deleted.`);
      setDeleteConfirmOpen(false);
      setServiceToDelete(null);
    } catch (err) {
      toast.error('Failed to delete service.');
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-brand-cyan" />
            <span>Offered Services</span>
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            Manage company services showcased on the public Code Eagle portal
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="btn-primary text-xs sm:text-sm py-2.5 px-5 flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-brand-cyan" />
          <span>Add Service</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-gradient border border-border-blue/60 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services by keyword..."
            className="input-field pl-10 text-xs sm:text-sm"
          />
        </div>

        <div className="text-xs text-brand-muted flex items-center gap-2 w-full sm:w-auto justify-end">
          <span>Total Services:</span>
          <span className="font-bold text-brand-cyan px-2 py-0.5 rounded-full bg-navy-900 border border-border-blue">
            {services.length}
          </span>
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <Loader size="lg" text="Loading Code Eagle services..." />
        </div>
      ) : services.length === 0 ? (
        <EmptyState
          title="No services found"
          description={
            search
              ? `No services matching "${search}". Try clearing your search keyword.`
              : 'No services currently listed. Click "Add Service" to create one.'
          }
          actionLabel={search ? 'Clear Search' : 'Add First Service'}
          onAction={search ? () => setSearch('') : openAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {services.map((service) => {
            const IconComp = iconMap[service.icon] || Globe;

            return (
              <div
                key={service.id}
                className={`card-gradient card-gradient-hover p-5 sm:p-6 flex flex-col justify-between border transition-all duration-200 relative group ${
                  service.active ? 'border-border-blue' : 'border-border-blue/40 opacity-75'
                }`}
              >
                <div>
                  {/* Top Bar inside Card */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-navy-900 border border-border-blue text-brand-cyan shadow-glow-sm group-hover:scale-105 transition-transform">
                      <IconComp className="w-6 h-6" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <StatusBadge
                        status={service.active ? 'Active' : 'Inactive'}
                      />
                    </div>
                  </div>

                  <h3 className="text-base font-semibold text-white tracking-wide group-hover:text-brand-cyan transition-colors">
                    {service.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-brand-text/85 mt-2 line-clamp-3 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Card Actions Footer */}
                <div className="pt-4 mt-5 border-t border-border-blue/50 flex items-center justify-between gap-2">
                  {/* Toggle Visibility */}
                  <button
                    type="button"
                    onClick={() => handleToggleActive(service)}
                    className="flex items-center gap-1.5 text-xs text-brand-muted hover:text-brand-cyan transition-colors"
                    title={service.active ? 'Hide from public site' : 'Show on public site'}
                  >
                    {service.active ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Visible</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(service)}
                      className="p-1.5 rounded-lg bg-navy-900 border border-border-blue text-brand-text hover:text-white hover:border-brand-cyan transition-all"
                      title="Edit Service"
                      aria-label={`Edit ${service.name}`}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete button: strictly hidden for Editors! */}
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => confirmDelete(service)}
                        className="p-1.5 rounded-lg bg-red-950/40 border border-red-900/60 text-red-300 hover:text-white hover:border-red-500 hover:bg-red-900/60 transition-all"
                        title="Delete Service"
                        aria-label={`Delete ${service.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Service Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingService ? 'Edit Service' : 'Add New Service'}
        subtitle="Configure the capability details displayed on the website"
      >
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <FormField
            id="service-name"
            label="Service Title"
            required
            error={errors.name?.message}
          >
            <input
              id="service-name"
              type="text"
              placeholder="e.g. AI & ML Solutions"
              className={`input-field ${errors.name ? 'border-red-500' : ''}`}
              {...register('name')}
            />
          </FormField>

          <FormField
            id="service-icon"
            label="Visual Icon"
            required
            error={errors.icon?.message}
          >
            <select
              id="service-icon"
              className="input-field bg-navy-900 text-white cursor-pointer"
              {...register('icon')}
            >
              {SERVICE_ICONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-navy-900 text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            id="service-description"
            label="Description"
            required
            error={errors.description?.message}
            helperText="Write a concise overview of what Code Eagle delivers for this service."
          >
            <textarea
              id="service-description"
              rows={4}
              placeholder="e.g. Architecting high-performance cloud infrastructure and microservices..."
              className={`input-field resize-none ${
                errors.description ? 'border-red-500' : ''
              }`}
              {...register('description')}
            />
          </FormField>

          <div className="flex items-center gap-2 pt-1">
            <input
              id="service-active"
              type="checkbox"
              className="w-4 h-4 rounded bg-navy-900 border-border-blue text-brand-cyan focus:ring-brand-cyan"
              {...register('active')}
            />
            <label htmlFor="service-active" className="text-xs text-brand-text select-none cursor-pointer">
              Set active immediately (visible to visitors)
            </label>
          </div>

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
              <span>{editingService ? 'Save Changes' : 'Create Service'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        isLoading={actionLoading}
        title="Delete Service"
        message={`Are you sure you want to permanently delete "${serviceToDelete?.name}"? Any related statistics will be preserved.`}
        confirmText="Yes, Delete Service"
        isDanger={true}
      />
    </div>
  );
};

export default Services;

