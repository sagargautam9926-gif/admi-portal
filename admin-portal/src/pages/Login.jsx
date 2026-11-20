import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldAlert,
  Loader2,
  ArrowRight,
  Sparkles,
  Cpu,
  Globe,
  Database,
  Cloud,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { STORAGE_KEYS } from '../utils/constants';
import CodeEagleLogo from '../components/CodeEagleLogo';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email address is required' })
    .email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  rememberMe: z.boolean().optional(),
});

export const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const destination = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, navigate, destination]);

  const savedEmail = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) || '';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: savedEmail || '',
      password: '',
      rememberMe: !!savedEmail,
    },
  });

  const onSubmit = async (data) => {
    setAuthError('');
    setSubmitting(true);
    try {
      await login(data);
      toast.success('Welcome back! Authentication successful.');
      navigate(destination, { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Invalid email or password. Please verify your credentials.';
      setAuthError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const fillCredentials = (email, password) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', password, { shouldValidate: true });
    setAuthError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden bg-[#030b2c] neon-wave-bg">
      {/* Background glow effects matching the mockup */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-blue/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-cyan-400/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-1/3 w-72 h-72 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-5xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Visual Branding Panel (Matching Screen 1 of Mockup) */}
        <div className="hidden lg:flex lg:col-span-6 flex-col justify-between pr-4 space-y-8">
          <div>
            <CodeEagleLogo size="lg" className="mb-8" />

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-brand-cyan/40 text-brand-cyan text-xs font-semibold mb-4 shadow-[0_0_15px_rgba(25,211,255,0.25)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-POWERED SOFTWARE SOLUTIONS</span>
            </div>

            <h1 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight tracking-tight">
              Building Intelligent <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-white to-brand-blue drop-shadow-[0_0_20px_rgba(25,211,255,0.4)]">
                Digital Solutions
              </span>
            </h1>

            <p className="text-sm text-brand-text/85 mt-4 leading-relaxed">
              We help businesses innovate, automate, and scale with modern technology, enterprise cloud architecture, and industry-focused software.
            </p>
          </div>

          {/* Electric Eagle Crest & Tech Stack Badges from Mockup */}
          <div className="relative py-4 flex items-center justify-center">
            {/* Center glowing orb with eagle wings aesthetic */}
            <div className="w-56 h-56 rounded-full bg-gradient-to-b from-brand-blue/30 to-brand-cyan/20 p-1 border border-brand-cyan/40 shadow-[0_0_40px_rgba(25,211,255,0.3)] flex items-center justify-center relative">
              {/* Concentric orbital rings */}
              <div className="absolute inset-2 rounded-full border border-dashed border-brand-cyan/30 animate-spin" style={{ animationDuration: '40s' }} />
              <div className="absolute inset-8 rounded-full border border-brand-blue/50" />
              
              {/* Electric Eagle Icon in center */}
              <div className="text-center relative z-10">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-brand-blue to-cyan-400 p-0.5 shadow-[0_0_25px_rgba(25,211,255,0.6)] flex items-center justify-center">
                  <div className="w-full h-full bg-[#030b2c] rounded-[14px] flex items-center justify-center text-brand-cyan">
                    <Cpu className="w-8 h-8" />
                  </div>
                </div>
                <p className="text-xs font-bold text-white mt-2 tracking-wider">CODE EAGLE</p>
                <p className="text-[10px] text-brand-cyan">INDORE • GLOBAL</p>
              </div>

              {/* Floating tech badges matching the hero section */}
              <span className="absolute -top-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#07174e] border border-cyan-400/60 text-cyan-300 shadow-glow-sm">
                AI / ML
              </span>
              <span className="absolute -right-3 top-12 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#07174e] border border-brand-blue/60 text-white shadow-glow-sm">
                React.js
              </span>
              <span className="absolute -bottom-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#07174e] border border-cyan-400/60 text-cyan-300 shadow-glow-sm">
                Cloud & DevOps
              </span>
              <span className="absolute -left-3 bottom-14 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#07174e] border border-brand-blue/60 text-white shadow-glow-sm">
                Python
              </span>
            </div>
          </div>

          {/* Metric Badges Matching Screen 1 & 2 */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#1a3888]/60 text-center">
            <div>
              {/* <p className="text-base font-bold text-white">10+</p>
              <p className="text-[10px] text-brand-muted">Years Exp</p> */}
            </div>
            <div>
              {/* <p className="text-base font-bold text-brand-cyan">100+</p>
              <p className="text-[10px] text-brand-muted">Projects</p> */}
            </div>
            <div>
              {/* <p className="text-base font-bold text-white">50+</p>
              <p className="text-[10px] text-brand-muted">Clients</p> */}
            </div>
            <div>
              {/* <p className="text-base font-bold text-brand-cyan">98%</p>
              <p className="text-[10px] text-brand-muted">Satisfaction</p> */}
            </div>
          </div>
        </div>

        {/* Right Authentication Card */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          {/* Mobile brand view */}
          <div className="lg:hidden text-center mb-6">
            <CodeEagleLogo size="lg" className="justify-center mb-2" />
            <p className="text-xs text-brand-muted">
              Admin & Content Operations Management Portal
            </p>
          </div>

          {/* Login Card */}
          <div className="card-gradient border border-[#1c3a9e] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            {/* Top Cyan Glow Accent Line */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-brand-cyan to-transparent shadow-[0_0_10px_#19d3ff]" />

            <div className="mb-6">
              <h2 className="text-xl font-bold text-white tracking-wide">
                Admin Portal Login
              </h2>
              <p className="text-xs text-brand-muted mt-1">
                Enter your authorized credentials to access the portal
              </p>
            </div>

            {authError && (
              <div
                role="alert"
                className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-start gap-2.5 shadow-[0_0_12px_rgba(239,68,68,0.2)] animate-fadeIn"
              >
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-brand-text"
                >
                  Email Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="admin@codeeagle.in"
                    className={`input-field pl-10 ${
                      errors.email ? 'border-red-500' : ''
                    }`}
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-brand-text"
                >
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className={`input-field pl-10 pr-10 ${
                      errors.password ? 'border-red-500' : ''
                    }`}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-brand-muted hover:text-brand-cyan transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-brand-text">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded bg-[#061445] border-border-blue text-brand-cyan focus:ring-brand-cyan focus:ring-offset-0 focus:ring-1 cursor-pointer"
                    {...register('rememberMe')}
                  />
                  <span>Remember me</span>
                </label>
                <span className="text-[11px] text-brand-muted">Indore, India</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary py-3 text-sm flex items-center justify-center gap-2 mt-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials */}
            <div className="mt-6 pt-5 border-t border-border-blue/50">
              <p className="text-[11px] uppercase tracking-wider font-semibold text-brand-muted mb-2.5">
                Quick Demo Accounts (1-Click Fill):
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => fillCredentials('admin@codeeagle.in', 'Admin@123')}
                  className="p-2.5 rounded-xl bg-[#061445]/80 border border-border-blue hover:border-brand-cyan text-left transition-all hover:bg-[#0b216d]/50 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white group-hover:text-brand-cyan text-xs">
                      Admin
                    </span>
                    <span className="text-[10px] text-cyan-400 bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-800">
                      Full Access
                    </span>
                  </div>
                  <p className="text-[10px] text-brand-muted truncate mt-0.5">
                    admin@codeeagle.in
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => fillCredentials('editor@codeeagle.in', 'Editor@123')}
                  className="p-2.5 rounded-xl bg-[#061445]/80 border border-border-blue hover:border-brand-cyan text-left transition-all hover:bg-[#0b216d]/50 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white group-hover:text-brand-cyan text-xs">
                      Editor
                    </span>
                    <span className="text-[10px] text-amber-400 bg-amber-950/80 px-1.5 py-0.2 rounded border border-amber-800">
                      Read/Write
                    </span>
                  </div>
                  <p className="text-[10px] text-brand-muted truncate mt-0.5">
                    editor@codeeagle.in
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
