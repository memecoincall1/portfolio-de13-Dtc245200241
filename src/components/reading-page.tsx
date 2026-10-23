import { useRef, useState } from 'react';
import { booksList, type BookItem } from '@/lib/hoan-content';

function PileBookButton({ book, index, onOpen }: { book: BookItem; index: number; onOpen: (book: BookItem) => void }) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [tipSide, setTipSide] = useState<'tip-center' | 'tip-left' | 'tip-right'>('tip-center');
  const [tipBelow, setTipBelow] = useState(false);
  // Keep Laura's deterministic scattered-pile placement.
  const placements = [
    { s: 1, dx: '0px', dy: '6px', r: '-4deg' },
    { s: 1.05, dx: '0px', dy: '-4px', r: '2deg' },
    { s: 0.95, dx: '0px', dy: '8px', r: '-1deg' },
    { s: 1.02, dx: '0px', dy: '-6px', r: '3deg' },
    { s: 0.98, dx: '0px', dy: '4px', r: '-3deg' },
    { s: 1.04, dx: '0px', dy: '-2px', r: '1deg' },
    { s: 0.96, dx: '0px', dy: '7px', r: '-2deg' },
    { s: 1.01, dx: '0px', dy: '-5px', r: '4deg' },
    { s: 0.99, dx: '0px', dy: '5px', r: '-5deg' },
    { s: 1.03, dx: '0px', dy: '-3px', r: '2deg' },
  ];
  const placement = placements[index % placements.length];

  function updateTipPlacement() {
    const el = buttonRef.current;
    if (!el || typeof window === 'undefined') return;
    const rect = el.getBoundingClientRect();
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 1024;
    const tipWidth = 280;
    const margin = 12;
    if (rect.left + rect.width / 2 - tipWidth / 2 < margin) {
      setTipSide('tip-left');
    } else if (rect.left + rect.width / 2 + tipWidth / 2 > viewportWidth - margin) {
      setTipSide('tip-right');
    } else {
      setTipSide('tip-center');
    }
    setTipBelow(rect.top < 250);
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`pile-book${book.reading ? ' is-reading' : ''}`}
      style={
        {
          '--s': placement.s,
          '--dx': placement.dx,
          '--dy': placement.dy,
          '--r': placement.r,
        } as React.CSSProperties
      }
      onClick={() => onOpen(book)}
      onMouseEnter={updateTipPlacement}
      onFocus={updateTipPlacement}
      aria-label={`${book.title} - Tác giả ${book.author}${book.reading ? ' (Đang đọc)' : ''}`}
    >
      {book.cover ? (
        <img src={book.cover} alt={`Bìa sách ${book.title} — ${book.author}`} loading="lazy" />
      ) : (
        <span className="book-placeholder-cover">
          <span className="book-placeholder-title">{book.title}</span>
        </span>
      )}
      <span className={`pile-book-tip ${tipSide}${tipBelow ? ' tip-below' : ''}`} aria-hidden="true">
        <span className="pile-book-tip-title">{book.title}</span>
        <span className="pile-book-tip-author">{book.author}</span>
        <span className="pile-book-tip-desc">{book.description}</span>
      </span>
    </button>
  );
}

export function ReadingPage() {
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);

  return (
    <main className="reading-page">
      <div className="reading-hero">
        <h1>DANH SÁCH TÀI LIỆU THAM KHẢO - Tủ sách cá nhân</h1>
        <p className="reading-blurb">
          10 cuốn sách. Những cuốn được buộc ruy băng hiện đang để trên bàn cạnh giường ngủ của tôi
        </p>
      </div>

      <section className="book-pile" aria-label="Kệ sách">
        {booksList.map((book, index) => (
          <PileBookButton key={book.id} book={book} index={index} onOpen={setSelectedBook} />
        ))}
      </section>

      <div className={`book-lightbox${selectedBook ? ' active' : ''}`} role="dialog" aria-modal="true" aria-hidden={selectedBook ? 'false' : 'true'}>
        <div className="book-lightbox-backdrop" onClick={() => setSelectedBook(null)} />
        {selectedBook && (
          <div className="book-lightbox-card">
            <button type="button" className="book-lightbox-close" onClick={() => setSelectedBook(null)} aria-label="Đóng chi tiết sách">
              ×
            </button>
            {selectedBook.cover ? (
              <img
                className="book-lightbox-cover"
                src={selectedBook.cover}
                alt={`Bìa sách ${selectedBook.title} — ${selectedBook.author}`}
              />
            ) : (
              <div className="book-lightbox-cover book-placeholder-cover">
                <span className="book-placeholder-title">{selectedBook.title}</span>
              </div>
            )}
            <div>
              <div className="book-lightbox-status">
                {selectedBook.reading ? 'Đang đọc' : 'Trong tủ sách cá nhân'} · {selectedBook.category}
              </div>
              <div className="book-lightbox-title">{selectedBook.title}</div>
              <div className="book-lightbox-author">
                Tác giả: {selectedBook.author}
                {selectedBook.year ? ` · Xuất bản: ${selectedBook.year}` : ''}
              </div>
              <p className="book-lightbox-takeaway">{selectedBook.description}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
