"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

type Category = "all" | "security" | "network" | "protocol" | "standard";

interface ExpertiseItem {
  title: string;
  subtitle: string;
  category: Category;
  description: string;
  icon: React.ReactNode;
}

const categories: { label: string; value: Category }[] = [
  { label: "All",      value: "all"      },
  { label: "Security", value: "security" },
  { label: "Network",  value: "network"  },
  { label: "Protocol", value: "protocol" },
  { label: "Standard", value: "standard" },
];

const categoryColor: Record<Category, string> = {
  all:      "text-violet-400  border-violet-500/30  bg-violet-500/10",
  security: "text-purple-400  border-purple-500/30  bg-purple-500/10",
  network:  "text-blue-400    border-blue-500/30    bg-blue-500/10",
  protocol: "text-teal-400    border-teal-500/30    bg-teal-500/10",
  standard: "text-yellow-400  border-yellow-500/30  bg-yellow-500/10",
};

const categoryGlow: Record<Category, string> = {
  all:      "hover:border-violet-500/40 hover:shadow-violet-500/5",
  security: "hover:border-purple-500/40 hover:shadow-purple-500/5",
  network:  "hover:border-blue-500/40   hover:shadow-blue-500/5",
  protocol: "hover:border-teal-500/40   hover:shadow-teal-500/5",
  standard: "hover:border-yellow-500/40 hover:shadow-yellow-500/5",
};

const categoryTopBar: Record<Category, string> = {
  all:      "bg-violet-500",
  security: "bg-purple-500",
  network:  "bg-blue-500",
  protocol: "bg-teal-500",
  standard: "bg-yellow-500",
};

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const AAAIcon = ({ c }: { c: string }) => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M14 2L5 7v7c0 5.8 4.1 11.3 9 12.8 4.9-1.5 9-7 9-12.8V7L14 2z"
      stroke={c} strokeWidth="1.5" strokeLinejoin="round"/>
    <circle cx="14" cy="13" r="2.5" stroke={c} strokeWidth="1.5"/>
    <path d="M14 15.5v3.5" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M10 18.5h8" stroke={c} strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
  </svg>
);

const RADIUSIcon = ({ c }: { c: string }) => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect x="3" y="7" width="22" height="14" rx="2.5" stroke={c} strokeWidth="1.5"/>
    <circle cx="9" cy="14" r="2" stroke={c} strokeWidth="1.3"/>
    <path d="M13 11h9M13 14h6M13 17h8" stroke={c} strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M3 10.5h22" stroke={c} strokeWidth="0.8" strokeDasharray="2 2" opacity="0.4"/>
  </svg>
);

const ACLIcon = ({ c }: { c: string }) => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M4 8h20M4 14h13M4 20h15" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="22" cy="20" r="4" stroke={c} strokeWidth="1.3"/>
    <path d="M20.5 20l1 1 2.5-2.5" stroke={c} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SNMPIcon = ({ c }: { c: string }) => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="4"  r="2.5" stroke={c} strokeWidth="1.3"/>
    <circle cx="5"  cy="14" r="2.5" stroke={c} strokeWidth="1.3"/>
    <circle cx="23" cy="14" r="2.5" stroke={c} strokeWidth="1.3"/>
    <circle cx="9"  cy="22" r="2.5" stroke={c} strokeWidth="1.3"/>
    <circle cx="19" cy="22" r="2.5" stroke={c} strokeWidth="1.3"/>
    <path d="M14 6.5v3M14 9.5L5 11.5M14 9.5L23 11.5M7 15.5L9 19.5M21 15.5L19 19.5"
      stroke={c} strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
  </svg>
);

const OSIIcon = ({ c }: { c: string }) => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    {[0,1,2,3].map(i => (
      <rect key={i} x="3" y={4 + i * 5.5} width={22 - i * 1.5} height="4"
        rx="1" stroke={c} strokeWidth="1.2" fill={c} fillOpacity={0.06 + (3-i)*0.04}/>
    ))}
    <text x="14" y="8.2"   textAnchor="middle" fill={c} fontSize="2.8" fontFamily="monospace" opacity="0.8">Application</text>
    <text x="14" y="13.7"  textAnchor="middle" fill={c} fontSize="2.8" fontFamily="monospace" opacity="0.8">Transport</text>
    <text x="14" y="19.2"  textAnchor="middle" fill={c} fontSize="2.8" fontFamily="monospace" opacity="0.8">Network</text>
    <text x="14" y="24.7"  textAnchor="middle" fill={c} fontSize="2.8" fontFamily="monospace" opacity="0.8">Data Link</text>
  </svg>
);

