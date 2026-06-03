import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Loader2, Wallet, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#090b11] text-slate-100 font-sans overflow-hidden"
    >
      {/* Left side: Premium Branding Visuals (hidden on mobile/tablet) */}
      <div className="hidden lg:flex lg:col-span-7 bg-[#0b0f19] border-r border-slate-800/40 relative flex-col justify-between p-12 overflow-hidden">
        {/* Decorative Glowing Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Animated Lines Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Top Branding Header */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold font-heading bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Expense<span className="text-indigo-400">Flow</span>
          </span>
        </div>

        {/* Middle Value Pitch */}
        <div className="max-w-md relative z-10 my-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-extrabold font-heading tracking-tight leading-[1.1] mb-6"
          >
            Create your account in <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">seconds.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-base leading-relaxed mb-8"
          >
            Join ExpenseFlow today and access the secure control center to organize transactions, track metrics, and optimize your wealth.
          </motion.p>

          {/* Feature List */}
          <div className="space-y-4">
            {[
              'Secure JWT authentication',
              'Responsive fintech-styled dashboards',
              'Real-time category & monthly analytics',
              'Export transaction history to CSV',
            ].map((text, i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3 text-sm text-slate-350"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer Credit */}
        <div className="relative z-10 text-xs text-slate-500">
          © {new Date().getFullYear()} ExpenseFlow. Powered by Premium SaaS framework.
        </div>
      </div>

      {/* Right side: Register Form Panel */}
      <div className="lg:col-span-5 flex items-center justify-center p-6 sm:p-12 relative">
        {/* Mini background glow for mobile */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[80px] pointer-events-none lg:hidden" />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 shadow-2xl glass-panel relative z-10"
        >
          {/* Mobile branding */}
          <div className="flex items-center gap-3 justify-center mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold font-heading">
              Expense<span className="text-indigo-400">Flow</span>
            </span>
          </div>

          <h2 className="text-2xl font-extrabold font-heading text-slate-100 text-center mb-1">
            Get started
          </h2>
          <p className="text-slate-500 text-sm text-center mb-8">
            Create your premium account today
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Field */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 pointer-events-none">
                  <User className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-slate-100 placeholder-slate-650 glass-input text-sm"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 pointer-events-none">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-slate-100 placeholder-slate-650 glass-input text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 pointer-events-none">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  value={password}
                  minLength={6}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-slate-100 placeholder-slate-650 glass-input text-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold transition-all shadow-md shadow-indigo-500/20 text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.99] disabled:opacity-50 pt-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="text-slate-400 text-sm text-center mt-8">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline transition-colors"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Register;
