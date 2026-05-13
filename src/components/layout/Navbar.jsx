"use client";

import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import Link from "next/link";
import { logout } from "../../store/slices/authSlice";
import { openAuthModal } from "../../store/slices/uiSlice";
import { RiSparklingFill } from "react-icons/ri";
import { HiOutlineClock, HiOutlineLogout, HiOutlineUser } from "react-icons/hi";

export default function Navbar() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((s) => s.auth);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-ink-700/60 glass"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-jade-500/10 border border-jade-500/30 flex items-center justify-center group-hover:bg-jade-500/20 transition-colors">
            <RiSparklingFill className="text-jade-400 text-sm" />
          </div>
          <span className="font-display text-lg text-white tracking-tight">
            AI<span className="gradient-text">Summarizer</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm text-slate-400 hover:text-jade-400 transition-colors font-medium"
          >
            Summarize
          </Link>
          {isAuthenticated && (
            <Link
              href="/history"
              className="text-sm text-slate-400 hover:text-jade-400 transition-colors font-medium flex items-center gap-1.5"
            >
              <HiOutlineClock className="text-base" />
              History
            </Link>
          )}
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ink-800 border border-ink-700">
                <div className="w-6 h-6 rounded-full bg-jade-500/20 border border-jade-500/30 flex items-center justify-center">
                  <HiOutlineUser className="text-jade-400 text-xs" />
                </div>
                <span className="text-sm text-slate-300 font-medium">
                  {user?.name?.split(" ")[0]}
                </span>
              </div>
              <button
                onClick={() => dispatch(logout())}
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-400 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-500/5"
              >
                <HiOutlineLogout className="text-base" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => dispatch(openAuthModal("login"))}
                className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-ink-800"
              >
                Log in
              </button>
              <button
                onClick={() => dispatch(openAuthModal("register"))}
                className="text-sm bg-jade-500 hover:bg-jade-400 text-ink-950 font-semibold px-4 py-1.5 rounded-lg transition-colors"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
