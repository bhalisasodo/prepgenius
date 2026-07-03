import { ArrowLeft, CalendarDays, Sparkles, Target, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { useUser } from '../contexts/UserContext';
import { calculateProgressSnapshot } from '../utils/readiness';

const ProgressPage = () => {
  const navigate = useNavigate();
  const { profile, sessions } = useUser();

  const snapshot = calculateProgressSnapshot(sessions.map(session => ({
    score: session.score,
    category: session.category,
    completedAt: session.completedAt
  })));

  const summaryCards = [
    { label: 'Average score', value: `${snapshot.averageScore}/100`, icon: Target },
    { label: 'Best score', value: `${snapshot.bestScore}/100`, icon: TrendingUp },
    { label: 'Improvement', value: `+${snapshot.improvement}`, icon: Sparkles },
    { label: 'Sessions', value: `${snapshot.totalSessions}`, icon: CalendarDays }
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-white font-sans">
      <header className="border-b border-dark-border bg-dark-surface/50 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="rounded-lg p-2 text-gray-tertiary transition-colors hover:bg-white/5 hover:text-white"
            >
              <ArrowLeft size={18} />
            </button>
            <Logo />
          </div>
          <div className="rounded-full border border-dark-border bg-dark-bg px-4 py-2 text-sm text-gray-secondary">
            {profile.role} • {profile.experience}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="mb-10 max-w-3xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-accent">Progress dashboard</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white">Your readiness trend is building.</h1>
          <p className="mt-4 text-lg text-gray-secondary">
            Track your practice history, see how your score improves over time, and focus on the next interview skill to sharpen.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="rounded-2xl border border-dark-border/60 bg-dark-surface/60 p-5">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-tertiary">{card.label}</div>
                  <div className="rounded-lg bg-cyan-accent/10 p-2 text-cyan-accent">
                    <Icon size={16} />
                  </div>
                </div>
                <div className="mt-5 text-3xl font-black text-white">{card.value}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-dark-border/60 bg-dark-surface/60 p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-accent">Recent sessions</p>
                <h2 className="mt-2 text-2xl font-black text-white">Your last practice runs</h2>
              </div>
              <div className="rounded-full border border-cyan-accent/20 bg-cyan-accent/10 px-3 py-1 text-sm font-semibold text-cyan-accent">
                {snapshot.latestCategory}
              </div>
            </div>

            <div className="mt-8 space-y-3">
              {sessions.length > 0 ? sessions.slice(-6).map((session) => (
                <div key={session.id} className="flex items-center justify-between rounded-2xl border border-dark-border/60 bg-dark-bg/70 px-4 py-3">
                  <div>
                    <div className="font-semibold text-white">{session.scenario}</div>
                    <div className="text-sm text-gray-tertiary">{session.role} • {new Date(session.completedAt).toLocaleDateString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-cyan-accent">{session.score}/100</div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-gray-tertiary">{session.category}</div>
                  </div>
                </div>
              )) : <p className="text-sm text-gray-secondary">Complete a practice interview to build your progress history.</p>}
            </div>
          </div>

          <div className="rounded-3xl border border-cyan-accent/20 bg-gradient-to-br from-cyan-accent/10 to-purple-accent/10 p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-accent">Coaching focus</p>
            <h2 className="mt-2 text-2xl font-black text-white">Next step for growth</h2>
            <p className="mt-5 text-sm leading-relaxed text-gray-secondary">
              {snapshot.latestCategory === 'Interview Ready'
                ? 'You are showing strong readiness. Keep practicing high-pressure scenarios to make your delivery feel even more natural.'
                : snapshot.latestCategory === 'Borderline'
                  ? 'Your recent sessions suggest you are close to interview-ready. Focus on structure, empathy, and concise answers.'
                  : 'Your first sessions are a great baseline. Keep practicing one scenario at a time and refine your clarity and pacing.'}
            </p>
            <button
              onClick={() => navigate('/onboarding')}
              className="mt-8 w-full rounded-xl bg-gradient-to-r from-cyan-accent to-purple-accent px-4 py-3 font-bold text-black transition-all hover:shadow-lg hover:shadow-cyan-accent/30"
            >
              Start another practice run
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProgressPage;
