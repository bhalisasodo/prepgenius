import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Shield, Briefcase, PlayCircle } from 'lucide-react';
import Logo from '../components/Logo';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-dark-bg text-white font-sans">
            {/* Header */}
            <header className="container mx-auto px-6 py-6 flex justify-between items-center relative z-20 border-b border-dark-border">
                <Logo />
                <div className="hidden md:flex space-x-10 text-sm font-semibold text-gray-secondary">
                    <a href="#" className="hover:text-cyan-accent transition-colors">How it works</a>
                    <a href="#" className="hover:text-cyan-accent transition-colors">Success Stories</a>
                    <a href="#" className="hover:text-cyan-accent transition-colors">Pricing</a>
                </div>
                <button
                    onClick={() => navigate('/onboarding')}
                    className="px-6 py-2.5 bg-cyan-accent text-black rounded-full text-sm font-bold hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-accent/30"
                >
                    Get Started
                </button>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-6 pt-16 pb-20 flex flex-col lg:flex-row items-center gap-16">
                <div className="w-full lg:w-1/2">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-cyan-accent/10 border border-cyan-accent/30 text-cyan-accent text-sm font-bold mb-8">
                        <CheckCircle className="w-4 h-4" />
                        <span>AI-Powered Interview Prep</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight text-white mb-8">
                        Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-accent to-purple-accent">Interview Skills</span>
                    </h1>

                    <p className="text-lg text-gray-secondary max-w-lg mb-12 leading-relaxed font-medium">
                        Practice realistic contact center scenarios with VICKY AI. Get instant, actionable feedback on communication, tone, and strategy.
                    </p>

                    <div className="flex flex-wrap gap-5">
                        <button
                            onClick={() => navigate('/onboarding')}
                            className="px-8 py-4 bg-gradient-to-r from-cyan-accent to-purple-accent text-black font-bold rounded-xl flex items-center transition-all hover:shadow-lg hover:shadow-cyan-accent/50 shadow-xl"
                        >
                            Start Practice Now
                            <ArrowRight className="ml-3 h-5 w-5" />
                        </button>

                        <button className="px-8 py-4 bg-dark-surface border-2 border-dark-border text-white font-bold rounded-xl flex items-center hover:border-cyan-accent/50 transition-all">
                            <PlayCircle className="mr-3 h-5 w-5 text-cyan-accent" />
                            Watch Demo
                        </button>
                    </div>

                    <div className="mt-16 flex items-center space-x-12">
                        <div className="flex flex-col">
                            <span className="text-3xl font-black text-white leading-none">10k+</span>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-tertiary mt-2">Hires Facilitated</span>
                        </div>
                        <div className="h-10 w-[1px] bg-dark-border"></div>
                        <div className="flex flex-col">
                            <span className="text-3xl font-black text-white leading-none">94%</span>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-tertiary mt-2">Candidate Success</span>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-1/2">
                    <div className="relative p-8 bg-dark-surface rounded-3xl shadow-2xl border border-dark-border/50 flex flex-col gap-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex space-x-1.5">
                                <div className="w-3 h-3 rounded-full bg-dark-border"></div>
                                <div className="w-3 h-3 rounded-full bg-dark-border"></div>
                                <div className="w-3 h-3 rounded-full bg-dark-border"></div>
                            </div>
                        </div>

                        <div className="p-6 bg-dark-bg rounded-2xl border border-dark-border/30 space-y-4">
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-cyan-accent/20 border border-cyan-accent/40 flex items-center justify-center">
                                    <Logo collapsed />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white">VICKY</div>
                                    <div className="text-[10px] text-gray-tertiary">Live Session</div>
                                </div>
                            </div>
                            <p className="text-sm font-medium text-gray-secondary leading-relaxed">
                                "A customer is calling in extremely frustrated. How do you start this conversation?"
                            </p>
                        </div>

                        <div className="flex items-center space-x-2 px-4 py-3 bg-dark-surface/50 border border-dark-border/30 rounded-full">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                            <div className="flex-1 overflow-hidden">
                                <div className="flex items-end space-x-1 h-3">
                                    {[2, 4, 3, 5, 2, 4, 6, 2, 3].map((h, i) => (
                                        <div key={i} className="flex-1 bg-cyan-accent/40 rounded-full" style={{ height: `${h * 15}%` }}></div>
                                    ))}
                                </div>
                            </div>
                            <div className="text-[10px] font-bold text-gray-tertiary">0:14</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <div className="p-4 bg-dark-bg border border-dark-border/30 rounded-xl text-center">
                                <div className="text-[9px] text-gray-tertiary font-bold uppercase mb-1">Tone</div>
                                <div className="text-sm font-bold text-cyan-accent">Professional</div>
                            </div>
                            <div className="p-4 bg-dark-bg border border-dark-border/30 rounded-xl text-center">
                                <div className="text-[9px] text-gray-tertiary font-bold uppercase mb-1">Pace</div>
                                <div className="text-sm font-bold text-cyan-accent">Engaging</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Bar */}
            <div className="bg-dark-surface/40 border-y border-dark-border py-16">
                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                        { title: "Inbound Support", icon: CheckCircle, text: "Master technical helpdesk and general query resolution." },
                        { title: "Sales & Negotiation", icon: Briefcase, text: "Learn to handle objections and close deals with confidence." },
                        { title: "High-Stress Scenarios", icon: Shield, text: "Practice supervisor de-escalation for the toughest calls." }
                    ].map((feature, i) => (
                        <div key={i} className="flex items-start p-6 rounded-2xl bg-dark-surface/30 border border-dark-border/30 hover:border-cyan-accent/30 transition-colors">
                            <div className="p-3 bg-cyan-accent/10 text-cyan-accent rounded-xl mr-5 flex-shrink-0">
                                <feature.icon size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold mb-2 text-white">{feature.title}</h3>
                                <p className="text-sm text-gray-secondary font-medium leading-relaxed">{feature.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pricing Section */}
            <section id="pricing" className="container mx-auto px-6 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black tracking-tight text-white mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-lg text-gray-secondary font-medium">Start for free, upgrade when you're ready.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Free Tier */}
                    <div className="bg-dark-surface rounded-2xl border border-dark-border p-10">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-tertiary mb-3">Free Tier</div>
                        <div className="text-4xl font-black text-white mb-6">R0</div>
                        <ul className="space-y-4 mb-10">
                            <li className="flex items-center text-sm font-medium text-gray-secondary">
                                <CheckCircle className="w-5 h-5 text-emerald-success mr-3" />
                                1 Practice Interview
                            </li>
                            <li className="flex items-center text-sm font-medium text-gray-secondary">
                                <CheckCircle className="w-5 h-5 text-emerald-success mr-3" />
                                Inbound Support Role
                            </li>
                            <li className="flex items-center text-sm font-medium text-gray-secondary">
                                <CheckCircle className="w-5 h-5 text-emerald-success mr-3" />
                                Standard Scenario
                            </li>
                            <li className="flex items-center text-sm font-medium text-gray-tertiary line-through">
                                Feedback & Report Card
                            </li>
                        </ul>
                        <button
                            onClick={() => navigate('/onboarding')}
                            className="w-full py-3 bg-dark-border text-white font-bold rounded-xl hover:bg-dark-border/80 transition-all"
                        >
                            Get Started Free
                        </button>
                    </div>

                    {/* Full Access */}
                    <div className="bg-gradient-to-br from-cyan-accent/20 to-purple-accent/20 border-2 border-cyan-accent/50 rounded-2xl p-10 relative overflow-hidden">
                        <div className="absolute top-4 right-4 px-3 py-1 bg-cyan-accent/20 rounded-full text-[9px] font-bold uppercase tracking-widest text-cyan-accent">Popular</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-cyan-accent mb-3">Full Access</div>
                        <div className="text-4xl font-black text-white mb-1">R59</div>
                        <div className="text-sm text-gray-secondary font-medium mb-6">once-off payment</div>
                        <ul className="space-y-4 mb-10">
                            <li className="flex items-center text-sm font-bold text-white">
                                <CheckCircle className="w-5 h-5 text-emerald-success mr-3" />
                                5 Practice Interviews
                            </li>
                            <li className="flex items-center text-sm font-bold text-white">
                                <CheckCircle className="w-5 h-5 text-emerald-success mr-3" />
                                All Roles & Scenarios
                            </li>
                            <li className="flex items-center text-sm font-bold text-white">
                                <CheckCircle className="w-5 h-5 text-emerald-success mr-3" />
                                Detailed Feedback Report
                            </li>
                            <li className="flex items-center text-sm font-bold text-white">
                                <CheckCircle className="w-5 h-5 text-emerald-success mr-3" />
                                Downloadable Report Card
                            </li>
                        </ul>
                        <button
                            onClick={() => navigate('/onboarding')}
                            className="w-full py-3 bg-gradient-to-r from-cyan-accent to-purple-accent text-black font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-accent/30 transition-all"
                        >
                            Get Full Access
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
