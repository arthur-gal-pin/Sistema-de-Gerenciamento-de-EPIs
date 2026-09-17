import ProfileCard from '../components/profile/ProfileCard'
import { currentUser, profileFields } from '../data/profileData'

function ProfilePage() {
  return (
    <section className="w-100 px-lg py-xl d-flex justify-content-center align-items-center">
      <div className="w-100 d-flex flex-column gap-lg" style={{ maxWidth: 896 }}>
        {/* Top bar: navigation & page level actions */}
        <div className="w-100 d-flex align-items-center justify-content-between">
          <button type="button" className="btn-brand-secondary">
            <i className="bi bi-arrow-left" style={{ fontSize: 20 }}></i>
            <span>Voltar</span>
          </button>

          <div className="d-flex align-items-center gap-sm">
            <button type="button" className="btn-brand-tertiary">
              <i className="bi bi-pencil" style={{ fontSize: 18 }}></i>
              <span>Editar Perfil</span>
            </button>
          </div>
        </div>

        {/* Main profile card */}
        <ProfileCard user={currentUser} fields={profileFields} />
      </div>
    </section>
  )
}

export default ProfilePage
