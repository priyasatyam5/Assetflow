import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiMoon, FiSun, FiArrowRight, FiBox } from 'react-icons/fi';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import FlowIllustration from '../../components/common/FlowIllustration.jsx';
import { ToastContainer } from '../../components/common/Toast.jsx';
import { useToast } from '../../hooks/useToast.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { registerRequest } from '../../services/authService.js';

const STATS = [
  { value: '12,400+', label: 'Assets tracked' },
  { value: '38', label: 'Departments' },
  { value: '99.9%', label: 'Uptime' },
];

export default function LoginPage() {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const { login, isAuthenticating } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toasts, showToast, dismissToast } = useToast();
  const [isRegistering, setIsRegistering] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: 'onBlur' });

  const onSignIn = async (values) => {
    try {
      await login({
        email: values.email,
        password: values.password,
        remember: !!values.remember,
      });
      showToast('Welcome back! Redirecting to your dashboard…', 'success');
    } catch (err) {
      showToast(err?.message || 'Incorrect email or password.', 'error');
    }
  };

  const onSignUp = async (values) => {
    setIsRegistering(true);
    try {
      const res = await registerRequest(values);
      showToast(res.message || 'Account created successfully.', 'success');
      reset();
      setMode('signin');
    } catch (err) {
      showToast(err?.message || 'Could not create account. Try again.', 'error');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-surface dark:bg-surface-dark transition-colors duration-300">
      <ToastContainer toasts={toasts} onClose={dismissToast} />

      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-[length:32px_32px] opacity-40 dark:opacity-20" />
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />

      {/* Dark mode toggle */}
      <button
        onClick={toggleTheme}
        className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full glass-panel text-slate-600 dark:text-slate-200 hover:scale-105 transition-transform"
        aria-label="Toggle dark mode"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </motion.span>
        </AnimatePresence>
      </button>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="grid w-full overflow-hidden rounded-xl2 shadow-glass-lg lg:grid-cols-2"
        >
          {/* Brand / Illustration panel */}
          <div className="relative hidden flex-col justify-between bg-gradient-primary p-10 text-white lg:flex">
            <div className="pointer-events-none absolute inset-0 bg-gradient-radial" />
            <div className="relative z-10 flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md">
                <FiBox className="text-xl" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight">AssetFlow</span>
            </div>

            <div className="relative z-10 my-6">
              <FlowIllustration />
            </div>

            <div className="relative z-10 space-y-5">
              <h2 className="font-display text-2xl font-semibold leading-snug">
                Manage Enterprise Assets, Smarter.
              </h2>
              <p className="max-w-sm text-sm text-white/80">
                One workspace to register, allocate, transfer, and maintain every
                asset and resource across your organization — in real time.
              </p>
              <div className="flex gap-6 border-t border-white/20 pt-5">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <p className="font-display text-lg font-bold">{s.value}</p>
                    <p className="text-xs text-white/70">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form panel */}
          <div className="glass-panel flex flex-col justify-center px-8 py-10 sm:px-12 lg:rounded-none">
            {/* Mobile logo */}
            <div className="mb-8 flex items-center gap-2.5 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-white shadow-glow">
                <FiBox className="text-xl" />
              </div>
              <span className="font-display text-xl font-bold text-ink dark:text-ink-dark">
                AssetFlow
              </span>
            </div>

            <AnimatePresence mode="wait">
              {mode === 'signin' ? (
                <motion.div
                  key="signin"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                >
                  <h1 className="font-display text-2xl font-bold text-ink dark:text-ink-dark">
                    Welcome back
                  </h1>
                  <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                    Sign in to continue to your workspace.
                  </p>

                  <form onSubmit={handleSubmit(onSignIn)} className="mt-8 space-y-5" noValidate>
                    <Input
                      label="Email"
                      icon={FiMail}
                      type="email"
                      placeholder="name@company.com"
                      error={errors.email?.message}
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Enter a valid email address',
                        },
                      })}
                    />
                    <Input
                      label="Password"
                      icon={FiLock}
                      type="password"
                      placeholder="Enter your password"
                      error={errors.password?.message}
                      {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Minimum 6 characters' },
                      })}
                    />

                    <div className="flex items-center justify-between text-sm">
                      <label className="flex select-none items-center gap-2 text-slate-600 dark:text-slate-300">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/30"
                          {...register('remember')}
                        />
                        Remember me
                      </label>
                      <button
                        type="button"
                        onClick={() => showToast('Password reset link sent if the account exists.', 'info')}
                        className="font-medium text-primary hover:text-primary-600 transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      isLoading={isAuthenticating}
                      className="w-full"
                    >
                      Sign In <FiArrowRight />
                    </Button>
                  </form>

                  <div className="mt-8 flex items-center gap-3">
                    <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                    <span className="text-xs uppercase tracking-wide text-slate-400">New here?</span>
                    <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                  </div>

                  <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
                    Signing up creates an employee account — admin roles are
                    assigned by your workspace administrator later.
                  </p>

                  <Button
                    variant="outline"
                    size="lg"
                    className="mt-3 w-full"
                    onClick={() => setMode('signup')}
                  >
                    Create Account
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                >
                  <h1 className="font-display text-2xl font-bold text-ink dark:text-ink-dark">
                    Create your account
                  </h1>
                  <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                    You'll get employee access. Admins can promote your role anytime.
                  </p>

                  <form onSubmit={handleSubmit(onSignUp)} className="mt-8 space-y-5" noValidate>
                    <Input
                      label="Full name"
                      icon={FiUser}
                      placeholder="Priya Shah"
                      error={errors.name?.message}
                      {...register('name', { required: 'Full name is required' })}
                    />
                    <Input
                      label="Work email"
                      icon={FiMail}
                      type="email"
                      placeholder="name@company.com"
                      error={errors.email?.message}
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Enter a valid email address',
                        },
                      })}
                    />
                    <Input
                      label="Password"
                      icon={FiLock}
                      type="password"
                      placeholder="Create a password"
                      error={errors.password?.message}
                      {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Minimum 6 characters' },
                      })}
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      isLoading={isRegistering}
                      className="w-full"
                    >
                      Create Account <FiArrowRight />
                    </Button>
                  </form>

                  <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                    Already have an account?{' '}
                    <button
                      onClick={() => setMode('signin')}
                      className="font-medium text-primary hover:text-primary-600 transition-colors"
                    >
                      Sign in
                    </button>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
