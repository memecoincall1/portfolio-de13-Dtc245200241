import { createFileRoute } from '@tanstack/react-router';
import { AboutPage } from '@/components/about-page';
import { pageMeta } from '@/lib/page-meta';

export const Route = createFileRoute('/about')({
  head: () =>
    pageMeta(
      'Giới thiệu — Hoan Duong',
      'Mình là Hoan Duong — sinh viên CNTT năm 3 tại ICTU. Đọc các ghi chú về nền tảng công nghệ & web3, trải nghiệm thực tế và những dự định tiếp theo.'
    ),
  component: AboutPage,
});
