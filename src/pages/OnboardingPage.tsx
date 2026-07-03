import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ChevronRight, ArrowLeft, ShieldAlert, Sparkles, Wrench, Gavel, Cpu, Globe, Rocket, Lock, Crown } from 'lucide-react';
import { SCENARIOS, type ScenarioType } from '../services/aiService';
import { useUser } from '../contexts/UserContext';
import Logo from '../components/Logo';

const OnboardingPage = () => {
    const navigate = useNavigate();
    const { tier, profile, updateProfile, useInterview } = useUser();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        role: profile.role,
        experience: profile.experience,
        scenario: profile.scenario as ScenarioType
    });
    const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            // Check if user has interviews remaining
            // TODO: Re-enable paywall after testing
            /*if (tier.interviewsRemaining <= 0) {
                setShowUpgradePrompt(true);
                return;
            }*/
            // Check if user can access selected scenario
            // TODO: Re-enable tier restrictions after testing
            /*if (!canAccessScenario(formData.role, formData.scenario)) {
                setShowUpgradePrompt(true);
                return;
            }*/
            updateProfile({
                role: formData.role,
                experience: formData.experience,
                scenario: formData.scenario
            });
            // Use one interview credit
            useInterview();
            navigate('/interview', { state: formData });
        }
    };

    return (
        <div className="min-h-screen bg-dark-bg flex flex-col p-6 text-white font-sans">
            <div className="container mx-auto py-8">
                <Logo />
            </div>

            <div className="flex-1 flex items-center justify-center -mt-10">
                <div className="max-w-xl w-full bg-dark-surface rounded-2xl border border-dark-border shadow-2xl overflow-hidden animate-fade-in">
                    {/* Progress Bar */}
                    <div className="w-full flex space-x-0">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`h-1 flex-1 transition-all duration-500 ${i <= step ? 'bg-gradient-to-r from-cyan-accent to-purple-accent' : 'bg-dark-border'}`}
                            />
                        ))}
                    </div>

                    <div className="p-10 md:p-14">
                        <button
                            onClick={() => step > 1 ? setStep(step - 1) : navigate('/')}
                            className="mb-10 text-gray-tertiary hover:text-cyan-accent flex items-center transition-colors text-xs font-bold uppercase tracking-wider"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back
                        </button>

                        <div className="mb-12">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-accent mb-2 block">
                                Step {step} of 3
                            </span>
                            <h2 className="text-3xl font-bold text-white leading-tight">
                                {step === 1 && "What role are you targeting?"}
                                {step === 2 && "Your experience level?"}
                                {step === 3 && "Select your interview focus."}
                            </h2>
                            <p className="text-sm text-gray-secondary mt-2 font-medium">
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
                                    const isLocked = false;
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
                                            className={`group w-full p-6 text-left rounded-xl border-2 transition-all flex items-center justify-between ${formData.role === item.name
                                                ? 'border-cyan-accent/60 bg-cyan-accent/10 text-white shadow-lg shadow-cyan-accent/20'
                                                : isLocked
                                                    ? 'border-dark-border bg-dark-bg/50 text-gray-tertiary cursor-not-allowed'
                                                    : 'border-dark-border hover:border-cyan-accent/30 text-gray-secondary'
                                                }`}
                                        >
                                            <div className="flex items-center">
                                                <div className={`p-3 rounded-lg mr-4 transition-all ${formData.role === item.name ? 'bg-cyan-accent/20 text-cyan-accent shadow-lg shadow-cyan-accent/20' : isLocked ? 'bg-dark-border text-gray-tertiary' : 'bg-dark-border/50'}`}>
                                                    <item.icon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-base flex items-center">
                                                        {item.name}
                                                        {isLocked && <Lock className="w-3.5 h-3.5 ml-2 text-amber-warning" />}
                                                    </div>
                                                    <div className="text-[10px] uppercase font-bold text-gray-tertiary tracking-wider mt-0.5">{item.desc}</div>
                                                </div>
                                            </div>
                                            {formData.role === item.name && (
                                                <div className="w-2 h-2 rounded-full bg-cyan-accent"></div>
                                            )}
                                            {isLocked && (
                                                <span className="text-[9px] font-bold uppercase tracking-widest text-amber-warning bg-amber-warning/10 px-2 py-1 rounded-full">Full Access</span>
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
                                        className={`p-8 text-center rounded-xl border-2 transition-all flex flex-col items-center ${formData.experience === exp
                                            ? 'border-cyan-accent/60 bg-cyan-accent/10 text-cyan-accent'
                                            : 'border-dark-border hover:border-cyan-accent/30 text-gray-secondary'
                                            }`}
                                    >
                                        <div className={`p-3 rounded-lg mb-3 ${formData.experience === exp ? 'bg-cyan-accent/20 text-cyan-accent' : 'bg-dark-border text-gray-tertiary'}`}>
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
                                    const isLocked = false;
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
                                            className={`w-full p-6 text-left rounded-xl border-2 transition-all relative overflow-hidden group ${formData.scenario === s.id
                                                ? 'border-cyan-accent/60 bg-cyan-accent/10 text-white'
                                                : isLocked
                                                    ? 'border-dark-border bg-dark-bg/50 text-gray-tertiary cursor-not-allowed'
                                                    : 'border-dark-border hover:border-cyan-accent/30 text-gray-secondary'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-1.5 relative z-10">
                                                <div className="flex items-center">
                                                    <div className="mr-3">
                                                        {s.id === 'Angry Customer' && <ShieldAlert className="w-5 h-5 text-red-500" />}
                                                        {s.id === 'General' && <Sparkles className="w-5 h-5 text-cyan-accent" />}
                                                        {s.id === 'Tech Troubleshooting' && <Wrench className="w-5 h-5 text-cyan-accent" />}
                                                        {s.id === 'Escalation' && <Gavel className="w-5 h-5 text-cyan-accent" />}
                                                        {s.id === 'Cold Calling' && <Rocket className="w-5 h-5 text-cyan-accent" />}
                                                        {s.id === 'Sales Objection' && <ShieldAlert className="w-5 h-5 text-orange-500" />}
                                                        {s.id === 'Closing' && <Sparkles className="w-5 h-5 text-amber-warning" />}
                                                        {s.id === 'Complex Explanation' && <Globe className="w-5 h-5 text-cyan-accent" />}
                                                    </div>
                                                    <span className="font-bold text-base flex items-center">
                                                        {s.name}
                                                        {isLocked && <Lock className="w-3.5 h-3.5 ml-2 text-amber-warning" />}
                                                    </span>
                                                </div>
                                                {isLocked && (
                                                    <span className="text-[9px] font-bold uppercase tracking-widest text-amber-warning bg-amber-warning/10 px-2 py-1 rounded-full">Full Access</span>
                                                )}
                                            </div>
                                            <p className="text-[11px] text-gray-tertiary ml-8 relative z-10 leading-relaxed font-medium">{s.description}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        <button
                            onClick={handleNext}
                            className="group w-full mt-12 py-4 bg-gradient-to-r from-cyan-accent to-purple-accent text-black font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-accent/30 transition-all flex items-center justify-center active:scale-[0.98]"
                        >
                            <span className="relative z-10 flex items-center">
                                {step === 3 ? 'Start Interview' : 'Next Step'}
                                <ChevronRight className="ml-2 w-5 h-5" />
                            </span>
                        </button>

                        {/* Tier Info */}
                        <div className="mt-6 text-center">
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${tier.type === 'full' ? 'text-emerald-success' : 'text-gray-tertiary'}`}>
                                {tier.type === 'full' ? `Full Access • ${tier.interviewsRemaining} interviews left` : `Free Tier • ${tier.interviewsRemaining} interview left`}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upgrade Prompt Modal */}
            {showUpgradePrompt && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                    <div className="max-w-lg w-full bg-dark-surface rounded-2xl shadow-2xl p-12 relative overflow-hidden animate-fade-in border border-dark-border">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-cyan-accent to-purple-accent text-black rounded-xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-cyan-accent/30">
                                <Crown size={32} />
                            </div>
                            <h2 className="text-3xl font-black tracking-tight text-white mb-3">Unlock Full Access</h2>
                            <p className="text-gray-secondary font-medium mb-10">Get the complete interview preparation experience.</p>

                            <div className="bg-dark-bg rounded-xl p-6 mb-8 text-left space-y-4">
                                <div className="flex items-center text-sm font-bold text-white">
                                    <div className="w-5 h-5 bg-emerald-success/20 text-emerald-success rounded-full flex items-center justify-center mr-3 text-xs">✓</div>
                                    5 Practice Interviews
                                </div>
                                <div className="flex items-center text-sm font-bold text-white">
                                    <div className="w-5 h-5 bg-emerald-success/20 text-emerald-success rounded-full flex items-center justify-center mr-3 text-xs">✓</div>
                                    All Roles & Scenarios
                                </div>
                                <div className="flex items-center text-sm font-bold text-white">
                                    <div className="w-5 h-5 bg-emerald-success/20 text-emerald-success rounded-full flex items-center justify-center mr-3 text-xs">✓</div>
                                    Detailed Feedback Report
                                </div>
                                <div className="flex items-center text-sm font-bold text-white">
                                    <div className="w-5 h-5 bg-emerald-success/20 text-emerald-success rounded-full flex items-center justify-center mr-3 text-xs">✓</div>
                                    Downloadable Report Card
                                </div>
                            </div>

                            <div className="flex items-center justify-center mb-8">
                                <span className="text-4xl font-black text-cyan-accent">R59</span>
                                <span className="text-gray-secondary font-bold ml-2">once-off</span>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={() => {
                                        alert('Payment integration coming soon! For demo, access is granted.');
                                    }}
                                    className="w-full py-3 bg-gradient-to-r from-cyan-accent to-purple-accent text-black font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-accent/30 transition-all"
                                >
                                    Get Full Access
                                </button>
                                <button
                                    onClick={() => setShowUpgradePrompt(false)}
                                    className="w-full py-3 text-gray-secondary font-bold text-xs uppercase tracking-widest hover:text-cyan-accent transition-colors"
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
