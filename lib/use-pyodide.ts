"use client";
import { useEffect, useRef, useState, useCallback } from "react";

type RunResult = {
  ok: boolean;
  stdout: string;
  stderr: string;
  durationMs?: number;
};
type AstRule =
  | { kind: "calls"; name: string }
  | { kind: "uses-loop" }
  | { kind: "defines-function"; name?: string; minArgs?: number }
  | { kind: "uses-import"; module: string }
  | { kind: "no-globals" };
type AstGradeRequest = { must: AstRule[]; mustNot: AstRule[] };
type AstGradeResult = {
  parsed: boolean;
  syntaxError: string | null;
  must: { rule: AstRule; matched: boolean }[];
  mustNot: { rule: AstRule; matched: boolean }[];
  durationMs?: number;
};
type WorkerMsg =
  | { type: "status"; payload: "loading" | "ready" }
  | { type: "result"; id: number; payload: RunResult }
  | { type: "ast-result"; id: number; payload: AstGradeResult };

let workerSingleton: Worker | null = null;
function getWorker(): Worker {
  if (typeof window === "undefined") {
    throw new Error("Pyodide worker requested on the server");
  }
  if (!workerSingleton) {
    workerSingleton = new Worker("/pyodide-worker.js");
  }
  return workerSingleton;
}

/**
 * Kick off the Pyodide download on the singleton worker before the user
 * reaches a lesson. The PyodidePreloader calls this on intent signals
 * (hover, scroll, touchstart) so the WASM (~12 MB) lands while they're
 * still scrolling instead of when their first IDE mounts.
 *
 * Critical: must use the SAME worker the lesson runtime will use later.
 * Spawning a separate Worker here downloads Pyodide twice — once into
 * the preload worker that immediately gets GC'd, then again when the
 * lesson route boots a cold singleton. That's the bug audit-2026-05-11
 * caught.
 */
export function warmPyodide(): void {
  if (typeof window === "undefined") return;
  const w = getWorker();
  w.postMessage({ type: "init", id: -1 });
}

const PENDING_TIMEOUT_MS = 30_000;

export function usePyodide() {
  const [status, setStatus] = useState<"idle" | "loading" | "ready">("loading");
  const pendingRef = useRef<Map<number, (r: RunResult) => void>>(new Map());
  const pendingAstRef = useRef<Map<number, (r: AstGradeResult) => void>>(new Map());
  const idRef = useRef(0);

  useEffect(() => {
    const w = getWorker();
    const onMsg = (e: MessageEvent<WorkerMsg>) => {
      const msg = e.data;
      if (msg.type === "status") {
        setStatus(msg.payload === "ready" ? "ready" : "loading");
      } else if (msg.type === "result") {
        // Init result (id: -1) doubles as a ready signal — covers the case
        // where the worker was already warm and never broadcast another status.
        if (msg.id === -1) setStatus("ready");
        const cb = pendingRef.current.get(msg.id);
        if (cb) {
          pendingRef.current.delete(msg.id);
          cb(msg.payload);
        }
      } else if (msg.type === "ast-result") {
        const cb = pendingAstRef.current.get(msg.id);
        if (cb) {
          pendingAstRef.current.delete(msg.id);
          cb(msg.payload);
        }
      }
    };
    w.addEventListener("message", onMsg);
    w.postMessage({ type: "init", id: -1 });
    return () => {
      w.removeEventListener("message", onMsg);
    };
  }, []);

  const run = useCallback((code: string): Promise<RunResult> => {
    const w = getWorker();
    const id = ++idRef.current;
    return new Promise((resolve) => {
      const timer = window.setTimeout(() => {
        pendingRef.current.delete(id);
        resolve({
          ok: false,
          stdout: "",
          stderr: "code timed out — runs longer than 30s are killed",
          durationMs: PENDING_TIMEOUT_MS,
        });
      }, PENDING_TIMEOUT_MS);
      pendingRef.current.set(id, (r) => {
        window.clearTimeout(timer);
        resolve(r);
      });
      w.postMessage({ type: "run", id, code });
    });
  }, []);

  const gradeAst = useCallback(
    (code: string, rules: AstGradeRequest): Promise<AstGradeResult> => {
      const w = getWorker();
      const id = ++idRef.current;
      return new Promise((resolve) => {
        const timer = window.setTimeout(() => {
          pendingAstRef.current.delete(id);
          resolve({
            parsed: false,
            syntaxError: "AST grader timed out",
            must: [],
            mustNot: [],
            durationMs: PENDING_TIMEOUT_MS,
          });
        }, PENDING_TIMEOUT_MS);
        pendingAstRef.current.set(id, (r) => {
          window.clearTimeout(timer);
          resolve(r);
        });
        w.postMessage({ type: "grade-ast", id, code, rules });
      });
    },
    [],
  );

  return { status, run, gradeAst };
}

export type { AstRule, AstGradeRequest, AstGradeResult };
