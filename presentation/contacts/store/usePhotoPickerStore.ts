import { create } from 'zustand';
import { DoorbellCapture } from '../types';

type PhotoPickerState = {
  selectedCaptures: DoorbellCapture[];
  setSelectedCaptures: (captures: DoorbellCapture[]) => void;
  /** Fotos importadas de la galería del teléfono en este intento de alta,
   * estén o no actualmente seleccionadas. Se mantienen acá (y no como estado
   * local de la pantalla) para no tener que volver a abrir la galería nativa
   * cada vez que se navega hacia y desde ChoosePhotoScreen. */
  galleryCaptures: DoorbellCapture[];
  addGalleryCaptures: (captures: DoorbellCapture[]) => void;
  /** Capturas del timbre provistas por el backend fuera del mock estático
   * (ej. las de una sugerencia de contacto aceptada). Son de origen "timbre",
   * no "galería", así que se muestran junto a MOCK_DOORBELL_CAPTURES y no en
   * la pestaña de galería. */
  suggestedCaptures: DoorbellCapture[];
  addSuggestedCaptures: (captures: DoorbellCapture[]) => void;
  clearSelection: () => void;
};

const mergeCaptures = (current: DoorbellCapture[], incoming: DoorbellCapture[]) => {
  const existingIds = new Set(current.map((c) => c.id));
  return [...current, ...incoming.filter((c) => !existingIds.has(c.id))];
};

export const usePhotoPickerStore = create<PhotoPickerState>((set) => ({
  selectedCaptures: [],
  setSelectedCaptures: (captures) => set({ selectedCaptures: captures }),
  galleryCaptures: [],
  addGalleryCaptures: (captures) =>
    set((state) => ({ galleryCaptures: mergeCaptures(state.galleryCaptures, captures) })),
  suggestedCaptures: [],
  addSuggestedCaptures: (captures) =>
    set((state) => ({ suggestedCaptures: mergeCaptures(state.suggestedCaptures, captures) })),
  clearSelection: () => set({ selectedCaptures: [], galleryCaptures: [], suggestedCaptures: [] }),
}));
