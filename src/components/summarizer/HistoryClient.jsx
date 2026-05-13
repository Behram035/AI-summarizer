"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  fetchHistory,
  deleteSummary,
  toggleFavorite,
} from "../../store/slices/summarySlice";
import { openAuthModal } from "../../store/slices/uiSlice";
import {
  HiOutlineSearch,
  HiOutlineTrash,
  HiOutlineStar,
  HiStar,
  HiOutlineDocumentText,
  HiOutlineMicrophone,
  HiOutlineUpload,
  HiChevronLeft,
  HiChevronRight,
  HiOutlineFilter,
} from "react-icons/hi";
import { RiSparklingFill } from "react-icons/ri";
import toast from "react-hot-toast";

const TYPE_ICON = {
  text: HiOutlineDocumentText,
  audio: HiOutlineMicrophone,
  voice_note: HiOutlineUpload,
};

const SENTIMENT_DOT = {
  positive: "bg-jade-400",
  negative: "bg-red-400",
  neutral: "bg-slate-500",
  mixed: "bg-amber-400",
};

function SummaryCard({ summary, onDelete, onFavorite }) {
  const TypeIcon = TYPE_ICON[summary.inputType] || HiOutlineDocumentText;
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(summary._id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="bg-ink-900 border border-ink-700 rounded-xl p-4 hover:border-ink-600 transition-colors group"
    >
      <div className="flex items-start gap-3">
        {/* Type icon */}
        <div className="w-8 h-8 rounded-lg bg-ink-800 border border-ink-700 flex items-center justify-center flex-shrink-0 mt-0.5">
          <TypeIcon className="text-slate-500 text-sm" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Title + sentiment */}
          <div className="flex items-center gap-2 mb-1">
            {summary.sentiment && (
              <span
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${SENTIMENT_DOT[summary.sentiment] || "bg-slate-500"}`}
              />
            )}
            <h3 className="text-sm font-medium text-slate-200 truncate">
              {summary.title}
            </h3>
          </div>

          {/* Summary preview */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {summary.summary}
          </p>

          {/* Tags */}
          {summary.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {summary.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-1.5 py-0.5 bg-ink-700 text-slate-600 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Meta */}
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
            <span className="font-mono">{summary.wordCount}w</span>
            <span>·</span>
            <span>{summary.readingTime}m read</span>
            <span>·</span>
            <span>
              {new Date(summary.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onFavorite(summary._id, !summary.isFavorite)}
            className="p-1.5 rounded-lg text-slate-600 hover:text-amber-400 hover:bg-amber-500/5 transition-colors"
          >
            {summary.isFavorite ? (
              <HiStar className="text-amber-400" />
            ) : (
              <HiOutlineStar />
            )}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/5 transition-colors disabled:opacity-50"
          >
            {deleting ? (
              <span className="w-3 h-3 border border-red-400/50 border-t-red-400 rounded-full animate-spin block" />
            ) : (
              <HiOutlineTrash />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function HistoryClient() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { history, historyTotal, historyLoading, historyPage } = useSelector(
    (s) => s.summary,
  );
  const { isAuthenticated, initialized } = useSelector((s) => s.auth);

  const [search, setSearch] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [page, setPage] = useState(1);
  const LIMIT = 10;
  const totalPages = Math.ceil(historyTotal / LIMIT);

  useEffect(() => {
    if (!initialized) return;
    if (!isAuthenticated) {
      dispatch(openAuthModal("login"));
      return;
    }
    dispatch(
      fetchHistory({
        page,
        limit: LIMIT,
        search,
        favorite: favoritesOnly ? "true" : "",
      }),
    );
  }, [isAuthenticated, initialized, page, search, favoritesOnly]);

  const handleDelete = async (id) => {
    await dispatch(deleteSummary(id));
    toast.success("Summary deleted");
  };

  const handleFavorite = (id, isFavorite) => {
    dispatch(toggleFavorite({ id, isFavorite }));
    toast.success(isFavorite ? "Added to favorites" : "Removed from favorites");
  };

  if (!isAuthenticated && initialized) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-500">Please sign in to view your history.</p>
      </div>
    );
  }

  return (
    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30 pointer-events-none" />

      <div className="relative space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <RiSparklingFill className="text-jade-400 text-sm" />
              <span className="text-xs text-jade-400 font-mono uppercase tracking-widest">
                Your Library
              </span>
            </div>
            <h1 className="font-display text-3xl text-white">
              Summary History
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {historyTotal} summaries saved
            </p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="text-sm px-4 py-2 bg-jade-500 hover:bg-jade-400 text-ink-950 font-semibold rounded-xl transition-colors"
          >
            + New Summary
          </button>
        </motion.div>

        {/* Search + Filter */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by title, summary, or tags..."
              className="w-full pl-9 pr-4 py-2.5 bg-ink-900 border border-ink-700 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-jade-500/40"
            />
          </div>
          <button
            onClick={() => {
              setFavoritesOnly((p) => !p);
              setPage(1);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-colors ${
              favoritesOnly
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                : "bg-ink-900 border-ink-700 text-slate-500 hover:text-slate-300"
            }`}
          >
            <HiOutlineFilter />
            <span className="hidden sm:inline">Favorites</span>
          </button>
        </div>

        {/* List */}
        {historyLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-ink-900 border border-ink-700 rounded-xl p-4"
              >
                <div className="flex gap-3">
                  <div className="shimmer w-8 h-8 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="shimmer h-4 w-2/3 rounded" />
                    <div className="shimmer h-3 w-full rounded" />
                    <div className="shimmer h-3 w-4/5 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : history.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 border border-dashed border-ink-700 rounded-2xl"
          >
            <div className="text-4xl mb-3">📭</div>
            <p className="text-slate-500 font-medium">
              {search ? "No summaries match your search" : "No summaries yet"}
            </p>
            <p className="text-slate-600 text-sm mt-1">
              {search
                ? "Try a different query"
                : "Generate your first summary to see it here"}
            </p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="space-y-3">
              {history.map((summary) => (
                <SummaryCard
                  key={summary._id}
                  summary={summary}
                  onDelete={handleDelete}
                  onFavorite={handleFavorite}
                />
              ))}
            </div>
          </AnimatePresence>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg bg-ink-800 border border-ink-700 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <HiChevronLeft />
            </button>
            <span className="text-sm text-slate-400 font-mono">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg bg-ink-800 border border-ink-700 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <HiChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
