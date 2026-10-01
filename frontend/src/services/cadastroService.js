import api from './api';

export async function getPersons() {
  const response = await api.get('/users');
  return response.data;
}

export async function createPerson(data) {
  const response = await api.post('/users', data);
  return response.data;
}

export async function updatePerson(id, data) {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
}

export default {
  getPersons,
  createPerson,
  updatePerson,
};