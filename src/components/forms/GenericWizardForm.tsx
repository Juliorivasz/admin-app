import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { HelpCircle } from 'lucide-react';

export interface FormFieldConfig<T> {
  name: keyof T;
  label: string;
  description?: string;
  type: 'text' | 'number' | 'checkbox' | 'select' | 'textarea';
  step: number;
  options?: { label: string; value: string | number }[];
  required?: boolean;
  placeholder?: string;
  min?: number;
  stepIncrement?: string;
  /** En desktop ocupa el ancho completo (2 columnas). Por defecto false (ocupa 1 columna). */
  fullWidth?: boolean;
}

interface GenericWizardFormProps<T> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  stepNames: string[];
  fields: FormFieldConfig<T>[];
  defaultValues: T;
  onSubmit: (values: T) => Promise<void>;
  isSubmitting?: boolean;
  isViewMode?: boolean;
  onEnableEdit?: () => void;
  headerActions?: React.ReactNode;
}

export function GenericWizardForm<T>({
  isOpen,
  onClose,
  title,
  stepNames,
  fields,
  defaultValues,
  onSubmit,
  isSubmitting,
  isViewMode = false,
  onEnableEdit,
  headerActions,
}: GenericWizardFormProps<T>) {
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm({
    defaultValues: defaultValues as any,
    onSubmit: async ({ value }) => {
      await onSubmit(value as T);
      form.reset();
      setCurrentStep(0);
    },
  });

  const nextStep = () => setCurrentStep((p) => Math.min(p + 1, stepNames.length - 1));
  const prevStep = () => setCurrentStep((p) => Math.max(p - 1, 0));
  const isLastStep = currentStep === stepNames.length - 1;
  const closeAndReset = () => { form.reset(); setCurrentStep(0); onClose(); };

  const renderField = (config: FormFieldConfig<T>) => (
    <form.Field
      key={config.name as string}
      name={config.name as any}
      validators={{
        onChange: ({ value }) =>
          config.required && !value && value !== 0 ? 'Este campo es obligatorio' : undefined,
      }}
    >
      {(field) => (
        <div className="flex flex-col gap-1.5 mb-4">
          {config.type !== 'checkbox' && (
            <div className="flex items-center gap-2 mb-1">
              <label className="text-sm font-semibold text-text flex items-center gap-1.5">
                {config.label} {config.required && <span className="text-danger">*</span>}
              </label>
              {config.description && (
                <div className="group relative flex items-center">
                  <HelpCircle className="w-4 h-4 text-text-muted cursor-help hover:text-primary transition-colors" />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 p-3 bg-surface-2 text-text text-xs rounded-xl shadow-xl border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                    {config.description}
                  </div>
                </div>
              )}
            </div>
          )}

          {config.type === 'text' || config.type === 'number' ? (
            <Input type={config.type} placeholder={config.placeholder}
              value={field.state.value as string | number}
              onChange={(e) => field.handleChange(e.target.value as any)}
              onBlur={field.handleBlur} min={config.min} step={config.stepIncrement}
              disabled={isViewMode} className={isViewMode ? 'opacity-70 cursor-not-allowed' : ''} />
          ) : config.type === 'textarea' ? (
            <textarea
              className={`w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none min-h-[80px] ${isViewMode ? 'opacity-70 cursor-not-allowed' : ''}`}
              placeholder={config.placeholder} value={field.state.value as string}
              onChange={(e) => field.handleChange(e.target.value as any)}
              onBlur={field.handleBlur} disabled={isViewMode} />
          ) : config.type === 'select' ? (
            <select
              className={`w-full rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none ${isViewMode ? 'opacity-70 cursor-not-allowed' : ''}`}
              value={field.state.value as string | number}
              onChange={(e) => field.handleChange(e.target.value as any)}
              onBlur={field.handleBlur} disabled={isViewMode}>
              <option value="">Seleccione una opción...</option>
              {config.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : config.type === 'checkbox' ? (
            <label className="flex items-center gap-3 mt-2 mb-2 p-4 border border-border bg-surface-2/30 rounded-xl cursor-pointer hover:bg-surface-2/60 transition-colors">
              <input type="checkbox" checked={field.state.value as boolean}
                onChange={(e) => field.handleChange(e.target.checked as any)}
                onBlur={field.handleBlur} disabled={isViewMode}
                className="rounded text-primary focus:ring-primary bg-surface-2 border-border h-5 w-5 disabled:opacity-50" />
              <span className="text-sm text-text font-medium">{config.label}</span>
            </label>
          ) : null}

          {field.state.meta.errors.length > 0 && (
            <span className="text-xs text-danger mt-1">{field.state.meta.errors.join(', ')}</span>
          )}
        </div>
      )}
    </form.Field>
  );

  // Footer anclado al fondo — nunca hace scroll
  const wizardFooter = (
    <div className="flex justify-between items-center">
      <Button type="button" variant="ghost" onClick={prevStep} disabled={currentStep === 0 || isSubmitting}>
        ← Atrás
      </Button>
      <div className="flex gap-3">
        <Button type="button" variant="secondary" onClick={closeAndReset} disabled={isSubmitting}>
          Cerrar
        </Button>
        {isViewMode ? (
          <Button type="button" onClick={onEnableEdit} variant="secondary">Habilitar Edición</Button>
        ) : !isLastStep ? (
          <Button type="button" onClick={nextStep}>Siguiente →</Button>
        ) : (
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isFormSubmitting]) => (
              <Button type="button" onClick={() => form.handleSubmit()}
                disabled={!canSubmit || isFormSubmitting || isSubmitting}
                isLoading={isSubmitting || isFormSubmitting}>
                Guardar
              </Button>
            )}
          />
        )}
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={closeAndReset} title={title}
      headerActions={headerActions} footer={wizardFooter}>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-surface-2 rounded-full -z-10" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full -z-10 transition-all duration-300"
            style={{ width: `${(currentStep / (stepNames.length - 1)) * 100}%` }} />
          {stepNames.map((name, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 bg-surface px-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors
                ${idx <= currentStep
                  ? 'bg-primary text-white shadow-[0_0_15px_rgba(108,99,255,0.4)]'
                  : 'bg-surface-2 text-text-muted border-2 border-border'}`}>
                {idx + 1}
              </div>
              <span className={`text-xs font-semibold ${idx <= currentStep ? 'text-text' : 'text-text-muted'}`}>
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Campos en grid 2 columnas en desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 animate-in fade-in slide-in-from-right-4 duration-300">
        {fields.filter((f) => f.step === currentStep).map((config) => (
          <div key={config.name as string} className={config.fullWidth || config.type === 'checkbox' || config.type === 'textarea' ? 'sm:col-span-2' : ''}>
            {renderField(config)}
          </div>
        ))}
      </div>
    </Modal>
  );
}