const TCPIPIcon = ({ c }: { c: string }) => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect x="3" y="3"  width="22" height="5.5" rx="1.5" stroke={c} strokeWidth="1.3" fill={c} fillOpacity="0.12"/>
    <rect x="3" y="11" width="22" height="5.5" rx="1.5" stroke={c} strokeWidth="1.3" fill={c} fillOpacity="0.08"/>
    <rect x="3" y="19" width="22" height="5.5" rx="1.5" stroke={c} strokeWidth="1.3" fill={c} fillOpacity="0.04"/>
    <text x="14" y="7"   textAnchor="middle" fill={c} fontSize="3" fontFamily="monospace" opacity="0.9">Application</text>
    <text x="14" y="15"  textAnchor="middle" fill={c} fontSize="3" fontFamily="monospace" opacity="0.9">TCP · UDP</text>
    <text x="14" y="23"  textAnchor="middle" fill={c} fontSize="3" fontFamily="monospace" opacity="0.9">IP · Ethernet</text>
  </svg>
);

const SwitchL3Icon = ({ c }: { c: string }) => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect x="2" y="9" width="24" height="10" rx="2" stroke={c} strokeWidth="1.5"/>
    {[5,9,13,17,21].map(x => (
      <g key={x}>
        <circle cx={x} cy="14" r="1.2" fill={c} opacity="0.8"/>
        <line x1={x} y1="9" x2={x} y2="6" stroke={c} strokeWidth="1.2" strokeLinecap="round"/>
      </g>
    ))}
    <path d="M3 8h22" stroke={c} strokeWidth="0.8" strokeDasharray="2 2" opacity="0.3"/>
    <path d="M5 19v2M9 19v2M14 19v2M19 19v2M23 19v2" stroke={c} strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M3 21.5h22" stroke={c} strokeWidth="0.7" strokeDasharray="2 2" opacity="0.3"/>
  </svg>
);

const Dot1XIcon = ({ c }: { c: string }) => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect x="2"  y="10" width="7"  height="8" rx="1.5" stroke={c} strokeWidth="1.3"/>
    <rect x="11" y="10" width="6"  height="8" rx="1.5" stroke={c} strokeWidth="1.3"/>
    <rect x="19" y="10" width="7"  height="8" rx="1.5" stroke={c} strokeWidth="1.3"/>
    <circle cx="5.5" cy="14" r="1.2" fill={c}/>
    <path d="M9 14h2M17 14h2" stroke={c} strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M14 10V7M14 18v3" stroke={c} strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
    <path d="M11 7h6" stroke={c} strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
    <path d="M11 21h6" stroke={c} strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
  </svg>
);

const TFTPIcon = ({ c }: { c: string }) => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect x="3"  y="16" width="9" height="8" rx="1.5" stroke={c} strokeWidth="1.3"/>
    <rect x="16" y="4"  width="9" height="8" rx="1.5" stroke={c} strokeWidth="1.3"/>
    <path d="M12 20h2a2 2 0 002-2V9" stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M18 6l2.5 2.5L18 11" stroke={c} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="7.5" cy="20" r="1.3" fill={c}/>
    <path d="M4 20h1M9 20h1" stroke={c} strokeWidth="0.8" opacity="0.4"/>
  </svg>
);

