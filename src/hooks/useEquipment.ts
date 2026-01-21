import { useState, useMemo, useCallback } from 'react';
import { Equipment } from '@/types/rental';
import { mockEquipment } from '@/data/mockEquipment';

export const useEquipment = () => {
  const [equipment] = useState<Equipment[]>(mockEquipment);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEquipment = useMemo(() => {
    if (!searchQuery) return equipment.filter((e) => e.disponible);

    const query = searchQuery.toLowerCase();
    return equipment.filter(
      (e) =>
        e.disponible &&
        (e.nombre.toLowerCase().includes(query) ||
          e.codigo.toLowerCase().includes(query) ||
          e.categoria.toLowerCase().includes(query))
    );
  }, [equipment, searchQuery]);

  const getEquipmentById = useCallback(
    (id: string): Equipment | undefined => {
      return equipment.find((e) => e.id === id);
    },
    [equipment]
  );

  const getPriceByRate = useCallback(
    (equipmentId: string, rateType: 'DIA' | 'SEMANA' | 'MES'): number => {
      const eq = equipment.find((e) => e.id === equipmentId);
      if (!eq) return 0;

      switch (rateType) {
        case 'DIA':
          return eq.precioDia;
        case 'SEMANA':
          return eq.precioSemana;
        case 'MES':
          return eq.precioMes;
        default:
          return eq.precioDia;
      }
    },
    [equipment]
  );

  return {
    equipment: filteredEquipment,
    allEquipment: equipment,
    searchQuery,
    setSearchQuery,
    getEquipmentById,
    getPriceByRate,
  };
};
