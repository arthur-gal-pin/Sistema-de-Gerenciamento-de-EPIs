function ProfileField({ icon, label, value }) {
  return (
    <div className="profile-field">
      <div className="profile-field-icon">
        <i className={`bi ${icon}`}></i>
      </div>
      <div className="d-flex flex-column min-w-0">
        <span className="profile-field-label">{label}</span>
        <span className="profile-field-value text-truncate">{value}</span>
      </div>
    </div>
  )
}

export default ProfileField
