import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useInterfaceStore = create(
  persist(
    (set) => ({
        activeInterface: 'chat',
        setActiveInterface: (id) => set({ activeInterface: id }),
    }),
    {
        name: "interface-storage",
        skipHydration: true,
    }
  )
);