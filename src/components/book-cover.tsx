import type { BookItem } from '@/lib/hoan-content';

interface BookCoverProps {
  book: BookItem;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function BookCover({ book, className = '', size = 'md' }: BookCoverProps) {
  const { title, author, reading, cover, coverAccent } = book;

  if (cover) {
    return (
      <div className={`book-cover-wrap book-size-${size} has-real-cover ${reading ? 'is-reading' : ''} ${className}`}>
        <img src={cover} alt={`Bìa sách ${title} — ${author}`} loading="lazy" />
        {reading && (
          <div className="reading-ribbon" title="Đang đọc trên bàn học">
            <span className="ribbon-text">ĐANG ĐỌC</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`book-cover-wrap book-size-${size} ${reading ? 'is-reading' : ''} ${className}`}
      style={
        {
          '--book-bg': coverAccent.bg,
          '--book-text': coverAccent.text,
          '--book-accent': coverAccent.accent,
        } as React.CSSProperties
      }
    >
      <div className="book-spine" aria-hidden="true" />
      <div className="book-front">
        <div className="book-front-content">
          <div className="book-header-line">
            <span className="book-kicker">{book.category}</span>
            {book.year && <span className="book-year">{book.year}</span>}
          </div>

          <div className="book-title-block">
            <h3 className="book-title">{title}</h3>
            <p className="book-author">{author}</p>
          </div>

          <div className="book-footer-motif" aria-hidden="true">
            <div className="motif-line" />
            <span className="motif-dot" />
            <div className="motif-line" />
          </div>
        </div>

        {reading && (
          <div className="reading-ribbon" title="Đang đọc trên bàn học">
            <span className="ribbon-text">ĐANG ĐỌC</span>
          </div>
        )}
      </div>
    </div>
  );
}
