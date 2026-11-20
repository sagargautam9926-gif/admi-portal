
import React, { useState, useEffect, useCallback } from 'react';
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
  name: z.string().min(2, {
    message: 'Service name must be at least 2 characters',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters',
  }),
  icon: z.string().min(1, {
    message: 'Please select an icon',
  }),
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

  // Fetch services
  const fetchServices = useCallback(async () => {
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
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(fetchServices, 250);
    return () => clearTimeout(timer);
  }, [fetchServices]);

  // Open Add Service Modal
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

  // Automatically open modal for ?action=new
  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      openAddModal();

      const updatedParams = new URLSearchParams(searchParams);
      updatedParams.delete('action');

      setSearchParams(updatedParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Open Edit Service Modal
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

  // Add or Update Service
  const handleFormSubmit = async (data) => {
    setActionLoading(true);

    try {
      if (editingService) {
        const updated = await servicesService.updateService(
          editingService.id,
          data
        );

        setServices((prev) =>
          prev.map((service) =>
            service.id === editingService.id ? updated : service
          )
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
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle Service Visibility
  const handleToggleActive = async (service) => {
    try {
      const updated = await servicesService.toggleServiceActive(service.id);

      setServices((prev) =>
        prev.map((item) =>
          item.id === service.id ? updated : item
        )
      );

      toast.success(
        `Service "${service.name}" is now ${
          updated.active ? 'Visible' : 'Hidden'
        }.`
      );
    } catch (err) {
      toast.error('Failed to change visibility.');
      console.error(err);
    }
  };

  // Open Delete Confirmation
  const confirmDelete = (service) => {
    setServiceToDelete(service);
    setDeleteConfirmOpen(true);
  };

  // Delete Service
  const handleDelete = async () => {
    if (!serviceToDelete) return;

    setActionLoading(true);

    try {
      await servicesService.deleteService(serviceToDelete.id);

      setServices((prev) =>
        prev.filter((service) => service.id !== serviceToDelete.id)
      );

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

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-6 h-6 text-blue-600" />
            Offered Services
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage company services showcased on the public Code Eagle portal.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      {/* Search and Service Count */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services by keyword..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs text-slate-500">
          <span>Total Services:</span>

          <span className="font-bold text-blue-700 px-3 py-1 rounded-full bg-blue-50 border border-blue-100">
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
                className={`bg-white rounded-2xl p-5 sm:p-6 flex flex-col justify-between border shadow-sm hover:shadow-md transition-all duration-200 group ${
                  service.active
                    ? 'border-slate-200'
                    : 'border-slate-200 opacity-75'
                }`}
              >
                <div>

                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-5">

                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 group-hover:bg-blue-100 transition-colors">
                      <IconComp className="w-6 h-6" />
                    </div>

                    <StatusBadge
                      status={service.active ? 'Active' : 'Inactive'}
                    />
                  </div>

                  {/* Service Details */}
                  <h3 className="text-base font-semibold text-slate-900">
                    {service.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Card Actions */}
                <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between gap-2">

                  {/* Visibility Toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggleActive(service)}
                    className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 transition-colors"
                    title={
                      service.active
                        ? 'Hide from public site'
                        : 'Show on public site'
                    }
                  >
                    {service.active ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
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

                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => openEditModal(service)}
                      className="p-2 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 hover:bg-blue-100 transition-colors"
                      title="Edit Service"
                      aria-label={`Edit ${service.name}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Admin Only Delete */}
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => confirmDelete(service)}
                        className="p-2 rounded-lg bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 transition-colors"
                        title="Delete Service"
                        aria-label={`Delete ${service.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
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
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4"
        >

          {/* Service Name */}
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
              className={`w-full px-4 py-2.5 text-sm bg-slate-50 border rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 ${
                errors.name ? 'border-red-400' : 'border-slate-200'
              }`}
              {...register('name')}
            />
          </FormField>

          {/* Service Icon */}
          <FormField
            id="service-icon"
            label="Visual Icon"
            required
            error={errors.icon?.message}
          >
            <select
              id="service-icon"
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 cursor-pointer"
              {...register('icon')}
            >
              {SERVICE_ICONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FormField>

          {/* Description */}
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
              className={`w-full px-4 py-3 text-sm bg-slate-50 border rounded-xl text-slate-700 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 ${
                errors.description ? 'border-red-400' : 'border-slate-200'
              }`}
              {...register('description')}
            />
          </FormField>

          {/* Active Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              id="service-active"
              type="checkbox"
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              {...register('active')}
            />

            <label
              htmlFor="service-active"
              className="text-xs text-slate-600 select-none cursor-pointer"
            >
              Set active immediately (visible to visitors)
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">

            <button
              type="button"
              disabled={actionLoading}
              onClick={() => setModalOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs sm:text-sm font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={actionLoading}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors disabled:opacity-60"
            >
              {actionLoading && <Loader size="sm" text="" />}

              {editingService ? 'Save Changes' : 'Create Service'}
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
        title="Delete Service"
        message={`Are you sure you want to permanently delete "${serviceToDelete?.name}"? Any related statistics will be preserved.`}
        confirmText="Yes, Delete Service"
        isDanger={true}
      />
    </div>
  );
};

export default Services;
