function DashboardHeader({ user }) {
  return (
    <header className="dashboard-header">
      <div className="dashboard-breadcrumb">
        <span className="breadcrumb-dot"></span>
        <span>Dashboard</span>
      </div>
      <div className="profile-button">
        <span className="profile-avatar">{user.name.charAt(0)}</span>
        <span className="profile-copy">
          <strong>{user.name}</strong>
          <small>{user.role}</small>
        </span>
      </div>
    </header>
  );
}

export default DashboardHeader;
