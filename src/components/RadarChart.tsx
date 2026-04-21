
interface RadarChartProps {
    data: {
        empathy: number;
        clarity: number;
        conflict: number;
        structure: number;
        professionalism: number;
    };
}

const RadarChart = ({ data }: RadarChartProps) => {
    const size = 300;
    const center = size / 2;
    const radius = size * 0.4;

    const categories = [
        { key: 'empathy', label: 'Empathy' },
        { key: 'clarity', label: 'Clarity' },
        { key: 'conflict', label: 'Conflict' },
        { key: 'structure', label: 'Structure' },
        { key: 'professionalism', label: 'Prof.' }
    ];

    const getPoint = (index: number, value: number) => {
        const angle = (Math.PI * 2 * index) / categories.length - Math.PI / 2;
        const dist = (value / 100) * radius;
        return {
            x: center + dist * Math.cos(angle),
            y: center + dist * Math.sin(angle)
        };
    };

    const points = categories.map((cat, i) => getPoint(i, data[cat.key as keyof typeof data]));
    const polygonPath = points.map(p => `${p.x},${p.y}`).join(' ');

    return (
        <div className="relative flex items-center justify-center p-4 bg-white/50 backdrop-blur-sm rounded-[40px] border border-slate-100 shadow-inner">
            <svg width={size} height={size} className="overflow-visible">
                {/* Background Polygons */}
                {[20, 40, 60, 80, 100].map(level => {
                    const levelPoints = categories.map((_, i) => getPoint(i, level));
                    return (
                        <polygon
                            key={level}
                            points={levelPoints.map(p => `${p.x},${p.y}`).join(' ')}
                            fill="none"
                            stroke="#e2e8f0"
                            strokeWidth="1"
                        />
                    );
                })}

                {/* Axes */}
                {categories.map((_, i) => {
                    const p = getPoint(i, 100);
                    return (
                        <line
                            key={i}
                            x1={center}
                            y1={center}
                            x2={p.x}
                            y2={p.y}
                            stroke="#e2e8f0"
                            strokeWidth="1"
                        />
                    );
                })}

                {/* Data Polygon */}
                <polygon
                    points={polygonPath}
                    fill="rgba(59, 130, 246, 0.2)"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    className="animate-pulse-slow"
                />

                {/* Data Points */}
                {points.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r="4" fill="#3b82f6" />
                ))}

                {/* Labels */}
                {categories.map((cat, i) => {
                    const p = getPoint(i, 115);
                    return (
                        <text
                            key={i}
                            x={p.x}
                            y={p.y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="text-[10px] font-bold fill-slate-400 uppercase tracking-tighter"
                        >
                            {cat.label}
                        </text>
                    );
                })}
            </svg>
        </div>
    );
};

export default RadarChart;
