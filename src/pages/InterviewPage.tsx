import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Mic, MicOff, PhoneOff, Volume2 } from 'lucide-react';
import { type ScenarioType } from '../services/aiService';
import Logo from '../components/Logo';
import { useElevenLabsConversation } from '../hooks/useElevenLabsConversation';
import AudioVisualizer from '../components/AudioVisualizer';
import { ELEVENLABS_CONFIG } from '../config/elevenLabsConfig';

interface Message {
    role: 'ai' | 'user';
    content: string;
    type?: 'text' | 'voice';
}

const InterviewPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const scenarioId = (location.state?.scenario as ScenarioType) || 'General';

    const [messages, setMessages] = useState<Message[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [duration, setDuration] = useState(0);
    const [isMicMuted, setIsMicMuted] = useState(false);

    // Timer logic
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isConnected) {
            interval = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isConnected]);

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // ElevenLabs Integration
    const conversation = useElevenLabsConversation(
        // onMessage
        useCallback((message: { source: string; message: string }) => {
            setMessages(prev => [...prev, {
                role: message.source === 'user' ? 'user' : 'ai',
                content: message.message,
                type: 'voice'
            }]);
        }, []),
        // onError
        useCallback((error: string) => {
            console.error("Conversation error:", error);
            alert("Connection error: " + error);
        }, []),
        // onConnect
        useCallback(() => {
            setIsConnected(true);
            setIsSpeaking(true); // Usually starts with a greeting
        }, []),
        // onDisconnect
        useCallback(() => {
            setIsConnected(false);
            setIsSpeaking(false);
        }, [])
    );

    // Sync speaking state
    useEffect(() => {
        if ((conversation as any).isSpeaking !== undefined) {
            setIsSpeaking((conversation as any).isSpeaking);
        }
    }, [(conversation as any).isSpeaking]);

    const startInterview = async () => {
        try {
            await conversation.startSession(ELEVENLABS_CONFIG.agentId);
        } catch (err) {
            console.error("Failed to start:", err);
        }
    };

    const endInterview = async () => {
        await conversation.endSession();

        // Process feedback
        const userResponses = messages
            .filter(m => m.role === 'user')
            .map(m => m.content);

        navigate('/feedback', {
            state: {
                responses: userResponses.length > 0 ? userResponses : ["No audio recorded"],
                scenarioId,
                isVoice: true
            }
        });
    };

    // Stop conversation when navigating away from the page
    useEffect(() => {
        return () => {
            conversation.endSession();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    useEffect(() => {
        // Auto-start
        startInterview();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col h-screen bg-dark-bg text-white overflow-hidden font-sans">
            {/* Premium Top Bar */}
            <header className="px-6 py-4 flex justify-between items-center bg-dark-surface/60 backdrop-blur-xl border-b border-dark-border shrink-0 z-50">
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={() => navigate('/onboarding')} 
                        className="text-gray-tertiary hover:text-white transition-all p-2 hover:bg-white/5 rounded-lg"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div className="h-5 w-[1px] bg-dark-border"></div>
                    <Logo collapsed className="scale-90" />
                </div>

                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-3 px-4 py-2 bg-dark-surface rounded-lg border border-dark-border">
                        <span className="text-[10px] font-black text-gray-tertiary uppercase tracking-widest">{scenarioId}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full transition-colors ${isConnected ? 'bg-emerald-success animate-pulse' : 'bg-amber-warning'}`}></div>
                        <span className="text-[11px] font-mono text-gray-secondary">{formatDuration(duration)}</span>
                    </div>
                    <span className="text-[10px] font-black text-gray-tertiary uppercase tracking-widest hidden md:block">
                        {isConnected ? 'Live' : 'Connecting...'}
                    </span>
                </div>
            </header>

            {/* Main Stage */}
            <main className="flex-1 relative flex items-center justify-center bg-gradient-to-b from-dark-bg to-dark-surface/30 p-6 overflow-hidden">
                <div className="w-full h-full max-w-4xl mx-auto flex flex-col gap-8 relative">

                    {/* Interviewer Visualizer Section */}
                    <div className="flex-1 relative rounded-3xl border border-dark-border/50 overflow-hidden shadow-2xl flex flex-col items-center justify-center bg-dark-surface/40 backdrop-blur-sm">
                        
                        {/* Top Status Bar */}
                        <div className="absolute top-0 left-0 right-0 h-16 px-6 flex items-center justify-center border-b border-dark-border/30 backdrop-blur-sm">
                            <p className="text-[11px] font-black text-gray-secondary uppercase tracking-widest">
                                {isConnected ? '● Interview in Progress' : '● Connecting...'}
                            </p>
                        </div>

                        {/* Visualizer */}
                        <div className="flex-1 flex items-center justify-center">
                            <AudioVisualizer isSpeaking={isSpeaking} scale="lg" />
                        </div>

                        {/* Live Captions */}
                        <div className="absolute bottom-8 left-0 right-0 px-8 flex justify-center z-20">
                            <div className="max-w-2xl w-full px-6 py-4 bg-dark-surface/90 backdrop-blur-lg rounded-2xl border border-cyan-accent/30 text-center transition-all shadow-2xl min-h-[80px] flex items-center justify-center">
                                <p className="text-base md:text-lg font-medium text-white leading-relaxed">
                                    {messages.length > 0 ? messages[messages.length - 1].content : (isConnected ? "Listening..." : "Initializing...")}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Control Bar */}
                    <div className="h-20 bg-dark-surface rounded-2xl border border-dark-border/50 flex items-center justify-between px-8 backdrop-blur-sm shadow-xl">
                        <div className="flex items-center space-x-3">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-gray-tertiary uppercase tracking-widest">Status</span>
                                <span className={`text-xs font-bold transition-colors ${isConnected ? 'text-emerald-success' : 'text-amber-warning'}`}>
                                    {isConnected ? 'LIVE' : 'CONNECTING'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Mic Toggle */}
                            <button
                                onClick={() => setIsMicMuted(!isMicMuted)}
                                className={`p-4 rounded-full border-2 transition-all duration-300 ${
                                    isMicMuted 
                                        ? 'bg-red-500/20 text-red-400 border-red-400/50' 
                                        : 'bg-cyan-accent/10 text-cyan-accent border-cyan-accent/40 hover:bg-cyan-accent/20'
                                }`}
                                title={isMicMuted ? "Unmute" : "Mute"}
                            >
                                {isMicMuted ? <MicOff size={20} /> : <Mic size={20} />}
                            </button>

                            <div className="h-8 w-[1px] bg-dark-border"></div>

                            {/* End Button */}
                            <button
                                onClick={endInterview}
                                className="px-6 py-3 bg-red-600/80 hover:bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-widest border border-red-500/50 transition-all duration-300 shadow-lg hover:shadow-red-900/30 flex items-center space-x-2"
                            >
                                <PhoneOff size={16} />
                                <span>End</span>
                            </button>
                        </div>

                        {/* Volume Indicator */}
                        <div className="flex items-center space-x-3 w-[140px] justify-end">
                            <div className="flex-1 bg-dark-border rounded-full h-1.5 overflow-hidden">
                                <div 
                                    className="bg-gradient-to-r from-cyan-accent to-purple-accent h-full rounded-full transition-all duration-300"
                                    style={{ width: isSpeaking ? '75%' : '25%' }}
                                ></div>
                            </div>
                            <Volume2 size={16} className="text-gray-secondary" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default InterviewPage;
