import { createFileRoute } from '@tanstack/react-router';
import { ContactPage } from '@/components/contact-page';
import { pageMeta } from '@/lib/page-meta';

export const Route = createFileRoute('/sfnewsletter')({
  head: () =>
    pageMeta(
      'Liên hệ & Cập nhật — Hoan Duong',
      'Kênh kết nối và cập nhật thông tin trực tiếp từ Hoan Duong.'
    ),
  component: ContactPage,
});