import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Mic, MicOff, PhoneOff, ShieldCheck, Volume2 } from 'lucide-react';
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
        // The hook might return isSpeaking state if we exposed it, 
        // but for now we'll approximate or check if the library provides it.
        // Actually, @11labs/react useConversation returns { isSpeaking }
        // Let's assume our hook wrapper spreads it.
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
        // Filter user responses for analysis
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

    useEffect(() => {
        // Auto-start
        startInterview();
        // Cleanup
        return () => {
            conversation.endSession();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div className="flex flex-col h-screen bg-[#050505] text-white overflow-hidden font-sans">
            {/* Minimalist Top Bar */}
            <header className="px-6 py-3 flex justify-between items-center bg-black/50 backdrop-blur-xl border-b border-white/5 shrink-0 z-50">
                <div className="flex items-center space-x-4">
                    <button onClick={() => navigate('/onboarding')} className="text-white/30 hover:text-white transition-all p-2 hover:bg-white/5 rounded-lg">
                        <ArrowLeft size={18} />
                    </button>
                    <div className="h-4 w-[1px] bg-white/10 mx-2"></div>
                    <div className="flex items-center space-x-3">
                        <Logo collapsed className="scale-75 brightness-150" />
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] hidden md:block">
                            {isConnected ? 'Session Live' : 'Connecting...'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5 cursor-help">
                        <ShieldCheck size={12} className="text-indigo-400" />
                        <span className="text-[9px] font-black text-white/50 tracking-widest uppercase">{scenarioId}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                        <span className="text-[10px] font-mono text-white/40">{formatDuration(duration)}</span>
                    </div>
                </div>
            </header>

            {/* Main Video-Stage Grid */}
            <main className="flex-1 relative flex items-center justify-center bg-[#000] p-4">
                <div className="w-full h-full max-w-5xl mx-auto flex flex-col gap-4 relative">

                    {/* Primary Interviewer Feed */}
                    <div className="flex-1 relative bg-[#111] rounded-2xl border border-white/5 overflow-hidden shadow-2xl flex flex-col items-center justify-center transition-all">

                        <AudioVisualizer isSpeaking={isSpeaking} scale="lg" />

                        {/* Live Captions */}
                        <div className="absolute bottom-10 left-0 right-0 px-8 flex justify-center z-20 pointer-events-none">
                            <div className="max-w-2xl w-full px-6 py-4 bg-black/40 backdrop-blur-lg rounded-2xl border border-white/5 text-center transition-all shadow-2xl min-h-[80px] flex items-center justify-center">
                                <p className="text-lg md:text-xl font-medium text-white/90 leading-snug tracking-tight">
                                    {messages.length > 0 ? messages[messages.length - 1].content : (isConnected ? "Listening..." : "Initializing connection...")}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Control Bar (integrated into bottom) */}
                    <div className="h-24 bg-[#0a0a0a] rounded-2xl border border-white/5 flex items-center justify-between px-8">
                        <div className="flex items-center space-x-4">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Status</span>
                                <span className={`text-xs font-bold ${isConnected ? 'text-green-400' : 'text-yellow-400'}`}>
                                    {isConnected ? 'LIVE CONNECTION' : 'CONNECTING'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => {/* Toggle Mute logic if library supports it check docs later, visual only for now */ setIsMicMuted(!isMicMuted) }}
                                className={`p-4 rounded-full border transition-all ${isMicMuted ? 'bg-red-500 text-white border-red-400' : 'bg-white/5 text-white border-white/10 hover:bg-white/10'}`}
                            >
                                {isMicMuted ? <MicOff size={20} /> : <Mic size={20} />}
                            </button>
                            <div className="h-8 w-[1px] bg-white/10 mx-2"></div>
                            <button
                                onClick={endInterview}
                                className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-widest border border-red-500/50 transition-all shadow-lg hover:shadow-red-900/20 flex items-center space-x-2"
                            >
                                <PhoneOff size={16} />
                                <span>End Interview</span>
                            </button>
                        </div>

                        <div className="flex items-center space-x-4 w-[120px] justify-end">
                            <div className="w-full bg-white/10 rounded-full h-1">
                                <div className="bg-indigo-500 h-1 rounded-full" style={{ width: '60%' }}></div>
                            </div>
                            <Volume2 size={16} className="text-white/40" />
                        </div>
                    </div>
                </div>

                {/* Grid Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(to_right,#888_1px,transparent_1px),linear-gradient(to_bottom,#888_1px,transparent_1px)] bg-[size:64px_64px]"></div>
            </main>
        </div>
    );
};

export default InterviewPage;
