import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useModelStore = create(
  persist(
    (set) => ({
      selectedModel: null,
      setSelectedModel: (model) => set({ selectedModel: model })
    }),
    {
      name: "model-storage",
    }
  )
);