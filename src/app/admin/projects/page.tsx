import { prisma } from "@/lib/prisma";
import { ProjectsClient } from "./ProjectsClient";

const PAGE_SIZE = 10;

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1"));

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.project.count(),
  ]);

  return (
    <ProjectsClient
      projects={projects}
      total={total}
      page={page}
      totalPages={Math.ceil(total / PAGE_SIZE)}
    />
  );
}
