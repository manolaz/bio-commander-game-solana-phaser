import type { Umi } from '@metaplex-foundation/umi';
import { createContext, useContext } from 'react';

type UmiContext = {
    umi: Umi;
};

const DEFAULT_CONTEXT: UmiContext = {
    umi: null as any, // This will be overridden by UmiProvider
};

export const UmiContext = createContext<UmiContext>(DEFAULT_CONTEXT);

export function useUmi(): Umi {
    const { umi } = useContext(UmiContext);
    if (!umi) {
        throw new Error(
            'Umi context was not initialized. ' +
            'Did you forget to wrap your app with <UmiProvider />?'
        );
    }
    return umi;
}