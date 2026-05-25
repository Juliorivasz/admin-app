import React, { useState } from 'react';
import type { Ingrediente, IngredienteDetalle } from '../../types';
import Button from '../ui/Button';

interface AddIngredienteFormProps {
  todosIngredientes: Ingrediente[];
  ingredientesActuales: IngredienteDetalle[];
  isPending: boolean;
  onSubmit: (ingrediente_id: number, es_removible: boolean) => void;
  onCancel: () => void;
}

const AddIngredienteForm = ({
  todosIngredientes,
  ingredientesActuales,
  isPending,
  onSubmit,
  onCancel,
}: AddIngredienteFormProps) => {
  const [ingredienteId, setIngredienteId] = useState(0);
  const [esRemovible, setEsRemovible] = useState(false);

  const disponibles = todosIngredientes.filter(
    (i) => !ingredientesActuales.find((pi) => pi.ingrediente_id === i.id)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ingredienteId === 0) return;
    onSubmit(ingredienteId, esRemovible);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-muted">Ingrediente</label>
        <select
          value={ingredienteId}
          onChange={(e) => setIngredienteId(parseInt(e.target.value))}
          className="w-full rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
          required
        >
          <option value={0} disabled>Selecciona un ingrediente...</option>
          {disponibles.map((ing) => (
            <option key={ing.id} value={ing.id}>
              {ing.name} {ing.esAlergeno ? '⚠️' : ''}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={esRemovible}
          onChange={(e) => setEsRemovible(e.target.checked)}
          className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
        />
        <span className="text-sm text-text">El cliente puede quitar este ingrediente al pedir</span>
      </label>

      <div className="flex justify-end gap-3 mt-8">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" isLoading={isPending}>Añadir</Button>
      </div>
    </form>
  );
};

export default AddIngredienteForm;
