"use client";

import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { generateSummary, setInputType } from "../../store/slices/summarySlice";
import { openAuthModal } from "../../store/slices/uiSlice";
import TextInputPanel from "./TextInputPanel";
import AudioRecorderPanel from "./AudioRecorderPanel";
import VoiceNotePanel from "./VoiceNotePanel";
import SummaryOutput from "./SummaryOutput";
import SummarySkeleton from "../../components/ui/SummarySkeleton";
import {
  HiOutlineDocumentText,
  HiOutlineMicrophone,
  HiOutlineUpload,
  HiSparkles,
  HiExclamationCircle,
} from "react-icons/hi";
import toast from "react-hot-toast";

const INPUT_MODES = [
  { id: "text", label: "Text", icon: HiOutlineDocumentText },
  { id: "audio", label: "Record Audio", icon: HiOutlineMicrophone },
  { id: "voice_note", label: "Upload Audio", icon: HiOutlineUpload },
];

export default function SummarizerInput() {
  const dispatch = useDispatch();
  const {
    inputText,
    inputType,
    audioBlob,
    currentSummary,
    isGenerating,
    generateError,
  } = useSelector((s) => s.summary);
  const { isAuthenticated } = useSelector((s) => s.auth);

  const canSubmit = () => {
    if (inputType === "text") return inputText.trim().length >= 10;
    return !!audioBlob;
  };

  const handleGenerate = async () => {
    if (!isAuthenticated) {
      dispatch(openAuthModal("login"));
      toast("Please sign in to generate summaries", { icon: "🔐" });
      return;
    }
    if (!canSubmit()) return;

    let payload = { inputType };

    if (inputType === "text") {
      payload.text = inputText;
    } else {
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      await new Promise((resolve) => {
        reader.onloadend = () => {
          const base64 = reader.result.split(",")[1];
          payload.audioBase64 = base64;
          payload.mimeType = audioBlob.type || "audio/webm";
          payload.text = "[Audio input]";
          resolve();
        };
      });
    }

    dispatch(generateSummary(payload));
  };

  return (
    <div className="space-y-6">
      {/* Input card */}
      <div className="bg-ink-900 border border-ink-700 rounded-2xl overflow-hidden">
        {/* Mode selector */}
        <div className="flex border-b border-ink-700">
          {INPUT_MODES.map((mode) => {
            const Icon = mode.icon;
            const active = inputType === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => dispatch(setInputType(mode.id))}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3.5 text-xs font-medium transition-all relative ${
                  active
                    ? "text-jade-400"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <Icon className="text-sm" />
                <span className="hidden sm:inline">{mode.label}</span>
                {active && (
                  <motion.div
                    layoutId="mode-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-jade-500"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={inputType}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {inputType === "text" && <TextInputPanel />}
            {inputType === "audio" && <AudioRecorderPanel />}
            {inputType === "voice_note" && <VoiceNotePanel />}
          </motion.div>
        </AnimatePresence>

        {/* Generate button */}
        <div className="px-5 py-4 border-t border-ink-700 flex items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !canSubmit()}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              canSubmit() && !isGenerating
                ? "bg-jade-500 hover:bg-jade-400 text-ink-950 shadow-jade hover:shadow-jade-lg"
                : "bg-ink-700 text-slate-600 cursor-not-allowed"
            }`}
          >
            {isGenerating ? (
              <>
                <span className="w-4 h-4 border-2 border-ink-900/30 border-t-ink-900 rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <HiSparkles />
                Generate Summary
              </>
            )}
          </button>

          {!isAuthenticated && (
            <p className="text-xs text-slate-600 flex items-center gap-1">
              <span>🔐</span> Sign in required
            </p>
          )}

          {inputType !== "text" && audioBlob && !isGenerating && (
            <p className="text-xs text-jade-600">
              Audio will be transcribed first, then summarized
            </p>
          )}
        </div>
      </div>

      {/* Error */}
      <AnimatePresence>
        {generateError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
          >
            <HiExclamationCircle className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Generation failed</p>
              <p className="text-red-400/70 text-xs mt-0.5">{generateError}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Output */}
      <AnimatePresence>
        {isGenerating && <SummarySkeleton />}
        {!isGenerating && currentSummary && (
          <SummaryOutput summary={currentSummary} />
        )}
      </AnimatePresence>
    </div>
  );
}
