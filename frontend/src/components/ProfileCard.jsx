import { Pencil } from "lucide-react";

export default function ProfileCard({ profile }) {
  return (
    <div className="profile">
      <div className="profile-header">
        <button className="edit-btn">
          Editar Perfil <Pencil size={16} />
        </button>
      </div>

      <div className="profile-left">
        <div className="profile-photo">
          {profile.foto ? (
            <img src={profile.foto} alt="Foto de perfil" />
          ) : (
            <div className="avatar-placeholder" />
          )} 
        </div>

        <span className="cargo-badge">Cargo: {profile.cargo}</span>

        <span className="nome-badge">Nome: {profile.nome}</span>
      </div>

      <div className="profile-right">
        <div className="field">
          <label>Cpf</label>
          <div className="pill-input">{profile.cpf}</div>
        </div>

        <div className="field">
          <label>Telefone</label>
          <div className="pill-input">{profile.telefone}</div>
        </div>

        <div className="field">
          <label>Email</label>
          <div className="pill-input">{profile.email}</div>
        </div>
      </div>
    </div>
  );
}