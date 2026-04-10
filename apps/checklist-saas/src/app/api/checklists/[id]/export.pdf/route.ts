import { PDFDocument, StandardFonts } from "pdf-lib";
import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

const MARGIN_X = 50;
const MARGIN_TOP = 56;
const LINE_GAP = 4;
const TITLE_SIZE = 16;
const BODY_SIZE = 11;
const MAX_CHARS = 88;
const BOTTOM = 48;

function wrapText(text: string): string[] {
  if (text.length <= MAX_CHARS) return [text];
  const parts: string[] = [];
  for (let i = 0; i < text.length; i += MAX_CHARS) {
    parts.push(text.slice(i, i + MAX_CHARS));
  }
  return parts;
}

export async function GET(_req: Request, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  const checklist = await prisma.checklist.findFirst({
    where: { id, userId: session.userId },
    include: { items: { orderBy: { sortOrder: "asc" } } },
  });

  if (!checklist) {
    return new NextResponse("Not found", { status: 404 });
  }

  const pdf = await PDFDocument.create();
  let page = pdf.addPage([595.28, 841.89]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let baseline = page.getHeight() - MARGIN_TOP;

  const newPage = () => {
    page = pdf.addPage([595.28, 841.89]);
    baseline = page.getHeight() - MARGIN_TOP;
  };

  const drawLine = (text: string, size: number, bold: boolean) => {
    if (baseline < BOTTOM + size) {
      newPage();
    }
    page.drawText(text, {
      x: MARGIN_X,
      y: baseline,
      size,
      font: bold ? fontBold : font,
    });
    baseline -= size + LINE_GAP;
  };

  for (const tl of wrapText(checklist.title)) {
    drawLine(tl, TITLE_SIZE, true);
  }
  baseline -= 4;

  for (const it of checklist.items) {
    const prefix = it.done ? "[x] " : "[ ] ";
    for (const line of wrapText(prefix + it.label)) {
      drawLine(line, BODY_SIZE, false);
    }
  }

  const bytes = await pdf.save();
  const filename = `${slugify(checklist.title)}.pdf`;

  return new NextResponse(Buffer.from(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
