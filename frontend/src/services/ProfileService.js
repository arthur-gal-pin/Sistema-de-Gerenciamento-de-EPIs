export async function getProfile() {
    const response = await fetch("http://localhost:8080/perfil");

    if (!response.ok) {
        throw new Error("Erro ao buscar perfil");
    }

    const data = await response.json();

    return data;
}