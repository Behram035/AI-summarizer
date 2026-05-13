"use client";

import { motion } from "framer-motion";
import { RiSparklingFill } from "react-icons/ri";
import {
  HiOutlineLightningBolt,
  HiOutlineMicrophone,
  HiOutlineDocumentText,
} from "react-icons/hi";

const FEATURES = [
  { icon: HiOutlineDocumentText, text: "Text & articles" },
  { icon: HiOutlineMicrophone, text: "Voice & audio" },
  { icon: HiOutlineLightningBolt, text: "Instant AI insights" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export default function HeroSection() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="text-center space-y-6"
    >
      {/* Badge */}
      <motion.div variants={item} className="flex justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-jade-500/20 bg-jade-500/5 text-jade-400 text-xs font-mono">
          <RiSparklingFill className="text-xs" />
          Powered by gemini-3.1-flash-lite
        </div>
      </motion.div>

      {/* Headline */}
      <motion.div variants={item}>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-tight tracking-tight">
          Distill any content
          <br />
          into <span className="gradient-text italic">clear insights</span>
        </h1>
      </motion.div>

      {/* Subtext */}
      <motion.p
        variants={item}
        className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed"
      >
        Paste text, record your voice, or upload audio. Get AI-powered
        summaries, bullet points, and key notes in seconds.
      </motion.p>

      {/* Feature pills */}
      <motion.div
        variants={item}
        className="flex flex-wrap items-center justify-center gap-3"
      >
        {FEATURES.map(({ icon: Icon, text }) => (
          <div
            key={text}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ink-800 border border-ink-700 text-slate-400 text-xs"
          >
            <Icon className="text-jade-500 text-sm" />
            {text}
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
