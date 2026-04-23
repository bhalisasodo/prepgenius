import { memo } from 'react';
import Logo from './Logo';

interface AudioVisualizerProps {
    isSpeaking: boolean;
    scale?: 'sm' | 'md' | 'lg';
}

const AudioVisualizer = memo(({ isSpeaking, scale = 'md' }: AudioVisualizerProps) => {
    const sizeClasses = {
        sm: 'w-40 h-40',
        md: 'w-56 h-56 md:w-80 md:h-80',
        lg: 'w-80 h-80 md:w-96 md:h-96'
    };

    const ringClasses = (ringIndex: number) => {
        const baseClasses = 'absolute rounded-full border';
        const sizeMap = {
            0: 'w-full h-full border-cyan-accent/20',
            1: 'w-[85%] h-[85%] border-cyan-accent/30',
            2: 'w-[70%] h-[70%] border-purple-accent/20',
            3: 'w-[55%] h-[55%] border-cyan-accent/25',
        };
        return `${baseClasses} ${sizeMap[ringIndex as keyof typeof sizeMap]} ${isSpeaking ? 'ring-pulse' : ''}`;
    };

    return (
        <div className="relative flex items-center justify-center">
            {/* Outer Glow */}
            {isSpeaking && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-accent/20 via-purple-accent/20 to-cyan-accent/20 blur-3xl animate-pulse" 
                     style={{
                         width: 'calc(100% + 40px)',
                         height: 'calc(100% + 40px)',
                         left: '-20px',
                         top: '-20px'
                     }}
                />
            )}

            {/* Main Visualizer Container */}
            <div className={`${sizeClasses[scale]} relative flex items-center justify-center transition-all duration-500 ${isSpeaking ? 'scale-105' : 'scale-100'}`}>
                
                {/* Concentric Rings */}
                {[0, 1, 2, 3].map((ringIndex) => (
                    <div
                        key={ringIndex}
                        className={ringClasses(ringIndex)}
                        style={{
                            animationDelay: `${ringIndex * 0.1}s`,
                        }}
                    />
                ))}

                {/* Center Logo */}
                <div className="relative z-10">
                    <Logo collapsed className="text-white scale-[2.5] opacity-60" />
                    
                    {/* Pulsing Dot */}
                    {isSpeaking && (
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                            <div className="w-3 h-3 bg-cyan-accent rounded-full animate-pulse" />
                        </div>
                    )}
                </div>

                {/* Wave Bars (Animated Frequency) */}
                {isSpeaking && (
                    <div className="absolute inset-0 flex items-end justify-center gap-1 pb-12">
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className="w-2 rounded-full transition-all duration-300"
                                style={{
                                    height: `${20 + Math.sin(i * 0.5) * 20}px`,
                                    background: i % 2 === 0 
                                        ? 'rgba(0, 212, 255, 0.8)' 
                                        : 'rgba(124, 58, 237, 0.8)',
                                    animation: `smoothWave 1.5s ease-in-out infinite`,
                                    animationDelay: `${i * 0.15}s`,
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Status Indicator */}
            <div className="absolute -bottom-16 left-0 right-0 flex justify-center">
                <div className={`px-4 py-2 rounded-full text-[11px] font-black text-white tracking-widest flex items-center border transition-all backdrop-blur-sm ${
                    isSpeaking 
                        ? 'bg-cyan-accent/20 border-cyan-accent/60 shadow-[0_0_20px_rgba(0,212,255,0.3)]' 
                        : 'bg-white/5 border-white/10'
                }`}>
                    <span className={`w-2 h-2 rounded-full mr-2.5 ${isSpeaking ? 'bg-cyan-accent animate-pulse' : 'bg-white/30'}`}></span>
                    {isSpeaking ? 'VICKY SPEAKING' : 'VICKY LISTENING'}
                </div>
            </div>
        </div>
    );
});

export default AudioVisualizer;
