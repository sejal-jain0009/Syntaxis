import { useEffect, useState } from "react";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Playground from "./pages/Playground";
import Settings from './pages/Settings';
import { useProfile } from './context/ProfileContext';

function App() {
  const [path, setPath] = useState(window.location.pathname);
  const { authenticate } = useProfile();

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  function navigate(nextPath) {
    const url = new URL(nextPath, window.location.origin);
    window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`);
    setPath(url.pathname);
  }

  if (path === '/login') {
    return <Login key={path} onNavigate={navigate} onAuthenticated={authenticate} />;
  }

  if (path === '/signup') {
    return <Signup key={path} onNavigate={navigate} onAuthenticated={authenticate} />;
  }

  if (path === '/dashboard') {
    return <Dashboard onNavigate={navigate} />;
  }

  if (path === '/profile') {
    return <Profile onNavigate={navigate} />;
  }

  if (path === '/playground') {
    return <Playground onNavigate={navigate} />;
  }

  if (path === '/settings') {
    return <Settings onNavigate={navigate} />;
  }

  return <LandingPage onNavigate={navigate} />;
}

export default App;