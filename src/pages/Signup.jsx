import { useState } from 'react';
import AuthForm from '../components/AuthForm';
import Navbar from '../components/Navbar';
import TransitionModal from '../components/TransitionModal';
import { useProfile } from '../context/ProfileContext';
import './Auth.css';

function Signup({ onNavigate, onAuthenticated }) {
  const { profile, updateProfile } = useProfile();
  const [showTransition, setShowTransition] = useState(false);
  function switchToLogin(event) {
    event.preventDefault();
    onNavigate('/login');
  }

  function preserveNavigationFocus(event) {
    if (event.button === 0) {
      event.preventDefault();
    }
  }

  function handleSuccess(values) {
    updateProfile({ ...profile, name: values.fullName.trim() });
    onAuthenticated();
    setShowTransition(true);
  }

  return (
    <main className="auth-page">
      <Navbar authPath="/signup" onNavigate={onNavigate} />

      <section className="auth-shell" aria-labelledby="signup-heading">
        <div className="auth-code-mark" aria-hidden="true">&lt;/&gt;</div>
        <p className="auth-kicker">START BUILDING</p>
        <h1 id="signup-heading">Create your Syntaxis account</h1>
        <p className="auth-subheading">Start building, coding, and learning with Syntaxis.</p>
        <AuthForm mode="signup" onSuccess={handleSuccess} />
        <p className="auth-switch">
          Already have an account? <a href="/login" onMouseDown={preserveNavigationFocus} onClick={switchToLogin}>Log in</a>
        </p>
      </section>

      <p className="auth-footer">Where syntax meets logic.</p>
      <TransitionModal open={showTransition} title="Account created successfully" message="Welcome to Syntaxis. Connecting you to your dashboard..." actionLabel="Opening Dashboard" onComplete={() => onNavigate('/dashboard')} />
    </main>
  );
}

export default Signup;
