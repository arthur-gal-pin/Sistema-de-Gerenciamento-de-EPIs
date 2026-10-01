// Lê o payload do JWT guardado em localStorage ("token"): { idFuncionario, email, nome, nivelPermissao }
export function getSession() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    const payload = JSON.parse(json);
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export const getUserRole = () => getSession()?.nivelPermissao ?? null;

// Espelha o backend: DELETE exige administrador ou coordenador nessas rotas
export const canDelete = (role) => ['administrador', 'coordenador'].includes(role);
