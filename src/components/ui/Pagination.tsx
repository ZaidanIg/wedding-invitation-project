'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({ meta, onPageChange, className = '' }: PaginationProps) {
  const { page, total, totalPages, limit } = meta;

  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  // Build visible page numbers with ellipsis logic
  const getPageNumbers = (): (number | '...')[] => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | '...')[] = [];

    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }

    if (range[0] > 2) rangeWithDots.push(1, '...');
    else rangeWithDots.push(1);

    rangeWithDots.push(...range);

    if (range[range.length - 1] < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-[#eceae4] ${className}`}>
      {/* Record info */}
      <span className="text-xs font-medium text-[#6b6b6b] shrink-0">
        Menampilkan <span className="font-bold text-[#1c1c1c]">{from}–{to}</span> dari{' '}
        <span className="font-bold text-[#1c1c1c]">{total}</span> data
      </span>

      {/* Page controls */}
      <div className="flex items-center gap-1">
        {/* First */}
        <PageBtn
          onClick={() => onPageChange(1)}
          disabled={page <= 1}
          aria-label="Halaman pertama"
        >
          <ChevronsLeft className="h-3.5 w-3.5" />
        </PageBtn>

        {/* Prev */}
        <PageBtn
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </PageBtn>

        {/* Page numbers */}
        {pageNumbers.map((num, idx) =>
          num === '...' ? (
            <span key={`dots-${idx}`} className="w-8 text-center text-xs text-[#6b6b6b]">
              …
            </span>
          ) : (
            <PageBtn
              key={num}
              onClick={() => onPageChange(num as number)}
              active={num === page}
            >
              {num}
            </PageBtn>
          )
        )}

        {/* Next */}
        <PageBtn
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Halaman berikutnya"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </PageBtn>

        {/* Last */}
        <PageBtn
          onClick={() => onPageChange(totalPages)}
          disabled={page >= totalPages}
          aria-label="Halaman terakhir"
        >
          <ChevronsRight className="h-3.5 w-3.5" />
        </PageBtn>
      </div>
    </div>
  );
}

// ── Small internal button ─────────────────────────────────────────────────────
function PageBtn({
  children,
  onClick,
  disabled,
  active,
  'aria-label': ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  'aria-label'?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-current={active ? 'page' : undefined}
      className={`
        min-w-[32px] h-8 px-2 rounded-lg text-xs font-semibold
        flex items-center justify-center
        transition-all duration-150
        ${
          active
            ? 'bg-rose-500 text-white shadow-sm shadow-rose-200'
            : disabled
            ? 'text-[#1c1c1c]/25 cursor-not-allowed'
            : 'text-[#6b6b6b] hover:bg-stone-100 hover:text-[#1c1c1c]'
        }
      `}
    >
      {children}
    </button>
  );
}
