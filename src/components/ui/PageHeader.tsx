interface PageHeaderProps {
  title: string;
  subtitle?: string;
  gradient?: string;
  onNew?: () => void;
  newLabel?: string;
  newClassName?: string;
}

const PageHeader = ({
  title,
  subtitle,
  gradient = 'from-primary to-blue-400',
  onNew,
  newLabel = 'Nuevo',
  newClassName = '',
}: PageHeaderProps) => (
  <div className="flex justify-between items-center bg-surface p-6 rounded-2xl border border-border shadow-sm">
    <div>
      <h1 className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
        {title}
      </h1>
      {subtitle && <p className="text-text-muted mt-1">{subtitle}</p>}
    </div>
    {onNew && (
      <button
        onClick={onNew}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all shadow-sm ${newClassName}`}
      >
        <span className="text-lg leading-none">+</span> {newLabel}
      </button>
    )}
  </div>
);

export default PageHeader;
