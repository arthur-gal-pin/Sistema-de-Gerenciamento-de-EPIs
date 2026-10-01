import ProfileField from './ProfileField'

function ProfileCard({ user, fields }) {
  return (
    <div className="profile-card w-100 d-flex flex-column flex-md-row">
      {/* Identity summary column */}
      <div className="profile-identity-col w-100 col-md-5 p-xl d-flex flex-column align-items-center justify-content-center text-center gap-md">
        <div className="profile-avatar-wrap">
          <img alt={user.name} src={user.avatarUrl} />
          <div className="profile-avatar-check">
            <i className="bi bi-check-lg" style={{ fontSize: 14 }}></i>
          </div>
        </div>
        <div className="d-flex flex-column gap-xs mt-sm">
          <h1 className="headline-md text-on-surface fw-semibold mb-0" style={{ fontSize: '1.5rem' }}>
            {user.name}
          </h1>
          <div className="profile-role-pill align-self-center">
            <i className="bi bi-clipboard2-pulse" style={{ fontSize: 16 }}></i>
            <span className="label-md fw-medium">{user.role}</span>
          </div>
        </div>
      </div>

      {/* Detailed profile data column */}
      <div className="profile-fields-col w-100 col-md-7 p-xl d-flex flex-column justify-content-center">
        <div className="d-flex flex-column gap-md">
          {fields.map((field) => (
            <ProfileField key={field.id} icon={field.icon} label={field.label} value={field.value} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProfileCard
