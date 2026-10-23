import { Link, useLocation } from '@tanstack/react-router';
import { hoanProfile } from '@/lib/hoan-content';

const navItems = [
  { to: '/projects', label: 'projects' },
  { to: '/blogs', label: 'blogs' },
  { to: '/reading-list', label: 'reading list' },
  { to: '/about', label: 'about' },
  { to: '/contact', label: 'reach out' },
];

export function SiteHeader() {
  const pathname = useLocation().pathname;

  return (
    <header>
      <Link to="/" className="name-block">
        <div className="name">{hoanProfile.name}</div>
        <div className="tagline">{hoanProfile.role}</div>
      </Link>
      <nav aria-label="Primary">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            data-active={pathname === item.to ? 'true' : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
