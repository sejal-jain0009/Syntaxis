import './Modal.css';

function LoginRequiredModal({ open, onClose, onNavigate }) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="login-required-title">
      <div className="status-modal login-required-modal">
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close save prompt">×</button>
        <span className="status-check" aria-hidden="true">↗</span>
        <p className="modal-kicker">SAVE SNIPPET</p>
        <h2 id="login-required-title">Save your code</h2>
        <p>Create an account or log in to save your snippets and access them later.</p>
        <div className="modal-actions">
          <button className="modal-primary" type="button" onClick={() => onNavigate('/login')}>Log In</button>
          <button className="modal-secondary" type="button" onClick={() => onNavigate('/signup')}>Sign Up</button>
        </div>
      </div>
    </div>
  );
}

export default LoginRequiredModal;
