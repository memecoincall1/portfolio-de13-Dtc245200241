import { createFileRoute } from '@tanstack/react-router';
import { ContactPage } from '@/components/contact-page';
import { pageMeta } from '@/lib/page-meta';

export const Route = createFileRoute('/contact')({
  head: () =>
    pageMeta(
      'Liên hệ — Hoan Duong',
      'Kết nối trực tiếp với Hoan Duong qua email, LinkedIn và X.'
    ),
  component: ContactPage,
});
