import { Headset } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Logo = ({ className = "", collapsed = false }: { className?: string; collapsed?: boolean }) => {
    const navigate = useNavigate();
    
    return (
        <div 
            onClick={() => navigate('/')}
            className={`flex items-center space-x-3 cursor-pointer transition-opacity hover:opacity-80 ${className}`}
        >
            <div className="relative flex items-center justify-center">
                <div className="bg-gradient-to-br from-cyan-500 to-purple-accent p-2 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-accent/30">
                    <Headset className="text-white w-6 h-6" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-success w-3 h-3 rounded-full border-2 border-white/80 animate-pulse"></div>
            </div>
            {!collapsed && (
                <div className="flex flex-col leading-tight">
                    <span className="text-2xl font-bold tracking-tight text-white">
                        prep<span className="text-cyan-accent">genius</span>
                    </span>
                </div>
            )}
        </div>
    );
};

export default Logo;
