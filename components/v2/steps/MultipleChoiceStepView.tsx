"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CheckCircle2, XCircle } from "lucide-react";
import {
  interpolate,
  type MultipleChoiceStep,
} from "@/lib/content/schema";
import type { StepViewProps } from "../StepRouter";
import { cn } from "@/lib/utils";
import HintReveal from "./_HintReveal";

export default function MultipleChoiceStepView({
  step,
  profile,
  onAttempt,
}: StepViewProps<MultipleChoiceStep>) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const startedAtRef = useRef(new Date().toISOString());


  const prompt = step.personalize ? interpolate(step.prompt, profile) : step.prompt;
  const isMulti = step.answerIds.length > 1;

  const correctSet = useMemo(() => new Set(step.answerIds), [step.answerIds]);

  function handleSubmit() {
    if (!selected || submitted) return;
    setSubmitted(true);
    const correct = correctSet.has(selected) && !isMulti;
    onAttempt({
      stepId: step.id,
      startedAt: startedAtRef.current,
      submittedAt: new Date().toISOString(),
      correct,
      hintsUsed,
      payload: { kind: "mc", selectedId: selected },
    });
  }

  // Keyboard: digits 1-9 pick, Enter submits.
  // Bail out when focus is inside any editable surface (input, textarea,
  // contenteditable, CodeMirror) — otherwise the BrainDump textarea or
  // any other text field swallows digits + Enter for MC selection.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          tag === "SELECT" ||
          target.isContentEditable ||
          target.closest?.(".cm-editor")
        ) {
          return;
        }
      }
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === "Enter") {
        if (selected && !submitted) {
          event.preventDefault();
          handleSubmit();
        }
        return;
      }
      const idx = Number(event.key) - 1;
      if (idx >= 0 && idx < step.options.length) {
        event.preventDefault();
        setSelected(step.options[idx].id);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, submitted, step.options]);

  return (
    <div className="flex flex-col gap-5">
      <div className="prose max-w-none text-ink-200">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{prompt}</ReactMarkdown>
      </div>
      <div className="flex flex-col gap-2" role="radiogroup" aria-label="choices">
        {step.options.map((option, idx) => {
          const isSelected = selected === option.id;
          const isCorrectChoice = correctSet.has(option.id);
          const showCorrect = submitted && isCorrectChoice;
          const showWrong = submitted && isSelected && !isCorrectChoice;
          return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => !submitted && setSelected(option.id)}
                disabled={submitted}
                className={cn(
                  "w-full rounded-md border px-3 py-2.5 text-left text-sm transition",
                  "border-ink-800 bg-ink-900",
                  !submitted && "hover:border-ink-600",
                  isSelected && !submitted && "border-green-500 bg-ink-800",
                  showCorrect && "border-green-700/60 bg-green-700/5 text-green-400",
                  showWrong && "border-ink-700 bg-ink-800/40 text-ink-400",
                )}
              >
                <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded bg-ink-800 text-[10px] text-ink-400">
                  {idx + 1}
                </span>
                <span className="font-mono text-ink-100">{option.label}</span>
                {submitted && option.explain && (isSelected || isCorrectChoice) && (
                  <span className="mt-2 block text-xs text-ink-400">
                    {option.explain}
                  </span>
                )}
              </button>
          );
        })}
      </div>
      <div className="flex items-center gap-3">
        {!submitted ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selected}
            className="dojo-btn-primary"
          >
            check
          </button>
        ) : (
          <span
            aria-live="polite"
            className={cn(
              "inline-flex items-center gap-1.5 text-sm",
              correctSet.has(selected ?? "") ? "text-green-400" : "text-ink-400",
            )}
          >
            {correctSet.has(selected ?? "") ? (
              <>
                <CheckCircle2 size={16} /> Right.
              </>
            ) : (
              <>
                <XCircle size={16} /> Not that one.
              </>
            )}
          </span>
        )}
      </div>
      {!submitted && (
        <HintReveal
          hints={step.hint}
          resetKey={step.id}
          onReveal={(level) => setHintsUsed((c) => Math.max(c, level))}
        />
      )}
    </div>
  );
}
