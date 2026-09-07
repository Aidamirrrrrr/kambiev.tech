/**
 * Отдаёт актуальное резюме в PDF.
 *
 * Файл лежит вне сборки — в каталоге, который на проде примонтирован томом.
 * Поэтому Telegram-бот может подменить резюме, не пересобирая образ.
 */

import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

/** Путь к файлу резюме; на проде указывает внутрь примонтированного тома. */
const RESUME_PATH =
  process.env.RESUME_PATH ?? path.join(process.cwd(), "data", "resume.pdf");

/** Имя файла, под которым резюме сохранится у скачивающего. */
const DOWNLOAD_NAME = "Aidamir-Kambiev-CV.pdf";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const info = await stat(RESUME_PATH);
    if (!info.isFile()) throw new Error("not a file");

    const file = await readFile(RESUME_PATH);

    return new NextResponse(file as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": String(info.size),
        "Content-Disposition": `inline; filename="${DOWNLOAD_NAME}"`,
        // Резюме подменяется ботом — держим кэш коротким, но не нулевым.
        "Cache-Control": "public, max-age=300, must-revalidate",
        "Last-Modified": info.mtime.toUTCString(),
      },
    });
  } catch (error) {
    console.error("Resume is not available at", RESUME_PATH, error);
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }
}
