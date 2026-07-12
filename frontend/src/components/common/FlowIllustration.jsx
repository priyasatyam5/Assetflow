import { motion } from 'framer-motion';

/**
 * FlowIllustration
 * Signature visual for AssetFlow: a network of asset "nodes" (laptop,
 * room, projector, chair — real items from the domain) connected by
 * animated dashed paths, representing assets moving between
 * departments, locations and people. This is the one deliberate
 * visual risk for the brand panel — everything else stays quiet.
 */
export default function FlowIllustration() {
  const nodes = [
    { x: 80, y: 90, label: 'IT Dept' },
    { x: 320, y: 60, label: 'Warehouse' },
    { x: 360, y: 240, label: 'HQ Floor 2' },
    { x: 90, y: 300, label: 'Field Ops' },
    { x: 220, y: 190, label: '', hub: true },
  ];

  const paths = [
    'M80,90 C140,130 160,150 220,190',
    'M320,60 C270,110 250,140 220,190',
    'M360,240 C300,220 260,205 220,190',
    'M90,300 C140,260 170,230 220,190',
  ];

  return (
    <svg
      viewBox="0 0 440 380"
      className="w-full max-w-md mx-auto drop-shadow-xl"
      role="img"
      aria-label="Illustration of assets flowing between departments, warehouse and field locations"
    >
      <defs>
        <linearGradient id="flowStroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#93C5FD" />
          <stop offset="100%" stopColor="#5EEAD4" />
        </linearGradient>
        <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#14B8A6" stopOpacity="0" />
        </radialGradient>
      </defs>

      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="url(#flowStroke)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="6 8"
          opacity="0.85"
          className="animate-dashMove"
        />
      ))}

      <circle cx="220" cy="190" r="42" fill="url(#hubGlow)" className="animate-pulseGlow" />

      {nodes.map((n, i) => (
        <g key={i} className="animate-floatSlow" style={{ animationDelay: `${i * 0.4}s` }}>
          <circle
            cx={n.x}
            cy={n.y}
            r={n.hub ? 16 : 10}
            fill={n.hub ? '#2563EB' : '#FFFFFF'}
            stroke={n.hub ? '#93C5FD' : '#2563EB'}
            strokeWidth="2"
          />
          {n.hub && (
            <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="10" fill="#fff" fontWeight="700">
              AF
            </text>
          )}
          {n.label && (
            <text
              x={n.x}
              y={n.y - 18}
              textAnchor="middle"
              fontSize="11"
              fontFamily="Inter, sans-serif"
              fill="#1E293B"
              fontWeight="600"
              opacity="0.85"
            >
              {n.label}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
