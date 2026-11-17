import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Settings as SettingsIcon,
  Save,
  RotateCcw,
  Building,
  Mail,
  Phone,
  MapPin,
  Award,
  Users,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import FormField from '../components/FormField';
import Loader from '../components/Loader';
import { settingsService } from '../api/settingsService';
import toast from 'react-hot-toast';

const settingsSchema = z.object({
  contact: z.object({
    email: z
      .string()
      .min(1, { message: 'Contact email is required' })
      .email({ message: 'Please enter a valid email address' }),
    phone: z
      .string()
      .min(8, { message: 'Phone number must be at least 8 digits' }),
    officeLocation: z
      .string()
      .min(5, { message: 'Office location must be at least 5 characters' }),
  }),
  stats: z.object({
    yearsExperience: z.coerce
      .number({ invalid_type_error: 'Must be a number' })
      .min(0, { message: 'Must be at least 0' }),
    projectsCompleted: z.coerce
      .number({ invalid_type_error: 'Must be a number' })
      .min(0, { message: 'Must be at least 0' }),
    activeClients: z.coerce
      .number({ invalid_type_error: 'Must be a number' })
      .min(0, { message: 'Must be at least 0' }),
    clientSatisfaction: z.coerce
      .number({ invalid_type_error: 'Must be a number' })
      .min(0, { message: 'Min 0%' })
      .max(100, { message: 'Max 100%' }),
  }),
});

export const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initialData, setInitialData] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(settingsSchema),
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsService.getSettings();
      setInitialData(data);
      reset(data);
    } catch (err) {
      toast.error('Failed to load site settings.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const onSubmit = async (formData) => {
    setSaving(true);
    try {
      const updated = await settingsService.updateSettings(formData);
      setInitialData(updated);
      reset(updated);
      toast.success('Site settings and company stats updated successfully!');
    } catch (err) {
      toast.error(err?.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (initialData) {
      reset(initialData);
      toast('Form changes restored to saved state', { icon: '🔄' });
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <Loader size="lg" text="Loading company settings..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-4xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-brand-cyan" />
            <span>Site & System Settings</span>
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            Global business contact info and homepage statistics for Code Eagle
          </p>
        </div>

        {/* Unsaved Changes Indicator Pill */}
        {isDirty && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-semibold animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.25)]">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Unsaved Changes</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section 1: Contact Information */}
        <div className="card-gradient border border-border-blue/70 p-5 sm:p-7 space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border-blue/50">
            <Building className="w-5 h-5 text-brand-cyan" />
            <h2 className="text-base font-semibold text-white">
              Official Contact & Office Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <FormField
              id="contact-email"
              label="Public Inquiry Email"
              required
              error={errors.contact?.email?.message}
            >
              <div className="relative">
                <Mail className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="contact-email"
                  type="email"
                  placeholder="info@codeeagle.in"
                  className={`input-field pl-10 ${
                    errors.contact?.email ? 'border-red-500' : ''
                  }`}
                  {...register('contact.email')}
                />
              </div>
            </FormField>

            <FormField
              id="contact-phone"
              label="Office Phone Number"
              required
              error={errors.contact?.phone?.message}
            >
              <div className="relative">
                <Phone className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="contact-phone"
                  type="text"
                  placeholder="+91 731 456 7890"
                  className={`input-field pl-10 ${
                    errors.contact?.phone ? 'border-red-500' : ''
                  }`}
                  {...register('contact.phone')}
                />
              </div>
            </FormField>

            <div className="md:col-span-2">
              <FormField
                id="contact-location"
                label="Registered Headquarters Location"
                required
                error={errors.contact?.officeLocation?.message}
                helperText="Physical office address shown in website footer and contact page."
              >
                <div className="relative">
                  <MapPin className="w-4 h-4 text-brand-muted absolute left-3.5 top-3" />
                  <textarea
                    id="contact-location"
                    rows={2}
                    placeholder="Crystal IT Park, Ring Road, Indore, MP 452001, India"
                    className={`input-field pl-10 resize-none ${
                      errors.contact?.officeLocation ? 'border-red-500' : ''
                    }`}
                    {...register('contact.officeLocation')}
                  />
                </div>
              </FormField>
            </div>
          </div>
        </div>

        {/* Section 2: Homepage Statistics */}
        <div className="card-gradient border border-border-blue/70 p-5 sm:p-7 space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border-blue/50">
            <Award className="w-5 h-5 text-brand-cyan" />
            <div>
              <h2 className="text-base font-semibold text-white">
                Public Metrics & Milestones
              </h2>
              <p className="text-xs text-brand-muted mt-0.5">
                Key numerical achievements featured prominently on the landing page
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormField
              id="stats-years"
              label="Years in Business"
              required
              error={errors.stats?.yearsExperience?.message}
            >
              <input
                id="stats-years"
                type="number"
                min="0"
                className={`input-field font-semibold text-brand-cyan ${
                  errors.stats?.yearsExperience ? 'border-red-500' : ''
                }`}
                {...register('stats.yearsExperience')}
              />
            </FormField>

            <FormField
              id="stats-projects"
              label="Projects Completed"
              required
              error={errors.stats?.projectsCompleted?.message}
            >
              <input
                id="stats-projects"
                type="number"
                min="0"
                className={`input-field font-semibold text-brand-cyan ${
                  errors.stats?.projectsCompleted ? 'border-red-500' : ''
                }`}
                {...register('stats.projectsCompleted')}
              />
            </FormField>

            <FormField
              id="stats-clients"
              label="Active Global Clients"
              required
              error={errors.stats?.activeClients?.message}
            >
              <input
                id="stats-clients"
                type="number"
                min="0"
                className={`input-field font-semibold text-brand-cyan ${
                  errors.stats?.activeClients ? 'border-red-500' : ''
                }`}
                {...register('stats.activeClients')}
              />
            </FormField>

            <FormField
              id="stats-satisfaction"
              label="Client Satisfaction (%)"
              required
              error={errors.stats?.clientSatisfaction?.message}
            >
              <div className="relative">
                <input
                  id="stats-satisfaction"
                  type="number"
                  min="0"
                  max="100"
                  className={`input-field font-semibold text-brand-cyan pr-8 ${
                    errors.stats?.clientSatisfaction ? 'border-red-500' : ''
                  }`}
                  {...register('stats.clientSatisfaction')}
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-brand-muted">
                  %
                </span>
              </div>
            </FormField>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="card-gradient border border-border-blue/60 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-brand-muted text-center sm:text-left">
            {isDirty ? (
              <span className="text-amber-400 font-medium">
                Changes have been made. Remember to save your updates.
              </span>
            ) : (
              <span>All settings are currently synchronized with the database.</span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              disabled={!isDirty || saving}
              onClick={handleReset}
              className="btn-secondary text-xs sm:text-sm py-2.5 px-4 flex items-center gap-2 disabled:opacity-40"
            >
              <RotateCcw className="w-4 h-4 text-brand-muted" />
              <span>Reset</span>
            </button>

            <button
              type="submit"
              disabled={!isDirty || saving}
              className="btn-primary text-xs sm:text-sm py-2.5 px-6 flex items-center gap-2 disabled:opacity-40"
            >
              {saving ? (
                <Loader size="sm" text="" />
              ) : (
                <Save className="w-4 h-4 text-brand-cyan" />
              )}
              <span>{saving ? 'Saving Changes...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Settings;

