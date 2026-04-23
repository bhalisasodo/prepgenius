import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Play, RefreshCw } from 'lucide-react';

interface VoiceRecorderProps {
    onRecordingComplete: (blob: Blob, transcript: string) => void;
    isProcessing?: boolean;
    minimal?: boolean;
}

const VoiceRecorder = ({ onRecordingComplete, isProcessing, minimal = false }: VoiceRecorderProps) => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const [transcript, setTranscript] = useState('');

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recognitionRef = useRef<any>(null);
    const timerRef = useRef<number | null>(null);
    const silenceTimerRef = useRef<number | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const audioCtxRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            if (recognitionRef.current) recognitionRef.current.stop();
            if (audioCtxRef.current) audioCtxRef.current.close();
        };
    }, []);

    const playBeep = (type: 'start' | 'stop') => {
        try {
            if (!audioCtxRef.current) {
                audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            const ctx = audioCtxRef.current;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(type === 'start' ? 880 : 440, ctx.currentTime);
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } catch (e) {
            console.warn("Audio feedback failed:", e);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            playBeep('start');

            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];
            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
            };

            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;

                recognition.onresult = (event: any) => {
                    let fullTranscript = '';
                    for (let i = 0; i < event.results.length; i++) {
                        fullTranscript += event.results[i][0].transcript;
                    }
                    setTranscript(fullTranscript);
                    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
                    silenceTimerRef.current = window.setTimeout(() => {
                        // Silence detection timeout
                    }, 2500);
                };

                recognitionRef.current = recognition;
                recognition.start();
            }

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);
            setTranscript('');

            timerRef.current = window.setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            playBeep('stop');
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            if (recognitionRef.current) recognitionRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (minimal) {
        return (
            <div className="flex items-center space-x-6">
                {!audioBlob ? (
                    <div className="flex items-center space-x-6">
                        <div className="flex flex-col items-center">
                            <button
                                disabled={isProcessing}
                                onClick={isRecording ? stopRecording : startRecording}
                                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isRecording
                                    ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] animate-pulse'
                                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                                    }`}
                            >
                                {isRecording ? <Mic size={24} /> : <MicOff size={24} />}
                            </button>
                            <span className="text-[10px] font-bold mt-2 uppercase tracking-widest text-white/40">
                                {isRecording ? "Mute" : "Unmute"}
                            </span>
                        </div>

                        {isRecording && (
                            <div className="flex flex-col items-start px-6 py-2 bg-white/5 rounded-2xl border border-white/5 min-w-[200px]">
                                <div className="flex items-center space-x-3 mb-1">
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                                    <span className="text-[10px] font-bold text-white/60 tracking-widest uppercase">Recording</span>
                                    <span className="text-[10px] font-mono text-white/40">{formatTime(recordingTime)}</span>
                                </div>
                                <p className="text-[11px] text-white/40 italic truncate max-w-[150px]">
                                    {transcript || "Listening..."}
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center space-x-4 animate-fade-in">
                        <button
                            onClick={() => setAudioBlob(null)}
                            className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/40 transition-all"
                        >
                            <RefreshCw size={20} />
                        </button>

                        <div className="h-10 w-[1px] bg-white/10"></div>

                        <button
                            disabled={isProcessing}
                            onClick={() => onRecordingComplete(audioBlob, transcript)}
                            className="px-10 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-600/10 flex items-center group"
                        >
                            {isProcessing ? "Processing..." : "Submit Response"}
                            {!isProcessing && <Play size={12} className="ml-3 group-hover:translate-x-0.5 transition-transform fill-current" />}
                        </button>
                    </div>
                )}
            </div>
        );
    }

    // Default Card View (Keep for legacy or other pages if needed)
    return (
        <div className="w-full max-w-lg mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-8 text-center flex flex-col items-center">
            {/* ... keeping the card UI logic here for fallback ... */}
            <div className="mb-6 relative">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${isRecording ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' : 'bg-slate-100 text-slate-400'}`}>
                    <Mic size={28} />
                </div>
            </div>
            {/* Simplified for the sake of completeness while focusing on 'minimal' */}
            <h3 className="text-xl font-bold text-slate-900 mb-2">{isRecording ? "Listening..." : "Response Ready"}</h3>
            <button
                disabled={isProcessing}
                onClick={isRecording ? stopRecording : startRecording}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg"
            >
                {isRecording ? "Stop Recording" : "Start Recording"}
            </button>
        </div>
    );
};

export default VoiceRecorder;
