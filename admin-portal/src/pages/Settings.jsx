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
  AlertCircle,
} from 'lucide-react';
import FormField from '../components/FormField';
import Loader from '../components/Loader';
import { settingsService } from '../api/settingsService';
import toast from 'react-hot-toast';

const settingsSchema = z.object({
  contact: z.object({
    email: z.string()
      .min(1, { message: 'Contact email is required' })
      .email({ message: 'Please enter a valid email address' }),
    phone: z.string()
      .min(8, { message: 'Phone number must be at least 8 digits' }),
    officeLocation: z.string()
      .min(5, { message: 'Office location must be at least 5 characters' }),
  }),
  stats: z.object({
    engineeringHours: z.coerce.number()
      .min(0, { message: 'Must be at least 0' }),
    projectsDelivered: z.coerce.number()
      .min(0, { message: 'Must be at least 0' }),
    enterprisePartners: z.coerce.number()
      .min(0, { message: 'Must be at least 0' }),
    clientRetention: z.coerce.number()
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
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" text="Loading company settings..." />
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-6 sm:space-y-8 animate-fadeIn">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-blue-600" />
            Site & System Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage company contact information and homepage statistics.
          </p>
        </div>

        {isDirty && (
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
            <AlertCircle className="w-4 h-4" />
            Unsaved Changes
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Contact Information */}
        <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Official Contact Information
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Manage your company's public contact details.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">

            <FormField
              id="contact-email"
              label="Public Inquiry Email"
              required
              error={errors.contact?.email?.message}
            >
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="contact-email"
                  type="email"
                  placeholder="info@codeeagle.in"
                  className={`w-full bg-white border rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:ring-2 focus:ring-blue-100 focus:border-blue-500 ${
                    errors.contact?.email ? 'border-red-400' : 'border-slate-200'
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
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="contact-phone"
                  type="text"
                  placeholder="+91 731 456 7890"
                  className={`w-full bg-white border rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:ring-2 focus:ring-blue-100 focus:border-blue-500 ${
                    errors.contact?.phone ? 'border-red-400' : 'border-slate-200'
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
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <textarea
                    id="contact-location"
                    rows={3}
                    placeholder="Crystal IT Park, Ring Road, Indore, MP 452001, India"
                    className={`w-full bg-white border rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 resize-none outline-none transition focus:ring-2 focus:ring-blue-100 focus:border-blue-500 ${
                      errors.contact?.officeLocation ? 'border-red-400' : 'border-slate-200'
                    }`}
                    {...register('contact.officeLocation')}
                  />
                </div>
              </FormField>
            </div>
          </div>
        </section>

        {/* Homepage Statistics */}
        <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Public Metrics & Milestones
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Update the achievements displayed on your website homepage.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            <FormField
              id="stats-hours"
              label="Engineering Hours"
              required
              error={errors.stats?.engineeringHours?.message}
            >
              <div className="relative">
                <input
                  id="stats-hours"
                  type="number"
                  min="0"
                  placeholder="15000"
                  className={`w-full bg-white border rounded-xl px-4 py-3 pr-8 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 ${
                    errors.stats?.engineeringHours ? 'border-red-400' : 'border-slate-200'
                  }`}
                  {...register('stats.engineeringHours')}
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                  +
                </span>
              </div>
            </FormField>

            <FormField
              id="stats-projects"
              label="Projects Delivered"
              required
              error={errors.stats?.projectsDelivered?.message}
            >
              <div className="relative">
                <input
                  id="stats-projects"
                  type="number"
                  min="0"
                  placeholder="32"
                  className={`w-full bg-white border rounded-xl px-4 py-3 pr-8 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 ${
                    errors.stats?.projectsDelivered ? 'border-red-400' : 'border-slate-200'
                  }`}
                  {...register('stats.projectsDelivered')}
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                  +
                </span>
              </div>
            </FormField>

            <FormField
              id="stats-partners"
              label="Enterprise Partners"
              required
              error={errors.stats?.enterprisePartners?.message}
            >
              <div className="relative">
                <input
                  id="stats-partners"
                  type="number"
                  min="0"
                  placeholder="50"
                  className={`w-full bg-white border rounded-xl px-4 py-3 pr-8 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 ${
                    errors.stats?.enterprisePartners ? 'border-red-400' : 'border-slate-200'
                  }`}
                  {...register('stats.enterprisePartners')}
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                  +
                </span>
              </div>
            </FormField>

            <FormField
              id="stats-retention"
              label="Client Retention (%)"
              required
              error={errors.stats?.clientRetention?.message}
            >
              <div className="relative">
                <input
                  id="stats-retention"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="98"
                  className={`w-full bg-white border rounded-xl px-4 py-3 pr-9 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 ${
                    errors.stats?.clientRetention ? 'border-red-400' : 'border-slate-200'
                  }`}
                  {...register('stats.clientRetention')}
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                  %
                </span>
              </div>
            </FormField>
          </div>
        </section>

        {/* Save and Reset Actions */}
        <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-center sm:text-left">
            {isDirty ? (
              <span className="text-amber-700 font-medium">
                Changes have been made. Remember to save your updates.
              </span>
            ) : (
              <span className="text-slate-500">
                All settings are currently synchronized with the database.
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              disabled={!isDirty || saving}
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-medium hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>

            <button
              type="submit"
              disabled={!isDirty || saving}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-sm shadow-blue-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? (
                <Loader size="sm" text="" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </section>
      </form>
    </div>
  );
};

export default Settings;