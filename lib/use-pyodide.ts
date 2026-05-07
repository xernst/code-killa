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
      pendingRef.current.set(id, resolve);
      w.postMessage({ type: "run", id, code });
    });
  }, []);

  const gradeAst = useCallback(
    (code: string, rules: AstGradeRequest): Promise<AstGradeResult> => {
      const w = getWorker();
      const id = ++idRef.current;
      return new Promise((resolve) => {
        pendingAstRef.current.set(id, resolve);
        w.postMessage({ type: "grade-ast", id, code, rules });
      });
    },
    [],
  );

  return { status, run, gradeAst };
}

export type { AstRule, AstGradeRequest, AstGradeResult };
