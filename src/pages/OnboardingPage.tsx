import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ChevronRight, ArrowLeft, ShieldAlert, Sparkles, Wrench, Gavel, Cpu, Globe, Rocket, Lock, Crown } from 'lucide-react';
import { SCENARIOS, type ScenarioType } from '../services/aiService';
import { useUser } from '../contexts/UserContext';
import Logo from '../components/Logo';

const OnboardingPage = () => {
    const navigate = useNavigate();
    const { tier, canAccessScenario, useInterview } = useUser();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        role: 'Inbound Customer Support',
        experience: '0-1 years',
        scenario: 'General' as ScenarioType
    });
    const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            // Check if user has interviews remaining
            if (tier.interviewsRemaining <= 0) {
                setShowUpgradePrompt(true);
                return;
            }
            // Check if user can access selected scenario
            if (!canAccessScenario(formData.role, formData.scenario)) {
                setShowUpgradePrompt(true);
                return;
            }
            // Use one interview credit
            useInterview();
            navigate('/interview', { state: formData });
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col p-6 text-slate-900 font-sans">
            <div className="container mx-auto py-8">
                <Logo />
            </div>

            <div className="flex-1 flex items-center justify-center -mt-10">
                <div className="max-w-xl w-full bg-white rounded-[32px] border border-slate-200 shadow-xl overflow-hidden animate-fade-in relative">
                    {/* Progress Bar */}
                    <div className="absolute top-0 left-0 w-full flex space-x-0.5">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`h-1.5 flex-1 transition-all duration-500 ${i <= step ? 'bg-indigo-600' : 'bg-slate-100'}`}
                            />
                        ))}
                    </div>

                    <div className="p-10 md:p-14">
                        <button
                            onClick={() => step > 1 ? setStep(step - 1) : navigate('/')}
                            className="mb-10 text-slate-400 hover:text-indigo-600 flex items-center transition-colors text-xs font-bold uppercase tracking-wider"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back
                        </button>

                        <div className="mb-12">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 mb-2 block">
                                Step {step} of 3
                            </span>
                            <h2 className="text-3xl font-bold text-slate-900 leading-tight">
                                {step === 1 && "What role are you targeting?"}
                                {step === 2 && "Your experience level?"}
                                {step === 3 && "Select your interview focus."}
                            </h2>
                            <p className="text-sm text-slate-500 mt-2 font-medium">
                                {step === 1 && "This helps us tailor the questions to your specific career path."}
                                {step === 2 && "We adjust the difficulty of the simulation based on your seniority."}
                                {step === 3 && "Pick a scenario that matches your current interview preparation focus."}
                            </p>
                        </div>

                        {step === 1 && (
                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    { name: 'Inbound Customer Support', icon: Globe, desc: 'Technical helpdesk & service queries', free: true },
                                    { name: 'Outbound Sales', icon: Rocket, desc: 'Lead generation & client acquisition', free: false },
                                    { name: 'Technical Support', icon: Cpu, desc: 'Specialized Tier 2 technical assistance', free: false }
                                ].map((item) => {
                                    const isLocked = !item.free && tier.type === 'free';
                                    return (
                                        <button
                                            key={item.name}
                                            onClick={() => {
                                                if (isLocked) {
                                                    setShowUpgradePrompt(true);
                                                    return;
                                                }
                                                const defaultScenario = SCENARIOS.find(s => s.role === item.name)?.id || 'General';
                                                setFormData({ ...formData, role: item.name, scenario: defaultScenario as ScenarioType });
                                            }}
                                            className={`group w-full p-6 text-left rounded-2xl border-2 transition-all flex items-center justify-between ${formData.role === item.name
                                                ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-sm'
                                                : isLocked
                                                    ? 'border-slate-100 bg-slate-50/50 text-slate-400 cursor-not-allowed'
                                                    : 'border-slate-100 hover:border-slate-200 text-slate-600'
                                                }`}
                                        >
                                            <div className="flex items-center">
                                                <div className={`p-3 rounded-xl mr-4 transition-all ${formData.role === item.name ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : isLocked ? 'bg-slate-200 text-slate-400' : 'bg-slate-100'}`}>
                                                    <item.icon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-base flex items-center">
                                                        {item.name}
                                                        {isLocked && <Lock className="w-3.5 h-3.5 ml-2 text-amber-500" />}
                                                    </div>
                                                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">{item.desc}</div>
                                                </div>
                                            </div>
                                            {formData.role === item.name && (
                                                <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                                            )}
                                            {isLocked && (
                                                <span className="text-[9px] font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Full Access</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {step === 2 && (
                            <div className="grid grid-cols-2 gap-4">
                                {['No experience', '0-1 years', '1-2 years', '2+ years'].map((exp) => (
                                    <button
                                        key={exp}
                                        onClick={() => setFormData({ ...formData, experience: exp })}
                                        className={`p-8 text-center rounded-2xl border-2 transition-all flex flex-col items-center ${formData.experience === exp
                                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900'
                                            : 'border-slate-100 hover:border-slate-200 text-slate-500'
                                            }`}
                                    >
                                        <div className={`p-3 rounded-full mb-3 ${formData.experience === exp ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                            <User className="w-6 h-6" />
                                        </div>
                                        <span className="font-bold text-xs uppercase tracking-wider">{exp}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-4">
                                {SCENARIOS.filter(s => s.role === formData.role).map((s) => {
                                    const isLocked = !canAccessScenario(formData.role, s.id);
                                    return (
                                        <button
                                            key={s.id}
                                            onClick={() => {
                                                if (isLocked) {
                                                    setShowUpgradePrompt(true);
                                                    return;
                                                }
                                                setFormData({ ...formData, scenario: s.id });
                                            }}
                                            className={`w-full p-6 text-left rounded-2xl border-2 transition-all relative overflow-hidden group ${formData.scenario === s.id
                                                ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900'
                                                : isLocked
                                                    ? 'border-slate-100 bg-slate-50/50 text-slate-400 cursor-not-allowed'
                                                    : 'border-slate-100 hover:border-slate-200 text-slate-600'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-1.5 relative z-10">
                                                <div className="flex items-center">
                                                    <div className="mr-3">
                                                        {s.id === 'Angry Customer' && <ShieldAlert className="w-5 h-5 text-red-500" />}
                                                        {s.id === 'General' && <Sparkles className="w-5 h-5 text-indigo-500" />}
                                                        {s.id === 'Tech Troubleshooting' && <Wrench className="w-5 h-5 text-indigo-500" />}
                                                        {s.id === 'Escalation' && <Gavel className="w-5 h-5 text-indigo-500" />}
                                                        {s.id === 'Cold Calling' && <Rocket className="w-5 h-5 text-indigo-500" />}
                                                        {s.id === 'Sales Objection' && <ShieldAlert className="w-5 h-5 text-orange-500" />}
                                                        {s.id === 'Closing' && <Sparkles className="w-5 h-5 text-amber-500" />}
                                                        {s.id === 'Complex Explanation' && <Globe className="w-5 h-5 text-indigo-500" />}
                                                    </div>
                                                    <span className="font-bold text-base flex items-center">
                                                        {s.name}
                                                        {isLocked && <Lock className="w-3.5 h-3.5 ml-2 text-amber-500" />}
                                                    </span>
                                                </div>
                                                {isLocked && (
                                                    <span className="text-[9px] font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Full Access</span>
                                                )}
                                            </div>
                                            <p className="text-[11px] text-slate-500 ml-8 relative z-10 leading-relaxed font-medium">{s.description}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        <button
                            onClick={handleNext}
                            className="group w-full mt-12 py-5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
                        >
                            <span className="relative z-10 flex items-center">
                                {step === 3 ? 'Start Interview' : 'Next Step'}
                                <ChevronRight className="ml-2 w-5 h-5" />
                            </span>
                        </button>

                        {/* Tier Info */}
                        <div className="mt-6 text-center">
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${tier.type === 'full' ? 'text-green-600' : 'text-slate-400'}`}>
                                {tier.type === 'full' ? `Full Access • ${tier.interviewsRemaining} interviews left` : `Free Tier • ${tier.interviewsRemaining} interview left`}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upgrade Prompt Modal */}
            {showUpgradePrompt && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-6">
                    <div className="max-w-lg w-full bg-white rounded-[3rem] shadow-2xl p-12 relative overflow-hidden animate-fade-in border border-slate-100">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-500/20">
                                <Crown size={32} />
                            </div>
                            <h2 className="text-3xl font-black tracking-tight mb-3">Unlock Full Access</h2>
                            <p className="text-slate-500 font-medium mb-10">Get the complete interview preparation experience.</p>

                            <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left space-y-4">
                                <div className="flex items-center text-sm font-bold text-slate-700">
                                    <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3 text-xs">✓</div>
                                    5 Practice Interviews
                                </div>
                                <div className="flex items-center text-sm font-bold text-slate-700">
                                    <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3 text-xs">✓</div>
                                    All Roles & Scenarios
                                </div>
                                <div className="flex items-center text-sm font-bold text-slate-700">
                                    <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3 text-xs">✓</div>
                                    Detailed Feedback Report
                                </div>
                                <div className="flex items-center text-sm font-bold text-slate-700">
                                    <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3 text-xs">✓</div>
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
                                        // For now, simulate upgrade
                                        alert('Payment integration coming soon! For demo, access is granted.');
                                        // upgradeToPaid() would be called after successful payment
                                    }}
                                    className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
                                >
                                    Get Full Access
                                </button>
                                <button
                                    onClick={() => setShowUpgradePrompt(false)}
                                    className="w-full py-3 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600 transition-colors"
                                >
                                    Continue with Free Tier
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OnboardingPage;
