import { createFileRoute } from '@tanstack/react-router';
import { ProjectsPage } from '@/components/projects-page';
import { pageMeta } from '@/lib/page-meta';

export const Route = createFileRoute('/projects')({
  head: () =>
    pageMeta(
      'Dự án & Thử nghiệm — Hoan Duong',
      'Các dự án website cho cộng đồng trực tuyến và thử nghiệm kỹ thuật được thực hiện bởi Hoan Duong.'
    ),
  component: ProjectsPage,
});
