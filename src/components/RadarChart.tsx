
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
        <div className="relative flex items-center justify-center p-4 bg-dark-surface/80 backdrop-blur-sm rounded-3xl border border-dark-border shadow-2xl">
            <svg width={size} height={size} className="overflow-visible">
                {/* Background Polygons */}
                {[20, 40, 60, 80, 100].map(level => {
                    const levelPoints = categories.map((_, i) => getPoint(i, level));
                    return (
                        <polygon
                            key={level}
                            points={levelPoints.map(p => `${p.x},${p.y}`).join(' ')}
                            fill="none"
                            stroke="#2a2a38"
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
                            stroke="#2a2a38"
                            strokeWidth="1"
                        />
                    );
                })}

                {/* Data Polygon */}
                <polygon
                    points={polygonPath}
                    fill="rgba(0, 212, 255, 0.15)"
                    stroke="url(#gradientStroke)"
                    strokeWidth="3"
                    className="animate-pulse-slow"
                />

                {/* Gradient Definition */}
                <defs>
                    <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00d4ff" />
                        <stop offset="50%" stopColor="#7c3aed" />
                        <stop offset="100%" stopColor="#00d4ff" />
                    </linearGradient>
                </defs>

                {/* Data Points */}
                {points.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r="5" fill="#00d4ff" opacity="0.8" />
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
                            className="text-[10px] font-bold fill-cyan-accent/80 uppercase tracking-tighter"
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
