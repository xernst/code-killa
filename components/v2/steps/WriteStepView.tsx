"use client";

import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { rehypeHighlightPinned } from "@/lib/rehype-highlight-pinned";
import { CheckCircle2, XCircle } from "lucide-react";
import { interpolate, type WriteStep } from "@/lib/content/schema";
import type { StepViewProps } from "../StepRouter";
import { cn } from "@/lib/utils";
import { gradeRunResultAsync } from "./_grader";
import HintReveal from "./_HintReveal";

export default function WriteStepView({
  step,
  profile,
  onAttempt,
  ide,
}: StepViewProps<WriteStep>) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<null | { passed: boolean; reason?: string }>(null);
  const [solutionRevealed, setSolutionRevealed] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const startedAtRef = useRef(new Date().toISOString());


  const prompt = step.personalize ? interpolate(step.prompt, profile) : step.prompt;

  async function handleSubmit() {
    if (submitting || submitted?.passed) return;
    setSubmitting(true);
    const result = await ide.run();
    setSubmitting(false);
    if (!result) {
      setSubmitted({ passed: false, reason: "editor isn't ready yet." });
      return;
    }
    const grade = await gradeRunResultAsync(step.grader, result, ide);
    setSubmitted(grade.passed ? { passed: true } : { passed: false, reason: grade.reason });
    onAttempt({
      stepId: step.id,
      startedAt: startedAtRef.current,
      submittedAt: new Date().toISOString(),
      correct: grade.passed,
      hintsUsed: solutionRevealed ? Math.max(hintsUsed, 99) : hintsUsed,
      payload: { kind: "write", code: ide.getActiveCode() },
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="prose max-w-none text-ink-200">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlightPinned]}>
          {prompt}
        </ReactMarkdown>
      </div>
      {/* Active-step submit/hint controls are desktop-only. On mobile the
          shell renders the "this step needs the editor" upsell card below the
          prompt; exposing these buttons there would let a tap grade the
          unedited starter against the editor the user can't see (B4
          2026-05-12). */}
      <div className="hidden items-center gap-3 md:flex">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting || submitted?.passed === true}
          className="dojo-btn-primary"
        >
          {submitting ? "running…" : "submit"}
        </button>
        {step.solution && !submitted?.passed && (
          <button
            type="button"
            onClick={() => setSolutionRevealed(true)}
            className="text-xs text-ink-400 underline-offset-2 hover:text-ink-100 hover:underline"
          >
            Show solution →
          </button>
        )}
      </div>
      {submitted && (
        <div
          aria-live="polite"
          className={cn(
            "flex items-start gap-2 rounded-md border px-3 py-2 text-sm",
            submitted.passed
              ? "border-green-700/50 bg-green-700/5 text-green-400"
              : "border-ink-700 bg-ink-800/40 text-ink-400",
          )}
        >
          {submitted.passed ? (
            <CheckCircle2 size={16} className="mt-0.5" />
          ) : (
            <XCircle size={16} className="mt-0.5" />
          )}
          <span>{submitted.passed ? "that's the one." : submitted.reason}</span>
        </div>
      )}
      {solutionRevealed && step.solution && (
        <pre className="overflow-auto rounded-md border border-ink-800 bg-ink-950 p-3 font-mono text-xs text-green-300">
          {step.solution}
        </pre>
      )}
      {!submitted?.passed && (
        <div className="hidden md:block">
          <HintReveal
            hints={step.hint}
            resetKey={step.id}
            onReveal={(level) => setHintsUsed((c) => Math.max(c, level))}
          />
        </div>
      )}
    </div>
  );
}
