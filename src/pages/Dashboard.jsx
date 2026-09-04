import { useEffect, useRef } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import QuickActions from '../components/dashboard/QuickActions';
import StatsCards from '../components/dashboard/StatsCards';
import ContinueCoding from '../components/dashboard/ContinueCoding';
import RecommendedProblems from '../components/dashboard/RecommendedProblems';
import RecentActivity from '../components/dashboard/RecentActivity';
import DailyGoal from '../components/dashboard/DailyGoal';
import { demoDashboardData } from '../data/dashboardData';
import { useProfile } from '../context/ProfileContext';
import './Dashboard.css';

function Dashboard({ onNavigate }) {
  const dashboardMainRef = useRef(null);
  const { profile } = useProfile();
  const { stats, dailyGoal, continueCoding, recommendedProblems, recentActivity } = demoDashboardData;
  const user = { name: profile.name, role: profile.role };

  useEffect(() => {
    const root = dashboardMainRef.current;
    if (!root) return undefined;

    const revealTargets = root.querySelectorAll(
      '.dashboard-header, .dashboard-intro, .daily-goal, .dashboard-section, .quick-action, .stat-card, .continue-card, .problem-row, .activity-row'
    );
    revealTargets.forEach((element, index) => {
      element.dataset.dashboardReveal = '';
      element.style.setProperty('--dashboard-reveal-delay', `${Math.min(index * 45, 280)}ms`);
    });

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      revealTargets.forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { root, threshold: 0.12, rootMargin: '0px 0px -7% 0px' });

    revealTargets.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="dashboard-page">
      <Sidebar onNavigate={onNavigate} />
      <main className="dashboard-main" ref={dashboardMainRef}>
        <DashboardHeader user={user} />
        <div className="dashboard-content">
          <section className="dashboard-intro" aria-labelledby="dashboard-title">
            <p className="dashboard-kicker">YOUR WORKSPACE</p>
            <h1 id="dashboard-title">Welcome back, <span>{user.name}!</span></h1>
            <p>Ready to turn your logic into code?</p>
          </section>
          <DailyGoal goal={dailyGoal} streak={stats.currentStreak} />
          <QuickActions onNavigate={onNavigate} />
          <StatsCards stats={stats} />
          <div className="dashboard-columns">
            <div className="dashboard-column">
              <ContinueCoding item={continueCoding} onNavigate={onNavigate} />
              <RecommendedProblems problems={recommendedProblems} />
            </div>
            <RecentActivity activity={recentActivity} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
