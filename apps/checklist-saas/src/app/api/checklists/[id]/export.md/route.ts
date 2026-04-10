import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{M}/gu, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "checklist"
  );
}

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const checklist = await prisma.checklist.findUnique({
    where: { id },
    include: { items: { orderBy: { sortOrder: "asc" } } },
  });

  if (!checklist) {
    return new NextResponse("Not found", { status: 404 });
  }

  const lines = [
    `# ${checklist.title}`,
    "",
    ...checklist.items.map((it) => `- [${it.done ? "x" : " "}] ${it.label}`),
    "",
  ];
  const body = lines.join("\n");
  const filename = `${slugify(checklist.title)}.md`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
