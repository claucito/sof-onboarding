import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

type Params = { params: Promise<{ id: string }> };

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
