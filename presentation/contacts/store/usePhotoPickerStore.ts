import { create } from 'zustand';
import { DoorbellCapture } from '../types';

type PhotoPickerState = {
  selectedCaptures: DoorbellCapture[];
  setSelectedCaptures: (captures: DoorbellCapture[]) => void;
  clearSelection: () => void;
};

export const usePhotoPickerStore = create<PhotoPickerState>((set) => ({
  selectedCaptures: [],
  setSelectedCaptures: (captures) => set({ selectedCaptures: captures }),
  clearSelection: () => set({ selectedCaptures: [] }),
}));
