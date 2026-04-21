import { memo } from 'react';
import Logo from './Logo';

interface AudioVisualizerProps {
    isSpeaking: boolean;
    scale?: 'sm' | 'md' | 'lg';
}

const AudioVisualizer = memo(({ isSpeaking, scale = 'md' }: AudioVisualizerProps) => {
    const sizeClasses = {
        sm: 'w-24 h-24',
        md: 'w-32 h-32 md:w-48 md:h-48',
        lg: 'w-48 h-48 md:w-64 md:h-64'
    };

    return (
        <div className="relative">
            <div className={`${sizeClasses[scale]} rounded-[2rem] bg-indigo-600/5 border border-indigo-500/10 flex items-center justify-center transition-all duration-700 ${isSpeaking ? 'scale-110 shadow-[0_0_50px_rgba(99,102,241,0.1)]' : 'scale-100'}`}>
                <Logo collapsed className="text-white scale-150 opacity-40" />
                {isSpeaking && (
                    <div className="absolute inset-x-[-20%] bottom-0 flex justify-center space-x-1.5 h-full items-end pb-8">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="w-1.5 bg-indigo-500/50 rounded-full animate-voiceWave"
                                style={{
                                    height: '20px',
                                    animationDelay: `${i * 0.15}s`,
                                    animationDuration: '1s'
                                }}
                            ></div>
                        ))}
                    </div>
                )}
            </div>

            {/* Status Indicator */}
            <div className="absolute -bottom-12 left-0 right-0 flex justify-center">
                <div className={`px-3 py-1.5 rounded-lg text-[10px] font-black text-white tracking-widest flex items-center border transition-all ${isSpeaking ? 'bg-indigo-500/20 border-indigo-500/50' : 'bg-black/60 border-white/5'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-2 ${isSpeaking ? 'bg-indigo-500 animate-pulse' : 'bg-white/20'}`}></span>
                    {isSpeaking ? 'VICKY SPEAKING' : 'VICKY LISTENING'}
                </div>
            </div>
        </div>
    );
});

export default AudioVisualizer;
