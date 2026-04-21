import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Shield, Briefcase, PlayCircle } from 'lucide-react';
import Logo from '../components/Logo';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Header */}
            <header className="container mx-auto px-6 py-8 flex justify-between items-center bg-transparent relative z-20">
                <Logo />
                <div className="hidden md:flex space-x-10 text-s font-semibold text-slate-600">
                    <a href="#" className="hover:text-indigo-600 transition-colors">How it works</a>
                    <a href="#" className="hover:text-indigo-600 transition-colors">Success Stories</a>
                    <a href="#" className="hover:text-indigo-600 transition-colors">Pricing</a>
                </div>
                <button
                    onClick={() => navigate('/onboarding')}
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-full text-sm font-bold hover:bg-indigo-700 transition-all shadow-md"
                >
                    Get Started
                </button>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-6 pt-20 pb-20 flex flex-col lg:flex-row items-center gap-16">
                <div className="w-full lg:w-1/2">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-l font-bold mb-8">
                        <CheckCircle className="w-4 h-4" />
                        <span>Professional Contact Centre Prep</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tight text-slate-900 mb-8">
                        Build the <span className="text-indigo-600">Confidence</span> to Land Your Dream Job.
                    </h1>

                    <p className="text-lg text-slate-600 max-w-lg mb-12 leading-relaxed font-medium">
                        Practice realistic inbound and outbound interview scenarios. Get instant feedback on your communication, tone, and logic to master the phones.
                    </p>

                    <div className="flex flex-wrap gap-5">
                        <button
                            onClick={() => navigate('/onboarding')}
                            className="px-10 py-5 bg-indigo-600 text-white font-bold rounded-2xl flex items-center transition-all hover:bg-indigo-700 shadow-xl shadow-indigo-500/20"
                        >
                            Start Practice Session
                            <ArrowRight className="ml-3 h-5 w-5" />
                        </button>

                        <button className="px-10 py-5 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl flex items-center hover:bg-slate-50 transition-all">
                            <PlayCircle className="mr-3 h-5 w-5 text-indigo-600" />
                            Watch How it Works
                        </button>
                    </div>

                    <div className="mt-16 flex items-center space-x-12 opacity-70">
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold text-slate-900 leading-none">10k+</span>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-2">Hires Facilitated</span>
                        </div>
                        <div className="h-10 w-[1px] bg-slate-300"></div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold text-slate-900 leading-none">94%</span>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-2">Candidate Success</span>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-1/2">
                    <div className="relative p-8 bg-white rounded-[40px] shadow-2xl border border-slate-100 flex flex-col gap-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex space-x-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                            </div>

                        </div>

                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                    <Logo collapsed />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-900">VICKY</div>
                                    <div className="text-[10px] text-slate-500">Active Session</div>
                                </div>
                            </div>
                            <p className="text-sm font-medium text-slate-700 italic">
                                "A customer is calling in extremely frustrated because their service was cut off. How do you start the conversation?"
                            </p>
                        </div>

                        <div className="flex items-center space-x-2 px-4 py-3 bg-white border border-slate-100 rounded-full shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                            <div className="flex-1 overflow-hidden">
                                <div className="flex items-end space-x-1 h-3">
                                    {[2, 4, 3, 5, 2, 4, 6, 2, 3].map((h, i) => (
                                        <div key={i} className="flex-1 bg-indigo-200 rounded-full" style={{ height: `${h * 15}%` }}></div>
                                    ))}
                                </div>
                            </div>
                            <div className="text-[10px] font-bold text-slate-400">REC: 0:14</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <div className="p-4 bg-white border border-slate-100 rounded-2xl text-center shadow-sm">
                                <div className="text-[9px] text-slate-400 font-bold uppercase mb-1">Stability</div>
                                <div className="text-lg font-bold text-slate-900">High</div>
                            </div>
                            <div className="p-4 bg-white border border-slate-100 rounded-2xl text-center shadow-sm">
                                <div className="text-[9px] text-slate-400 font-bold uppercase mb-1">Tone Analysis</div>
                                <div className="text-lg font-bold text-slate-900">Empathetic</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Bar */}
            <div className="bg-white border-y border-slate-200 py-16">
                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                        { title: "Inbound Support", icon: CheckCircle, text: "Master technical helpdesk and general query resolution." },
                        { title: "Sales & Negotiation", icon: Briefcase, text: "Learn to handle objections and close deals with confidence." },
                        { title: "High-Stress Scenarios", icon: Shield, text: "Practice supervisor de-escalation for the toughest calls." }
                    ].map((feature, i) => (
                        <div key={i} className="flex items-start">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl mr-5">
                                <feature.icon size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold mb-2 text-slate-900">{feature.title}</h3>
                                <p className="text-sm text-slate-600 font-medium leading-relaxed">{feature.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pricing Section */}
            <section id="pricing" className="container mx-auto px-6 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-lg text-slate-600 font-medium">Start for free, upgrade when you're ready.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Free Tier */}
                    <div className="bg-white rounded-[2rem] border border-slate-200 p-10 shadow-sm">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Free Tier</div>
                        <div className="text-4xl font-black text-slate-900 mb-6">R0</div>
                        <ul className="space-y-4 mb-10">
                            <li className="flex items-center text-sm font-medium text-slate-600">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                                1 Practice Interview
                            </li>
                            <li className="flex items-center text-sm font-medium text-slate-600">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                                Inbound Customer Support Role
                            </li>
                            <li className="flex items-center text-sm font-medium text-slate-600">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                                Standard Scenario
                            </li>
                            <li className="flex items-center text-sm font-medium text-slate-400 line-through">
                                <Shield className="w-5 h-5 text-slate-300 mr-3" />
                                Feedback & Report Card
                            </li>
                        </ul>
                        <button
                            onClick={() => navigate('/onboarding')}
                            className="w-full py-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all"
                        >
                            Get Started Free
                        </button>
                    </div>

                    {/* Full Access */}
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] p-10 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
                        <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 rounded-full text-[9px] font-bold uppercase tracking-widest">Popular</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 mb-3">Full Access</div>
                        <div className="text-4xl font-black mb-1">R59</div>
                        <div className="text-sm text-indigo-200 font-medium mb-6">once-off payment</div>
                        <ul className="space-y-4 mb-10">
                            <li className="flex items-center text-sm font-bold">
                                <CheckCircle className="w-5 h-5 text-green-300 mr-3" />
                                5 Practice Interviews
                            </li>
                            <li className="flex items-center text-sm font-bold">
                                <CheckCircle className="w-5 h-5 text-green-300 mr-3" />
                                All Roles & Scenarios
                            </li>
                            <li className="flex items-center text-sm font-bold">
                                <CheckCircle className="w-5 h-5 text-green-300 mr-3" />
                                Detailed Feedback Report
                            </li>
                            <li className="flex items-center text-sm font-bold">
                                <CheckCircle className="w-5 h-5 text-green-300 mr-3" />
                                Downloadable Report Card
                            </li>
                        </ul>
                        <button
                            onClick={() => navigate('/onboarding')}
                            className="w-full py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-all shadow-lg"
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
