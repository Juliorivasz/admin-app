import React, { useState } from 'react';
import type { Categoria } from '../../categorias/types/categoria';
import type { CategoriaEnProducto } from '../types/producto';
import Button from '../../../components/ui/Button';

interface AddCategoriaFormProps {
  todasCategorias: Categoria[];
  categoriasActuales: CategoriaEnProducto[];
  isPending: boolean;
  onSubmit: (categoria_id: number, es_principal: boolean) => void;
  onCancel: () => void;
}

const AddCategoriaForm = ({
  todasCategorias,
  categoriasActuales,
  isPending,
  onSubmit,
  onCancel,
}: AddCategoriaFormProps) => {
  const [categoriaId, setCategoriaId] = useState(0);
  const [esPrincipal, setEsPrincipal] = useState(false);

  const disponibles = todasCategorias.filter(
    (c) => !categoriasActuales.find((pc) => pc.id === c.id)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (categoriaId === 0) return;
    onSubmit(categoriaId, esPrincipal);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-muted">Categoría</label>
        <select
          value={categoriaId}
          onChange={(e) => setCategoriaId(parseInt(e.target.value))}
          className="w-full rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
          required
        >
          <option value={0} disabled>Selecciona una categoría...</option>
          {disponibles.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={esPrincipal}
          onChange={(e) => setEsPrincipal(e.target.checked)}
          className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
        />
        <span className="text-sm text-text">Marcar como categoría principal</span>
      </label>

      <div className="flex justify-end gap-3 mt-8">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" isLoading={isPending}>Asignar</Button>
      </div>
    </form>
  );
};

export default AddCategoriaForm;
