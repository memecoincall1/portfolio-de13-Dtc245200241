import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/reach-out')({
  beforeLoad: () => {
    throw redirect({ to: '/contact' });
  },
});
