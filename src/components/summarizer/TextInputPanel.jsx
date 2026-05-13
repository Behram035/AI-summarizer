"use client";

import { useDispatch, useSelector } from "react-redux";
import { setInputText } from "../../store/slices/summarySlice";
import { HiOutlineDocumentText, HiX } from "react-icons/hi";

const MAX_CHARS = 10000;

export default function TextInputPanel() {
  const dispatch = useDispatch();
  const { inputText } = useSelector((s) => s.summary);
  const charCount = inputText.length;
  const percentage = Math.min((charCount / MAX_CHARS) * 100, 100);

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-1">
        <textarea
          value={inputText}
          onChange={(e) => dispatch(setInputText(e.target.value))}
          placeholder="Paste your text, article, meeting notes, or any content you want to summarize..."
          maxLength={MAX_CHARS}
          className="w-full h-full min-h-[280px] bg-transparent text-slate-200 placeholder-slate-600 text-sm leading-relaxed focus:outline-none p-5 pr-12"
        />
        {inputText && (
          <button
            onClick={() => dispatch(setInputText(""))}
            className="absolute top-4 right-4 p-1 rounded-md text-slate-600 hover:text-slate-400 hover:bg-ink-700 transition-colors"
          >
            <HiX />
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-ink-700 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <HiOutlineDocumentText />
          <span>{inputText.split(/\s+/).filter(Boolean).length} words</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-24 h-1 bg-ink-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${percentage}%`,
                backgroundColor: percentage > 90 ? "#F59E0B" : "#34D399",
              }}
            />
          </div>
          <span
            className={`text-xs font-mono ${percentage > 90 ? "text-amber-400" : "text-slate-600"}`}
          >
            {charCount.toLocaleString()}/{MAX_CHARS.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
