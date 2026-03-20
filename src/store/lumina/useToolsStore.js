import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useToolsStore = create(
  persist(
    (set) => ({
      activeTools: [], // array of active tools (strings - tool name)
      toggleTool: (tool) => set((state) => {
        if (state.activeTools.includes(tool)) {
          return { activeTools: state.activeTools.filter(t => t !== tool) };
        } else {
          return { activeTools: [...state.activeTools, tool] };
        }
      }),
      setTools: (tools) => set({ activeTools: tools }),
    }),
    {
      name: "tools-storage",
    }
  )
);
