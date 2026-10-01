// O backend responde { message, data }. Listas vazias voltam como 404.
export async function dataOf(request) {
  const res = await request;
  return res.data?.data;
}

export async function listOrEmpty(request) {
  try {
    const res = await request;
    return res.data?.data ?? [];
  } catch (error) {
    if (error.response?.status === 404) return [];
    throw error;
  }
}

export function apiMessage(error, fallback = 'Ocorreu um erro inesperado.') {
  return error?.response?.data?.message ?? fallback;
}
