"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  loginUser,
  registerUser,
  clearError,
} from "../../store/slices/authSlice";
import { closeAuthModal, openAuthModal } from "../../store/slices/uiSlice";
import {
  HiX,
  HiMail,
  HiLockClosed,
  HiUser,
  HiEye,
  HiEyeOff,
} from "react-icons/hi";
import { RiSparklingFill } from "react-icons/ri";
import toast from "react-hot-toast";

export default function AuthModal() {
  const dispatch = useDispatch();
  const { authModal } = useSelector((s) => s.ui);
  const { loading, error, isAuthenticated } = useSelector((s) => s.auth);

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);

  const isLogin = authModal === "login";

  useEffect(() => {
    if (isAuthenticated && authModal) {
      dispatch(closeAuthModal());
      toast.success(isLogin ? "Welcome back!" : "Account created!");
    }
  }, [isAuthenticated, authModal]);

  useEffect(() => {
    setForm({ name: "", email: "", password: "" });
    dispatch(clearError());
  }, [authModal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      dispatch(loginUser({ email: form.email, password: form.password }));
    } else {
      dispatch(registerUser(form));
    }
  };

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  if (!authModal) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={() => dispatch(closeAuthModal())}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="w-full max-w-md bg-ink-900 border border-ink-700 rounded-2xl p-8 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <RiSparklingFill className="text-jade-400" />
                <span className="text-xs text-jade-400 font-mono uppercase tracking-widest">
                  AI Summarizer
                </span>
              </div>
              <h2 className="font-display text-2xl text-white">
                {isLogin ? "Welcome back" : "Create account"}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {isLogin
                  ? "Sign in to access your summaries"
                  : "Start summarizing with AI today"}
              </p>
            </div>
            <button
              onClick={() => dispatch(closeAuthModal())}
              className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-ink-700 transition-colors"
            >
              <HiX className="text-lg" />
            </button>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-base" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full name"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-ink-800 border border-ink-700 rounded-xl text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:border-jade-500/50 focus:ring-1 focus:ring-jade-500/20"
                />
              </div>
            )}

            <div className="relative">
              <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-base" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email address"
                required
                className="w-full pl-10 pr-4 py-3 bg-ink-800 border border-ink-700 rounded-xl text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:border-jade-500/50 focus:ring-1 focus:ring-jade-500/20"
              />
            </div>

            <div className="relative">
              <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-base" />
              <input
                type={showPass ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                required
                minLength={6}
                className="w-full pl-10 pr-10 py-3 bg-ink-800 border border-ink-700 rounded-xl text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:border-jade-500/50 focus:ring-1 focus:ring-jade-500/20"
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPass ? <HiEyeOff /> : <HiEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-jade-500 hover:bg-jade-400 disabled:opacity-50 disabled:cursor-not-allowed text-ink-950 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-ink-950/30 border-t-ink-950 rounded-full animate-spin" />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </>
              ) : (
                <>{isLogin ? "Sign in" : "Create account"}</>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() =>
                dispatch(openAuthModal(isLogin ? "register" : "login"))
              }
              className="text-jade-400 hover:text-jade-300 font-medium transition-colors"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
