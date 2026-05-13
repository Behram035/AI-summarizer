'use client';

import { motion } from 'framer-motion';

function SkeletonLine({ width = 'full', height = 4 }) {
  return (
    <div
      className={`shimmer rounded-lg w-${width} h-${height}`}
      style={{ height: `${height * 4}px`, width: width === 'full' ? '100%' : width }}
    />
  );
}

export default function SummarySkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border border-ink-700 rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-ink-700 bg-ink-800/40 space-y-3">
        <div className="flex items-center gap-2">
          <div className="shimmer w-3 h-3 rounded-full" />
          <div className="shimmer h-3 w-24 rounded" />
        </div>
        <div className="shimmer h-4 w-3/4 rounded" />
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="shimmer h-5 w-14 rounded-full" />
          ))}
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="flex border-b border-ink-700">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-1 px-3 py-3 flex justify-center">
            <div className="shimmer h-3 w-20 rounded" />
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="p-5 space-y-3">
        <div className="shimmer h-4 w-full rounded" />
        <div className="shimmer h-4 w-5/6 rounded" />
        <div className="shimmer h-4 w-4/5 rounded" />
        <div className="shimmer h-4 w-full rounded" />
        <div className="shimmer h-4 w-2/3 rounded" />
      </div>

      {/* Processing indicator */}
      <div className="px-5 pb-5 flex items-center gap-3">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-jade-500"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
        <span className="text-xs text-slate-600">Gemini AI is analyzing your content...</span>
      </div>
    </motion.div>
  );
}
