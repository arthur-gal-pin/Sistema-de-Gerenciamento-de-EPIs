import api_jsonfake from './api.js';

export async function getPersons() {
  try {
    const response = await api_jsonfake.get("/users");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dados de pessoas:", error);
    return [];
  }
}

export async function createPerson(data) {
  try {
    const response = await api_jsonfake.post("/users", data);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar pessoa:", error);
    throw error;
  }
}

export async function updatePerson(id, data) {
  try {
    const response = await api_jsonfake.put(`/users/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar pessoa:", error);
    throw error;
  }
}