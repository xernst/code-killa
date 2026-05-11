import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getNextV2Step,
  getV2Step,
  getV2Toc,
  listAllV2StepRoutes,
} from "@/lib/content-v2";
import LessonStepClient from "@/components/v2/LessonStepClient";

export async function generateStaticParams() {
  return listAllV2StepRoutes();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ chapter: string; lesson: string; stepIndex: string }>;
}): Promise<Metadata> {
  const { chapter, lesson, stepIndex } = await params;
  const idx = Number.parseInt(stepIndex, 10);
  if (!Number.isFinite(idx) || idx < 0) return {};

  const found = await getV2Step(chapter, lesson, idx);
  if (!found) return {};

  const stepNum = idx + 1;
  const totalSteps = found.lesson.steps.length;
  const chapterTitleClean = found.chapter.title.replace(/\s*—.*$/, "");
  const title = `${found.lesson.title} (step ${stepNum}/${totalSteps}) · ${chapterTitleClean} · promptdojo`;
  const description = `step ${stepNum} of ${totalSteps} in ${found.lesson.title}. interactive python lesson, runs in your browser. free.`;
  const url = `/learn/v2/${chapter}/${lesson}/${idx}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: "promptdojo",
    },
    twitter: {
      card: "summary_large_image",
      title: `${found.lesson.title} · promptdojo`,
      description,
      creator: "@TFisPython",
    },
  };
}

export default async function V2StepPage({
  params,
}: {
  params: Promise<{ chapter: string; lesson: string; stepIndex: string }>;
}) {
  const { chapter, lesson, stepIndex } = await params;
  const idx = Number.parseInt(stepIndex, 10);
  if (!Number.isFinite(idx) || idx < 0) notFound();

  const found = await getV2Step(chapter, lesson, idx);
  if (!found) notFound();

  const next = await getNextV2Step(chapter, lesson, idx);

  return (
    <LessonStepClient
      tree={{ toc: getV2Toc(), detail: found.chapter }}
      chapter={found.chapter}
      lesson={found.lesson}
      step={found.step}
      stepIndex={found.stepIndex}
      next={next}
    />
  );
}
