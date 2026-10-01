import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getCurrentUser } from '../services/ProfileService';

const Ctx = createContext(null);
export const useCurrentUser = () => useContext(Ctx);

export function CurrentUserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('token')));

  const refresh = useCallback(async () => {
    if (!localStorage.getItem('token')) { setUser(null); setLoading(false); return; }
    setLoading(true);
    try { setUser(await getCurrentUser()); }
    catch { setUser(null); } // o interceptor 401 do api.js já limpa o token e redireciona
    finally { setLoading(false); }
  }, []);

  const clear = useCallback(() => { localStorage.removeItem('token'); setUser(null); }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const role = user?.cargo?.nivelPermissao ?? null;
  return <Ctx.Provider value={{ user, role, loading, refresh, clear }}>{children}</Ctx.Provider>;
}