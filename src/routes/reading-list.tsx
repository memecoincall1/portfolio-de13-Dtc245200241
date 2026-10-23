import { createFileRoute } from '@tanstack/react-router';
import { ReadingPage } from '@/components/reading-page';
import { pageMeta } from '@/lib/page-meta';

export const Route = createFileRoute('/reading-list')({
  head: () =>
    pageMeta(
      'DANH SÁCH TÀI LIỆU THAM KHẢO - Tủ sách cá nhân',
      '10 cuốn sách. Những cuốn được buộc ruy băng hiện đang để trên bàn cạnh giường ngủ của tôi'
    ),
  component: ReadingPage,
});