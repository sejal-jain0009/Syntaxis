import { useState } from 'react';
import AuthForm from '../components/AuthForm';
import Navbar from '../components/Navbar';
import TransitionModal from '../components/TransitionModal';
import { useProfile } from '../context/ProfileContext';
import './Auth.css';

function Login({ onNavigate, onAuthenticated }) {
  const { profile } = useProfile();
  const [showTransition, setShowTransition] = useState(false);
  function switchToSignup(event) {
    event.preventDefault();
    onNavigate('/signup');
  }

  function preserveNavigationFocus(event) {
    if (event.button === 0) {
      event.preventDefault();
    }
  }

  function handleSuccess() {
    onAuthenticated();
    setShowTransition(true);
  }

  return (
    <main className="auth-page">
      <Navbar authPath="/login" onNavigate={onNavigate} />

      <section className="auth-shell" aria-labelledby="login-heading">
        <div className="auth-code-mark" aria-hidden="true">&lt;/&gt;</div>
        <p className="auth-kicker">WELCOME BACK</p>
        <h1 id="login-heading">Welcome back</h1>
        <p className="auth-subheading">Continue your coding journey with Syntaxis.</p>
        <AuthForm mode="login" onSuccess={handleSuccess} />
        <p className="auth-switch">
          Don&apos;t have an account? <a href="/signup" onMouseDown={preserveNavigationFocus} onClick={switchToSignup}>Sign up</a>
        </p>
      </section>

      <p className="auth-footer">Where syntax meets logic.</p>
      <TransitionModal open={showTransition} title={`Welcome back, ${profile.name}!`} message="Connecting you to your dashboard..." actionLabel="Opening Dashboard" onComplete={() => onNavigate('/dashboard')} />
    </main>
  );
}

export default Login;
