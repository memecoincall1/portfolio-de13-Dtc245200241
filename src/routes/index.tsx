import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from '@/components/home-page';
import { pageMeta } from '@/lib/page-meta';

export const Route = createFileRoute("/")({
  head: () =>
    pageMeta(
      'Hoan Duong — Still figuring things out',
      'I\'m Hoan Duong, a technology student at ICTU in Thai Nguyen, Vietnam. I build things on the internet, experiment with ideas, and learn along the way.'
    ),
  component: HomePage,
});
