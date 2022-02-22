import React, { createContext, useContext } from 'react';

// generic createCTx function
export function createCtx<A>(defaultValue: A) {
  type UpdateType = React.Dispatch<React.SetStateAction<typeof defaultValue>>;
  const defaultUpdate: UpdateType = () => defaultValue;
  const ctx = React.createContext({
    state: defaultValue,
    update: defaultUpdate,
  });
  function Provider(props: React.PropsWithChildren<Record<string, unknown>>) {
    const [state, update] = React.useState(defaultValue);
    const value = React.useMemo(
      () => ({
        state,
        update,
      }),
      [state],
    );
    return <ctx.Provider value={value} {...props} />;
  }
  return [ctx, Provider] as const; // alternatively, [typeof ctx, typeof Provider]
}

export const [ctx, UserProvider] = createCtx({ firstName: '' });
export const UserContext = ctx;
