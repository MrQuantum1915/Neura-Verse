import * as geminiProvider from './gemini';
import * as sarvamProvider from './sarvam';

export const getProvider = (model) => {
    if (model.startsWith('sarvam')) {
        return sarvamProvider;
    }

    return geminiProvider;
};
