import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, Lock, Loader2, CheckCircle2, AlertTriangle, RefreshCw, Wand2, ShieldCheck, Download, Share2, Phone } from 'lucide-react';
import { aiService, type Feedback, type ScenarioType } from '../services/aiService';
import { useUser } from '../contexts/UserContext';
import RadarChart from '../components/RadarChart';
import Logo from '../components/Logo';
import { getReadinessCategory } from '../utils/readiness';

const FeedbackPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { canAccessFeedback, profile, addSession } = useUser();
    const responses = location.state?.responses || [];
    const scenarioId = (location.state?.scenarioId as ScenarioType) || 'General';
    const isVoice = location.state?.isVoice || false;

    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState<Feedback | null>(null);

    useEffect(() => {
        const getFeedback = async () => {
            if (responses.length === 0) {
                navigate('/');
                return;
            }
            // Only generate feedback if user has access
            if (canAccessFeedback()) {
                const data = await aiService.generateFeedback(responses, scenarioId, isVoice);
                setFeedback(data);
                addSession({
                    id: `${Date.now()}`,
                    role: profile.role,
                    scenario: scenarioId,
                    score: data.score,
                    category: getReadinessCategory(data.score),
                    completedAt: new Date().toISOString()
                });
            }
            setLoading(false);
        };
        getFeedback();
    }, [responses, navigate, scenarioId, isVoice, canAccessFeedback]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-dark-bg text-white p-6">
                <Loader2 className="w-16 h-16 text-cyan-accent animate-spin mb-8" strokeWidth={1.5} />
                <div className="text-center space-y-3">
                    <h2 className="text-2xl font-bold tracking-tight">Processing Interview</h2>
                    <p className="text-gray-secondary font-semibold text-xs uppercase tracking-widest text-center">Evaluating your responses</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-bg text-white font-sans pb-32">
            {/* Header */}
            <div className="bg-dark-surface/40 border-b border-dark-border sticky top-0 z-40 backdrop-blur-sm">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Logo />
                    <div className="flex space-x-3">
                        <button className="p-2.5 text-gray-tertiary hover:text-cyan-accent hover:bg-dark-border rounded-lg transition-all"><Share2 size={20} /></button>
                        <button className="p-2.5 text-gray-tertiary hover:text-cyan-accent hover:bg-dark-border rounded-lg transition-all"><Download size={20} /></button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 pt-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Left Column: Result Overview */}
                    <div className="lg:col-span-8 flex flex-col space-y-10">

                        <div className="bg-dark-surface/40 rounded-2xl border border-dark-border/50 shadow-xl overflow-hidden backdrop-blur-sm">
                            <div className="p-10 md:p-14">
                                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-10">
                                    <div className="space-y-4">
                                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-success/10 border border-emerald-success/30 text-emerald-success text-[10px] font-bold uppercase tracking-widest">
                                            <ShieldCheck size={14} />
                                            <span>Assessment Complete</span>
                                        </div>
                                        <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-white">
                                            Role Readiness <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-accent to-purple-accent">Report.</span>
                                        </h1>
                                    </div>

                                    <div className="flex items-center space-x-8">
                                        <div className="text-center">
                                            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-tertiary mb-3">Score Index</div>
                                            <div className="text-6xl font-black tracking-tight text-cyan-accent tabular-nums">
                                                {feedback?.score}
                                            </div>
                                        </div>
                                        <div className="h-14 w-[1px] bg-dark-border"></div>
                                        <div className="text-left">
                                            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-tertiary mb-3">Classification</div>
                                            <div className={`text-xl font-bold ${feedback?.category === 'Interview Ready' ? 'text-emerald-success' : 'text-amber-warning'}`}>
                                                {feedback?.category}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Detailed Competency Visualization */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                                    {[
                                        { label: 'Empathy', val: feedback?.competencies.empathy, color: 'bg-cyan-accent' },
                                        { label: 'Clarity', val: feedback?.competencies.clarity, color: 'bg-purple-accent' },
                                        { label: 'De-escalation', val: feedback?.competencies.conflict, color: 'bg-red-500' },
                                        { label: 'Structure', val: feedback?.competencies.structure, color: 'bg-amber-warning' },
                                        { label: 'Professionalism', val: feedback?.competencies.professionalism, color: 'bg-emerald-success' }
                                    ].map((c, i) => (
                                        <div key={i} className="space-y-3">
                                            <div className="flex justify-between items-end">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-tertiary truncate mr-2">{c.label}</span>
                                                <span className="text-sm font-bold text-white">{c.val}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-dark-border rounded-full overflow-hidden">
                                                <div className={`h-full ${c.color} transition-all duration-1000 delay-500`} style={{ width: `${c.val}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Analysis Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-10 bg-dark-surface/40 rounded-2xl border border-emerald-success/20 backdrop-blur-sm space-y-6">
                                <div className="flex items-center space-x-3 text-emerald-success uppercase font-bold tracking-widest text-[10px]">
                                    <CheckCircle2 size={16} />
                                    <span>Core Strengths</span>
                                </div>
                                <p className="text-lg font-bold leading-relaxed text-gray-secondary">
                                    {feedback?.positive}
                                </p>
                            </div>

                            <div className="p-10 bg-dark-surface/40 rounded-2xl border border-amber-warning/20 backdrop-blur-sm space-y-6">
                                <div className="flex items-center space-x-3 text-amber-warning uppercase font-bold tracking-widest text-[10px]">
                                    <AlertTriangle size={16} />
                                    <span>Areas for Growth</span>
                                </div>
                                <p className="text-lg font-bold leading-relaxed text-gray-secondary">
                                    {feedback?.toImprove}
                                </p>
                            </div>
                        </div>

                        {/* Direct Feedback Refinement */}
                        <div className="p-12 bg-gradient-to-br from-dark-surface to-dark-bg rounded-2xl border border-cyan-accent/20 text-white relative overflow-hidden shadow-xl">
                            <div className="absolute top-0 right-0 p-10 opacity-5">
                                <Phone size={80} fill="currentColor" />
                            </div>
                            <div className="relative z-10 space-y-10">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-cyan-accent/10 rounded-lg">
                                        <Wand2 size={24} className="text-cyan-accent" />
                                    </div>
                                    <div className="uppercase font-bold tracking-widest text-[10px] text-cyan-accent">Expert Response Refinement</div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-4">
                                        <div className="text-[10px] font-bold text-gray-tertiary uppercase tracking-widest">Your Vocal Input</div>
                                        <p className="text-gray-secondary italic font-medium leading-relaxed">"{responses[responses.length - 1]}"</p>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="text-[10px] font-bold text-white uppercase tracking-widest">Optimized Alternative</div>
                                        <p className="text-white font-bold text-xl leading-snug">"{feedback?.suggestedRevision}"</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Map & Next Steps */}
                    <div className="lg:col-span-4 space-y-8">

                        <div className="p-10 bg-dark-surface/40 rounded-2xl border border-dark-border/50 backdrop-blur-sm">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-tertiary mb-10 text-center">Competency Map</div>
                            <div className="w-full opacity-90 mb-6 px-4">
                                {feedback?.competencies && <RadarChart data={feedback.competencies} />}
                            </div>
                        </div>

                        <div className="p-10 bg-gradient-to-br from-cyan-accent/10 to-purple-accent/10 rounded-2xl border border-cyan-accent/30 shadow-lg backdrop-blur-sm space-y-8 relative overflow-hidden group">
                            <div className="relative z-10">
                                <h3 className="text-2xl font-black tracking-tight mb-4 leading-tight text-white">Advance your <br /> <span className="text-cyan-accent">Career.</span></h3>
                                <p className="text-gray-secondary font-medium text-sm mb-8 leading-relaxed">Access 50+ specialized scenarios and professional certification paths.</p>

                                <div className="space-y-5 mb-10">
                                    {[
                                        "Advanced Sales Objections",
                                        "Supervisor Level Conflict",
                                        "Professional Progress Portfolio"
                                    ].map((p, i) => (
                                        <div key={i} className="flex items-center text-[10px] font-bold uppercase tracking-wider text-gray-secondary">
                                            <div className="w-5 h-5 bg-cyan-accent/10 text-cyan-accent rounded-full flex items-center justify-center mr-3"><Lock size={10} /></div>
                                            <span>{p}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => navigate('/onboarding')}
                                    className="w-full py-3 bg-gradient-to-r from-cyan-accent to-purple-accent text-black font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-accent/30 transition-all flex items-center justify-center text-sm"
                                >
                                    Explore more Scenarios <ChevronRight className="ml-2 w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/interview', { state: { scenario: scenarioId } })}
                            className="w-full py-4 bg-dark-surface border border-dark-border text-white rounded-xl font-bold text-sm tracking-wide flex items-center justify-center hover:border-cyan-accent/50 transition-all"
                        >
                            <RefreshCw className="mr-3 text-cyan-accent" size={18} /> Re-Take Practice
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedbackPage;
