import { create } from "zustand";

export const useModelStore = create((set) => ({
    selectedModel: null,
    setSelectedModel: (model) => set({ selectedModel: model })
}));