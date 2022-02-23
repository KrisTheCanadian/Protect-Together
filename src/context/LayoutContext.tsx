import React, { createContext, useContext } from 'react';

export type LayoutContextType = {
  open: boolean;
  setOpen: (boolean: boolean) => any;
};

export const LayoutContext = createContext<LayoutContextType>({
  open: false,
  setOpen: (open) => null,
});

export const useLayoutContext = () => useContext(LayoutContext);
