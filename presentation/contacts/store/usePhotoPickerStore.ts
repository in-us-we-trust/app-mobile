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
  clearSelection: () => void;
};

export const usePhotoPickerStore = create<PhotoPickerState>((set) => ({
  selectedCaptures: [],
  setSelectedCaptures: (captures) => set({ selectedCaptures: captures }),
  galleryCaptures: [],
  addGalleryCaptures: (captures) =>
    set((state) => {
      const existingIds = new Set(state.galleryCaptures.map((c) => c.id));
      return {
        galleryCaptures: [
          ...state.galleryCaptures,
          ...captures.filter((c) => !existingIds.has(c.id)),
        ],
      };
    }),
  clearSelection: () => set({ selectedCaptures: [], galleryCaptures: [] }),
}));
