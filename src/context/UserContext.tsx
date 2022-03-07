import { createCtx } from './CreateContext';

export const [ctx, UserProvider] = createCtx({
  firstName: '',
  lastName: '',
  role: '',
  id: '',
});
export const UserContext = ctx;
