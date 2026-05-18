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

export function DropdownMenu({ items }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  if (!items || items.length === 0) return null;

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface-2 transition-colors focus:outline-none"
        aria-expanded={isOpen}
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-surface-2 border border-border ring-1 ring-black ring-opacity-5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsOpen(false);
                  item.onClick();
                }}
                className={`w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                  item.variant === 'danger'
                    ? 'text-danger hover:bg-danger/10'
                    : 'text-text hover:bg-surface hover:text-primary'
                }`}
                role="menuitem"
              >
                {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
