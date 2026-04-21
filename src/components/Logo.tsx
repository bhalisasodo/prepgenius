import { Headset } from 'lucide-react';

const Logo = ({ className = "", collapsed = false }: { className?: string; collapsed?: boolean }) => {
    return (
        <div className={`flex items-center space-x-3 ${className}`}>
            <div className="relative flex items-center justify-center">
                <div className="bg-indigo-600 p-2 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Headset className="text-white w-6 h-6" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            {!collapsed && (
                <div className="flex flex-col leading-tight">
                    <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        prep<span className="text-indigo-600">genius</span>
                    </span>

                </div>
            )}
        </div>
    );
};

export default Logo;
