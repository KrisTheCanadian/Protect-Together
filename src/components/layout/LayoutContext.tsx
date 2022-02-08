import React, {
  createContext, Dispatch, SetStateAction, useContext,
} from 'react';

export type LayoutContextType = {
    open: boolean;
    setOpen: (boolean: boolean) => any;
}
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const LayoutContext = createContext<LayoutContextType>({ open: false, setOpen: (open) => console.warn(open) });

export const useLayoutContext = () => useContext(LayoutContext);
