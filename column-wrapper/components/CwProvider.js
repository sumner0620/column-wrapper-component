import { createContext, useContext } from 'react';

export const CwContext = createContext({});

export const CwProvider = CwContext.Provider;

export function useCwContext() {
    const context = useContext(CwContext);
    if (!context) {
        throw new Error(
            'useCwContext must be used within a CwContext.Provider'
        );
    }
    return context;
}