const RFCIcon = ({ c }: { c: string }) => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M7 3h14a2 2 0 012 2v18a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"
      stroke={c} strokeWidth="1.4"/>
    <path d="M9 9h10M9 13h10M9 17h7" stroke={c} strokeWidth="1.2" strokeLinecap="round"/>
    <circle cx="21" cy="21" r="5" fill="#0f0f14" stroke={c} strokeWidth="1.3"/>
    <path d="M19.5 21l1.2 1.2 2.3-2.4" stroke={c} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const expertiseItems: ExpertiseItem[] = [
  {
    title: "AAA on Network Switch",
    subtitle: "Auth · Authz · Accounting",
    category: "security",
    description: "Configured AAA framework on enterprise switches — centralized access control, session accounting, and privilege management.",
    icon: <AAAIcon c="#c084fc" />,
  },
  {
    title: "RADIUS & TACACS+",
    subtitle: "Auth Server · Policy Engine",
    category: "security",
    description: "Deployed and managed RADIUS/TACACS+ servers for network device authentication, integrating with switch AAA configurations.",
    icon: <RADIUSIcon c="#c084fc" />,
  },
  {
    title: "IP Access-List",
    subtitle: "Traffic Filtering · ACL",
    category: "security",
    description: "Designed and implemented standard and extended IP access-lists for traffic filtering and network security policies.",
    icon: <ACLIcon c="#c084fc" />,
  },
  {
    title: "MiB Browser / SNMP",
    subtitle: "Monitoring · OID Tree",
    category: "security",
    description: "Used MiB browsers to traverse SNMP OID trees, poll device metrics, and configure traps for network monitoring.",
    icon: <SNMPIcon c="#c084fc" />,
  },
  {
    title: "OSI Layer Model",
    subtitle: "7-Layer Stack · Mapping",
    category: "network",
    description: "Deep practical understanding of OSI layers — applied daily in troubleshooting, protocol design, and switch configuration.",
    icon: <OSIIcon c="#60a5fa" />,
  },
  {
    title: "TCP/IP Protocol Stack",
    subtitle: "4-Layer · Encapsulation",
    category: "network",
    description: "Hands-on experience with TCP/IP — packet inspection, encapsulation flows, and protocol interaction at each layer.",
    icon: <TCPIPIcon c="#60a5fa" />,
  },
  {
    title: "Layer 3 Network Switch",
    subtitle: "Routing · VLAN · Inter-VLAN",
    category: "network",
    description: "Configured L3 switches for inter-VLAN routing, static routes, and integration with enterprise network topologies.",
    icon: <SwitchL3Icon c="#60a5fa" />,
  },
  {
    title: "802.1X Port Auth",
    subtitle: "EAP · Supplicant · RADIUS",
    category: "protocol",
    description: "Implemented IEEE 802.1X port-based network access control using EAP, integrating with RADIUS backend authentication.",
    icon: <Dot1XIcon c="#2dd4bf" />,
  },
  {
    title: "TFTP Protocol Design",
    subtitle: "UDP · RFC 1350 · Transfer",
    category: "protocol",
    description: "Designed and worked with TFTP for firmware upgrades and config backup across network devices — UDP-based simplicity.",
    icon: <TFTPIcon c="#2dd4bf" />,
  },
  {
    title: "Implementing RFC",
    subtitle: "Standards · Interoperability",
    category: "standard",
    description: "Studied and implemented RFC specifications in R&D — translating IETF standards into working protocol features.",
    icon: <RFCIcon c="#facc15" />,
  },
];

// ── Expertise Card ────────────────────────────────────────────────────────────
function ExpertiseCard({
  item,
  index,
}: {
  item: ExpertiseItem;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const color = categoryColor[item.category];
  const glow  = categoryGlow[item.category];
  const bar   = categoryTopBar[item.category];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative group flex flex-col p-5 rounded-2xl cursor-default",
        "bg-zinc-900/50 border border-zinc-800/50 transition-all duration-300",
        "hover:shadow-lg overflow-hidden",
        glow
      )}
    >
      {/* Top color accent bar */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-0.5 transition-all duration-300",
        bar,
        hovered ? "opacity-100" : "opacity-0"
      )} />

      {/* Icon */}
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
        "border transition-colors duration-300",
        color
      )}>
        {item.icon}
      </div>

      {/* Title */}
      <h3 className="text-zinc-100 font-semibold text-sm leading-snug mb-1.5 group-hover:text-white transition-colors">
        {item.title}
      </h3>

      {/* Subtitle tag */}
      <p className={cn("text-xs font-mono mb-3 leading-relaxed", color.split(" ")[0])}>
        {item.subtitle}
      </p>

      {/* Description — slides in on hover */}
      <motion.p
        initial={false}
        animate={{ opacity: hovered ? 1 : 0, height: hovered ? "auto" : 0 }}
        transition={{ duration: 0.25 }}
        className="text-zinc-500 text-xs leading-relaxed overflow-hidden"
      >
        {item.description}
      </motion.p>
    </motion.div>
  );
}

// ── Main Section ──────────────────────────────────────────────────────────────
export default function TechExpertise() {
  const [active, setActive] = useState<Category>("all");

  const filtered = active === "all"
    ? expertiseItems
    : expertiseItems.filter((i) => i.category === active);

  return (
    <section id="expertise" className="py-24 px-4 bg-zinc-900/30">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="Technical Expertise"
          subtitle="Hands-on R&D experience across networking protocols, security, and systems engineering."
        />

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setActive(value)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-mono transition-all duration-200 border",
                active === value
                  ? value === "all"
                    ? "bg-violet-600 text-white border-violet-600"
                    : cn(categoryColor[value], "font-semibold")
                  : "bg-zinc-800/50 text-zinc-500 border-zinc-700/50 hover:text-zinc-300 hover:bg-zinc-700/50"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div
            key={active}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
            {filtered.map((item, i) => (
                <ExpertiseCard key={item.title} item={item} index={i} />
            ))}
        </div>
      </div>
    </section>
  );
}