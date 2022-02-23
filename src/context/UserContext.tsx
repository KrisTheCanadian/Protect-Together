import { createCtx } from './CreateContext';

export const [ctx, UserProvider] = createCtx({
  firstName: '',
  lastName: '',
  role: '',
});
export const UserContext = ctx;
