import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Trophy, ChevronRight, Lock, Loader2, CheckCircle2, AlertTriangle, RefreshCw, Wand2, ShieldCheck, Download, Share2, Cpu, Phone, Crown, ArrowRight } from 'lucide-react';
import { aiService, type Feedback, type ScenarioType } from '../services/aiService';
import { useUser } from '../contexts/UserContext';
import RadarChart from '../components/RadarChart';
import Logo from '../components/Logo';

const FeedbackPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { tier, canAccessFeedback, upgradeToPaid } = useUser();
    const responses = location.state?.responses || [];
    const scenarioId = (location.state?.scenarioId as ScenarioType) || 'General';
    const isVoice = location.state?.isVoice || false;

    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [showPaywall, setShowPaywall] = useState(false);

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
            }
            setLoading(false);
        };
        getFeedback();
    }, [responses, navigate, scenarioId, isVoice, canAccessFeedback]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white text-slate-900 p-6">
                <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mb-8" strokeWidth={1.5} />
                <div className="text-center space-y-3">
                    <h2 className="text-2xl font-bold tracking-tight">Processing Interview</h2>
                    <p className="text-slate-500 font-semibold text-xs uppercase tracking-widest text-center">Evaluating your responses</p>
                </div>
            </div>
        );
    }

    // Free tier gate - show upgrade prompt instead of feedback
    if (!canAccessFeedback()) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
                <div className="max-w-lg w-full bg-white rounded-[3rem] shadow-2xl p-12 border border-slate-100 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-500/20">
                        <Crown size={40} />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight mb-3">Interview Complete!</h1>
                    <p className="text-slate-500 font-medium mb-8">Great job completing your practice interview. Upgrade to see your detailed feedback and performance report.</p>

                    <div className="bg-indigo-50 rounded-2xl p-6 mb-8 text-left space-y-4">
                        <div className="flex items-center text-sm font-bold text-indigo-900">
                            <Lock className="w-4 h-4 mr-3 text-indigo-600" />
                            Detailed Performance Score
                        </div>
                        <div className="flex items-center text-sm font-bold text-indigo-900">
                            <Lock className="w-4 h-4 mr-3 text-indigo-600" />
                            Competency Breakdown
                        </div>
                        <div className="flex items-center text-sm font-bold text-indigo-900">
                            <Lock className="w-4 h-4 mr-3 text-indigo-600" />
                            Personalized Improvement Tips
                        </div>
                        <div className="flex items-center text-sm font-bold text-indigo-900">
                            <Lock className="w-4 h-4 mr-3 text-indigo-600" />
                            Downloadable Report Card
                        </div>
                    </div>

                    <div className="flex items-center justify-center mb-8">
                        <span className="text-4xl font-black text-indigo-600">R59</span>
                        <span className="text-slate-400 font-bold ml-2">once-off</span>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => {
                                // In production, this would trigger payment flow
                                alert('Payment integration coming soon!');
                            }}
                            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center"
                        >
                            Unlock Full Report <ArrowRight className="ml-2 w-5 h-5" />
                        </button>
                        <button
                            onClick={() => navigate('/onboarding')}
                            className="w-full py-3 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600 transition-colors"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-32">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Logo />
                    <div className="flex space-x-3">
                        <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"><Share2 size={20} /></button>
                        <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"><Download size={20} /></button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 pt-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Left Column: Result Overview */}
                    <div className="lg:col-span-8 flex flex-col space-y-10">

                        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-10 md:p-14">
                                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-10">
                                    <div className="space-y-4">
                                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-widest">
                                            <ShieldCheck size={14} />
                                            <span>Assessment Finalized</span>
                                        </div>
                                        <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-slate-900">
                                            Role Readiness <br /> <span className="text-indigo-600">Report.</span>
                                        </h1>
                                    </div>

                                    <div className="flex items-center space-x-8">
                                        <div className="text-center">
                                            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Score Index</div>
                                            <div className="text-6xl font-black tracking-tight text-slate-900 tabular-nums">
                                                {feedback?.score}
                                            </div>
                                        </div>
                                        <div className="h-14 w-[1px] bg-slate-200"></div>
                                        <div className="text-left">
                                            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Classification</div>
                                            <div className={`text-xl font-bold ${feedback?.category === 'Interview Ready' ? 'text-green-600' : 'text-amber-600'}`}>
                                                {feedback?.category}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Detailed Competency Visualization */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                                    {[
                                        { label: 'Empathy', val: feedback?.competencies.empathy, color: 'bg-indigo-600' },
                                        { label: 'Clarity', val: feedback?.competencies.clarity, color: 'bg-sky-500' },
                                        { label: 'De-escalation', val: feedback?.competencies.conflict, color: 'bg-red-500' },
                                        { label: 'Structure', val: feedback?.competencies.structure, color: 'bg-amber-500' },
                                        { label: 'Professionalism', val: feedback?.competencies.professionalism, color: 'bg-emerald-500' }
                                    ].map((c, i) => (
                                        <div key={i} className="space-y-3">
                                            <div className="flex justify-between items-end">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 truncate mr-2">{c.label}</span>
                                                <span className="text-sm font-bold text-slate-900">{c.val}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div className={`h-full ${c.color} transition-all duration-1000 delay-500`} style={{ width: `${c.val}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Analysis Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-10 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
                                <div className="flex items-center space-x-3 text-indigo-600 uppercase font-bold tracking-widest text-[10px]">
                                    <CheckCircle2 size={16} />
                                    <span>Core Strengths</span>
                                </div>
                                <p className="text-lg font-bold leading-relaxed text-slate-700">
                                    {feedback?.positive}
                                </p>
                            </div>

                            <div className="p-10 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
                                <div className="flex items-center space-x-3 text-amber-500 uppercase font-bold tracking-widest text-[10px]">
                                    <AlertTriangle size={16} />
                                    <span>Areas for Growth</span>
                                </div>
                                <p className="text-lg font-bold leading-relaxed text-slate-700">
                                    {feedback?.toImprove}
                                </p>
                            </div>
                        </div>

                        {/* Direct Feedback Refinement */}
                        <div className="p-12 bg-indigo-900 rounded-[2.5rem] text-white relative overflow-hidden shadow-xl">
                            <div className="absolute top-0 right-0 p-10 opacity-10">
                                <Phone size={80} fill="currentColor" />
                            </div>
                            <div className="relative z-10 space-y-10">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-white/10 rounded-xl">
                                        <Wand2 size={24} className="text-white" />
                                    </div>
                                    <div className="uppercase font-bold tracking-widest text-[10px] text-indigo-200">Expert Response Refinement</div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-4">
                                        <div className="text-[10px] font-bold text-indigo-300/60 uppercase tracking-widest">Your Vocal Input</div>
                                        <p className="text-indigo-100 italic font-medium leading-relaxed">"{responses[responses.length - 1]}"</p>
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

                        <div className="p-10 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-10 text-center">Competency Map</div>
                            <div className="w-full opacity-90 mb-6 px-4">
                                {feedback?.competencies && <RadarChart data={feedback.competencies} />}
                            </div>
                        </div>

                        <div className="p-10 bg-white rounded-[2.5rem] border border-slate-200 shadow-lg space-y-8 relative overflow-hidden group">
                            <div className="relative z-10">
                                <h3 className="text-2xl font-black tracking-tight mb-4 leading-tight">Advance your <br /> <span className="text-indigo-600">Career.</span></h3>
                                <p className="text-slate-500 font-medium text-sm mb-8 leading-relaxed">Access 50+ specialized scenarios and professional certification paths.</p>

                                <div className="space-y-5 mb-10">
                                    {[
                                        "Advanced Sales Objections",
                                        "Supervisor Level Conflict",
                                        "Professional Progress Portfolio"
                                    ].map((p, i) => (
                                        <div key={i} className="flex items-center text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                            <div className="w-5 h-5 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mr-3"><Lock size={10} /></div>
                                            <span>{p}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setShowPaywall(true)}
                                    className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center shadow-lg shadow-indigo-500/10 text-sm"
                                >
                                    Unlock Full Library <ChevronRight className="ml-2 w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/interview', { state: { scenario: scenarioId } })}
                            className="w-full py-5 bg-white border border-slate-200 text-slate-900 rounded-[2rem] font-bold text-sm tracking-wide flex items-center justify-center hover:bg-slate-50 transition-all"
                        >
                            <RefreshCw className="mr-3 text-indigo-600" size={18} /> Re-Take Practice
                        </button>
                    </div>
                </div>
            </div>

            {/* Paywall Overlay */}
            {showPaywall && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-6">
                    <div className="max-w-xl w-full bg-white rounded-[3rem] shadow-2xl p-16 relative overflow-hidden animate-fade-in border border-slate-100">
                        <div className="relative z-10 text-center">
                            <div className="w-20 h-20 bg-indigo-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-xl shadow-indigo-600/20">
                                <Trophy size={40} />
                            </div>
                            <h2 className="text-4xl font-black tracking-tight mb-4">Invest in your <br /> <span className="text-indigo-600">Future.</span></h2>
                            <p className="text-slate-500 font-medium mb-12">Candidates with full access are 4x more likely <br /> to successfully clear recruitment rounds.</p>

                            <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 mb-10 flex items-center justify-between">
                                <div className="text-left">
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 mb-1">Full Access</div>
                                    <div className="text-xl font-bold text-slate-900">Professional Bundle</div>
                                </div>
                                <div className="text-3xl font-black text-indigo-600">R59</div>
                            </div>

                            <div className="space-y-4">
                                <button className="w-full py-5 bg-indigo-600 text-white font-bold rounded-2xl text-base hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20">
                                    Secure Full Access
                                </button>
                                <button onClick={() => setShowPaywall(false)} className="w-full py-4 text-slate-400 font-bold uppercase tracking-widest text-[10px] hover:text-slate-600 transition-colors">
                                    Back to current report
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeedbackPage;
