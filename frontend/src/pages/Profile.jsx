import ProfileCard from "../components/ProfileCard";

export default function Profile() {
  const profile = {
    nome: "Thiago Luis",
    cargo: "Gerente Geral",
    cpf: "277-712-476-55",
    telefone: "+55 19 54543-5432",
    email: "thiago.luis@gmail.com",
    foto: null, 
  };

  return <ProfileCard profile={profile} />;
}