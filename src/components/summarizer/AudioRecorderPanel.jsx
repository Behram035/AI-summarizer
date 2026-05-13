"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { setAudioBlob } from "../../store/slices/summarySlice";
import { useAudioRecorder } from "../../lib/hooks/useAudioRecorder";
import {
  HiMicrophone,
  HiStop,
  HiPlay,
  HiPause,
  HiRefresh,
  HiCheckCircle,
  HiExclamationCircle,
} from "react-icons/hi";

export default function AudioRecorderPanel() {
  const dispatch = useDispatch();
  const {
    isRecording,
    isPaused,
    duration,
    formattedDuration,
    audioBlob,
    error,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
  } = useAudioRecorder();

  useEffect(() => {
    dispatch(setAudioBlob(audioBlob));
  }, [audioBlob, dispatch]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[280px] p-6 gap-6">
      {/* Waveform / Status indicator */}
      <div className="relative flex items-center justify-center w-24 h-24">
        {isRecording && !isPaused ? (
          <>
            {/* Pulse rings */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-red-500/30"
              animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-red-500/20"
              animate={{ scale: [1, 1.7], opacity: [0.4, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.3,
              }}
            />
            <div className="w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500/40 flex items-center justify-center">
              <div className="flex items-end gap-0.5 h-8">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="wave-bar w-1.5 rounded-full bg-red-400"
                    style={{
                      height: `${30 + Math.random() * 70}%`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </>
        ) : audioBlob ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 rounded-full bg-jade-500/10 border-2 border-jade-500/40 flex items-center justify-center"
          >
            <HiCheckCircle className="text-jade-400 text-3xl" />
          </motion.div>
        ) : (
          <div
            className={`w-20 h-20 rounded-full border-2 flex items-center justify-center transition-colors ${
              isPaused
                ? "bg-amber-500/10 border-amber-500/40"
                : "bg-ink-800 border-ink-600"
            }`}
          >
            <HiMicrophone
              className={`text-3xl ${isPaused ? "text-amber-400" : "text-slate-500"}`}
            />
          </div>
        )}
      </div>

      {/* Timer */}
      <div className="text-center">
        <div className="font-mono text-3xl font-medium text-white tabular-nums">
          {formattedDuration}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          {isRecording && !isPaused
            ? "Recording..."
            : isPaused
              ? "Paused"
              : audioBlob
                ? "Recording complete"
                : "Ready to record"}
        </div>
      </div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20"
        >
          <HiExclamationCircle />
          {error}
        </motion.div>
      )}

      {/* Audio preview */}
      {audioBlob && (
        <motion.audio
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          controls
          src={URL.createObjectURL(audioBlob)}
          className="w-full max-w-xs"
        />
      )}

      {/* Controls */}
      <div className="flex items-center gap-3">
        <AnimatePresence mode="wait">
          {!isRecording && !audioBlob ? (
            <motion.button
              key="start"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={startRecording}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-400 text-white rounded-xl font-medium text-sm transition-colors shadow-lg shadow-red-500/20"
            >
              <HiMicrophone />
              Start Recording
            </motion.button>
          ) : isRecording ? (
            <motion.div
              key="recording-controls"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-2"
            >
              <button
                onClick={isPaused ? resumeRecording : pauseRecording}
                className="p-3 rounded-xl bg-ink-700 hover:bg-ink-600 text-slate-300 transition-colors"
              >
                {isPaused ? <HiPlay /> : <HiPause />}
              </button>
              <button
                onClick={stopRecording}
                className="flex items-center gap-2 px-5 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl font-medium text-sm transition-colors"
              >
                <HiStop />
                Stop
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="done-controls"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-2"
            >
              <button
                onClick={resetRecording}
                className="flex items-center gap-2 px-4 py-2.5 bg-ink-700 hover:bg-ink-600 text-slate-400 rounded-xl text-sm transition-colors"
              >
                <HiRefresh />
                Re-record
              </button>
              <div className="text-xs text-jade-400 flex items-center gap-1 px-3 py-2.5 bg-jade-500/10 border border-jade-500/20 rounded-xl">
                <HiCheckCircle />
                Ready to transcribe
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
