import { createFileRoute } from '@tanstack/react-router';
import { BlogsPage } from '@/components/blogs-page';
import { pageMeta } from '@/lib/page-meta';

export const Route = createFileRoute('/blogs')({
  head: () =>
    pageMeta(
      'Ghi chú & Suy nghĩ — Hoan Duong',
      'Ghi chép về lập trình, văn hóa Internet, thử nghiệm web và quá trình học tập của Hoan Duong.'
    ),
  component: BlogsPage,
});