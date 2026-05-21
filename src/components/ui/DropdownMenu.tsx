import { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';

interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

interface DropdownMenuProps {
  items: DropdownItem[];
}

/**
 * DropdownMenu — Midnight Fleet design system
 *
 * Trigger: ghost button (12px radius)
 * Panel: Level 2 surface (bg-surface-2), 12px radius, 1px border
 * Items: body-sm (14px/500 = label-md), hover bg-surface / text-primary
 * Danger items: text-danger, hover bg-danger/10
 */
export function DropdownMenu({ items }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!items || items.length === 0) return null;

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Ghost trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface-2 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {/* Dropdown panel — Level 2 surface */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-surface-2 border border-border ring-1 ring-black/5 z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden"
        >
          <div role="menu" aria-orientation="vertical">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsOpen(false);
                  item.onClick();
                }}
                className={[
                  'w-full text-left flex items-center gap-2.5 px-4 py-2.5 font-medium transition-colors duration-150',
                  item.variant === 'danger'
                    ? 'text-danger hover:bg-danger/10'
                    : 'text-text hover:bg-surface hover:text-primary',
                ].join(' ')}
                style={{ fontSize: '14px' }}
                role="menuitem"
              >
                {item.icon && <span className="w-4 h-4 shrink-0">{item.icon}</span>}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
