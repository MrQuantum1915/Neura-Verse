import { create } from 'zustand';

export const useAlertStore = create((set) => ({
    alert: false,
    message: '',
    showAlert: (msg = 'Something went wrong', duration = 5000) => {
        const safeMessage = typeof msg === 'string' && msg.trim().length > 0
            ? msg
            : 'Something went wrong';

        set({ alert: true, message: safeMessage });

        setTimeout(() => {
            set({ alert: false });
        }, duration);
    },
    hideAlert: () => set({ alert: false })
}));
