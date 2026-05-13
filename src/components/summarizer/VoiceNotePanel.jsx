"use client";

import { useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { setAudioBlob } from "../../store/slices/summarySlice";
import { HiUpload, HiMusicNote, HiX, HiCheckCircle } from "react-icons/hi";

const ACCEPTED = [
  "audio/webm",
  "audio/mp3",
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "audio/m4a",
  "audio/mp4",
];
const MAX_SIZE_MB = 25;

export default function VoiceNotePanel() {
  const dispatch = useDispatch();
  const { audioBlob } = useSelector((s) => s.summary);
  const [isDragging, setIsDragging] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handleFile = useCallback(
    (file) => {
      setError("");
      if (!file) return;

      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`File too large. Maximum size is ${MAX_SIZE_MB}MB.`);
        return;
      }

      const blob = new Blob([file], { type: file.type });
      dispatch(setAudioBlob(blob));
      setFileInfo({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2),
        type: file.type,
      });
    },
    [dispatch],
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      handleFile(file);
    },
    [handleFile],
  );

  const handleClear = () => {
    dispatch(setAudioBlob(null));
    setFileInfo(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[280px] p-6 gap-4">
      <AnimatePresence mode="wait">
        {!audioBlob ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`w-full border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-4 cursor-pointer transition-all duration-200 ${
                isDragging
                  ? "border-jade-500/60 bg-jade-500/5"
                  : "border-ink-600 hover:border-ink-500 hover:bg-ink-800/50"
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-ink-700 flex items-center justify-center">
                <HiUpload
                  className={`text-2xl ${isDragging ? "text-jade-400" : "text-slate-500"}`}
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-300">
                  {isDragging
                    ? "Drop your audio file here"
                    : "Drop audio file or click to browse"}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  MP3, WAV, WebM, OGG, M4A — up to {MAX_SIZE_MB}MB
                </p>
              </div>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />
            {error && (
              <p className="mt-3 text-sm text-red-400 text-center">{error}</p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full flex flex-col items-center gap-5"
          >
            <div className="flex items-center gap-3 w-full max-w-sm px-4 py-3 bg-jade-500/5 border border-jade-500/20 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-jade-500/10 border border-jade-500/20 flex items-center justify-center flex-shrink-0">
                <HiMusicNote className="text-jade-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">
                  {fileInfo?.name}
                </p>
                <p className="text-xs text-slate-500">
                  {fileInfo?.size} MB ·{" "}
                  {fileInfo?.type?.split("/")[1]?.toUpperCase()}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <HiCheckCircle className="text-jade-400 text-lg" />
                <button
                  onClick={handleClear}
                  className="p-1 rounded text-slate-600 hover:text-slate-400 transition-colors"
                >
                  <HiX />
                </button>
              </div>
            </div>

            <audio
              controls
              src={URL.createObjectURL(audioBlob)}
              className="w-full max-w-sm"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
