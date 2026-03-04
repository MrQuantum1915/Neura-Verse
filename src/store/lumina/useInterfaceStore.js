import { create } from "zustand";

export const useInterfaceStore = create((set) => ({
    activeInterface: 'chat',
    setActiveInterface: (id) => set({ activeInterface: id }),
}))