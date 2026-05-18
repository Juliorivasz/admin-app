import { type ReactNode } from 'react';

interface QueryStateWrapperProps {
  isLoading: boolean;
  isError: boolean;
  errorMsg?: string;
  children: ReactNode;
}

const QueryStateWrapper = ({
  isLoading,
  isError,
  errorMsg = 'Error al cargar los datos.',
  children,
}: QueryStateWrapperProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-danger/10 border border-danger text-danger p-4 rounded-xl text-center">
        {errorMsg}
      </div>
    );
  }

  return <>{children}</>;
};

export default QueryStateWrapper;
