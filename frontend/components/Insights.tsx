import React from 'react';
import {
  Activity,
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Award,
  BarChart3,
  CalendarClock,
  CircleDollarSign,
  ClipboardList,
  Clock3,
  DollarSign,
  FileSpreadsheet,
  FileText,
  PieChart,
  TrendingUp,
} from 'lucide-react';

type Stat = {
  label: string;
  value: string;
  subtitle: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  accent: string;
  isPrimary?: boolean;
};

const stats: Stat[] = [
  { label: 'TOTAL REVENUE', value: '$1.03M', subtitle: '+18.3% vs last period', icon: CircleDollarSign, accent: 'var(--spacespot-cyan-primary)', isPrimary: true },
  { label: 'OCCUPANCY RATE', value: '85%', subtitle: '+7% from last month', icon: Activity, accent: '#8b5cf6' },
  { label: 'TOTAL LEASES', value: '90', subtitle: '90 leasing active', icon: FileSpreadsheet, accent: '#3b82f6' },
  { label: 'AVAILABLE', value: '20', subtitle: 'Out of 110 total', icon: ClipboardList, accent: 'var(--spacespot-success)' },
  { label: 'YEARLY REVENUE', value: '$2,200', subtitle: '+2% increase', icon: TrendingUp, accent: '#f59e0b' },
  { label: 'EXPIRING SOON', value: '11', subtitle: 'Within 60 days', icon: Clock3, accent: 'var(--spacespot-error)' },
];

const cardStyle: React.CSSProperties = {
  backgroundColor: 'var(--spacespot-white)',
  border: '1px solid var(--spacespot-gray-300)',
  borderRadius: '8px',
  boxShadow: '0 2px 6px rgba(15, 23, 42, 0.08)',
};

export default function Insights() {
  return (
    <div style={{ padding: '12px 12px 18px', backgroundColor: 'var(--spacespot-gray-50)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: 'var(--spacespot-navy-primary)' }}>Insights & Analytics</h1>
            <p style={{ margin: '4px 0 0', fontSize: '9px', color: 'var(--spacespot-gray-500)' }}>Key metrics and performance indicators</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              type="button"
              style={{
                height: '24px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: 'var(--spacespot-navy-primary)',
                color: 'var(--spacespot-white)',
                fontSize: '8px',
                fontWeight: 600,
                padding: '0 10px',
                cursor: 'pointer',
              }}
            >
              All Spaces
            </button>
            <button
              type="button"
              style={{
                height: '24px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: 'var(--spacespot-cyan-primary)',
                color: 'var(--spacespot-white)',
                fontSize: '8px',
                fontWeight: 600,
                padding: '0 10px',
                cursor: 'pointer',
              }}
            >
              Export Report
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: '8px', marginBottom: '10px' }}>
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                style={{
                  ...cardStyle,
                  padding: '8px 8px 7px',
                  backgroundColor: stat.isPrimary ? 'var(--spacespot-cyan-primary)' : 'var(--spacespot-white)',
                  border: stat.isPrimary ? '1px solid var(--spacespot-cyan-dark)' : '1px solid var(--spacespot-gray-300)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '4px',
                      backgroundColor: stat.isPrimary ? 'rgba(255,255,255,0.2)' : 'var(--spacespot-cyan-pale)',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <Icon size={9} color={stat.isPrimary ? 'var(--spacespot-white)' : stat.accent} />
                  </div>
                  <ArrowUp size={8} color={stat.isPrimary ? 'rgba(255,255,255,0.85)' : 'var(--spacespot-gray-400)'} />
                </div>

                <div style={{ fontSize: '7px', letterSpacing: '0.03em', color: stat.isPrimary ? 'rgba(255,255,255,0.9)' : 'var(--spacespot-gray-500)', marginBottom: '4px' }}>{stat.label}</div>
                <div style={{ fontSize: '21px', lineHeight: 1, fontWeight: 700, color: stat.isPrimary ? 'var(--spacespot-white)' : stat.accent, marginBottom: '4px' }}>{stat.value}</div>
                <div style={{ fontSize: '7px', color: stat.isPrimary ? 'rgba(255,255,255,0.85)' : stat.label === 'EXPIRING SOON' ? 'var(--spacespot-error)' : 'var(--spacespot-gray-400)' }}>{stat.subtitle}</div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
          <div style={{ ...cardStyle, padding: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--spacespot-navy-primary)' }}>Revenue & Occupancy Trend</div>
              <TrendingUp size={10} color="var(--spacespot-cyan-primary)" />
            </div>
            <div style={{ height: '180px', borderRadius: '6px', border: '1px solid var(--spacespot-gray-200)', position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, rgba(99,102,241,0.22) 0%, rgba(20,216,204,0.08) 100%)' }}>
              <svg width="100%" height="100%" viewBox="0 0 400 180" preserveAspectRatio="none">
                <g stroke="rgba(107,114,128,0.16)" strokeWidth="1">
                  <line x1="34" y1="24" x2="372" y2="24" />
                  <line x1="34" y1="54" x2="372" y2="54" />
                  <line x1="34" y1="84" x2="372" y2="84" />
                  <line x1="34" y1="114" x2="372" y2="114" />
                  <line x1="34" y1="144" x2="372" y2="144" />
                  <line x1="34" y1="24" x2="34" y2="144" />
                  <line x1="90" y1="24" x2="90" y2="144" />
                  <line x1="146" y1="24" x2="146" y2="144" />
                  <line x1="202" y1="24" x2="202" y2="144" />
                  <line x1="258" y1="24" x2="258" y2="144" />
                  <line x1="314" y1="24" x2="314" y2="144" />
                  <line x1="372" y1="24" x2="372" y2="144" />
                </g>

                <polygon points="34,60 90,48 146,42 202,33 258,23 314,16 372,10 372,144 34,144" fill="rgba(99,102,241,0.34)" />
                <polyline points="34,60 90,48 146,42 202,33 258,23 314,16 372,10" fill="none" stroke="#7c3aed" strokeWidth="2" />

                <polyline points="34,82 90,78 146,71 202,64 258,55 314,47 372,41" fill="none" stroke="#14d8cc" strokeWidth="2" />

                <g fill="#14d8cc" fontSize="8" textAnchor="end">
                  <text x="30" y="146">0</text>
                  <text x="30" y="116">50000</text>
                  <text x="30" y="86">100000</text>
                  <text x="30" y="56">150000</text>
                  <text x="30" y="26">200000</text>
                </g>

                <g fill="#8b5cf6" fontSize="8" textAnchor="start">
                  <text x="374" y="146">0</text>
                  <text x="374" y="116">25</text>
                  <text x="374" y="86">50</text>
                  <text x="374" y="56">75</text>
                  <text x="374" y="26">100</text>
                </g>

                <g fill="#6b7280" fontSize="8" textAnchor="middle">
                  <text x="34" y="158">Jan</text>
                  <text x="90" y="158">Feb</text>
                  <text x="146" y="158">Mar</text>
                  <text x="202" y="158">Apr</text>
                  <text x="258" y="158">May</text>
                  <text x="314" y="158">Jun</text>
                </g>
              </svg>
              <div style={{ position: 'absolute', bottom: '8px', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '14px', fontSize: '8px', fontWeight: 500 }}>
                <span style={{ color: '#14d8cc' }}>-o-Revenue ($)</span>
                <span style={{ color: '#7c3aed' }}>-o-Occupancy (%)</span>
              </div>
            </div>
          </div>

          <div style={{ ...cardStyle, padding: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--spacespot-navy-primary)' }}>Floor Performance</div>
              <BarChart3 size={10} color="#8b5cf6" />
            </div>
            <div style={{ height: '180px', borderRadius: '6px', border: '1px solid var(--spacespot-gray-200)', backgroundColor: 'var(--spacespot-gray-50)', position: 'relative', padding: '12px 10px 26px' }}>
              <svg width="100%" height="100%" viewBox="0 0 380 160" preserveAspectRatio="none">
                <g stroke="rgba(107,114,128,0.16)" strokeWidth="1">
                  <line x1="36" y1="16" x2="360" y2="16" />
                  <line x1="36" y1="46" x2="360" y2="46" />
                  <line x1="36" y1="76" x2="360" y2="76" />
                  <line x1="36" y1="106" x2="360" y2="106" />
                  <line x1="36" y1="136" x2="360" y2="136" />
                  <line x1="36" y1="16" x2="36" y2="136" />
                </g>

                <g fill="#6b7280" fontSize="8" textAnchor="end">
                  <text x="32" y="138">0</text>
                  <text x="32" y="108">6</text>
                  <text x="32" y="78">12</text>
                  <text x="32" y="48">18</text>
                  <text x="32" y="18">24</text>
                </g>

                {[
                  { x: 52, h: 90, label: 'Floor 1' },
                  { x: 114, h: 100, label: 'Floor 2' },
                  { x: 176, h: 78, label: 'Floor 3' },
                  { x: 238, h: 116, label: 'Floor 4' },
                  { x: 300, h: 66, label: 'Floor 5' },
                ].map((bar) => (
                  <g key={bar.label}>
                    <rect x={bar.x - 14} y={136 - bar.h} width="28" height={bar.h} rx="4" fill="#6b7280" />
                    <text x={bar.x} y="150" fontSize="8" fill="#6b7280" textAnchor="middle">{bar.label}</text>
                  </g>
                ))}
              </svg>
              <div style={{ position: 'absolute', bottom: '5px', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '12px', fontSize: '8px' }}>
                <span style={{ color: '#14d8cc', fontWeight: 500 }}>■Occupied</span>
                <span style={{ color: '#6b7280', fontWeight: 500 }}>■Available</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
          <div style={{ ...cardStyle, padding: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--spacespot-navy-primary)' }}>Space Type Distribution</div>
              <PieChart size={10} color="var(--spacespot-cyan-primary)" />
            </div>
            <div style={{ height: '108px', position: 'relative' }}>
              <svg width="100%" height="100%" viewBox="0 0 300 108" preserveAspectRatio="none">
                <g transform="translate(108 56)">
                  <path d="M 0 0 L 0 -34 A 34 34 0 0 1 33 8 Z" fill="#14D8CC" />
                  <path d="M 0 0 L 33 8 A 34 34 0 0 1 -7 33 Z" fill="#22c55e" />
                  <path d="M 0 0 L -7 33 A 34 34 0 0 1 -33 8 Z" fill="#3b82f6" />
                  <path d="M 0 0 L -33 8 A 34 34 0 0 1 0 -34 Z" fill="#7c3aed" />
                  <circle cx="0" cy="0" r="0.5" fill="#ffffff" />
                </g>

                <text x="154" y="20" fontSize="8" fill="#14D8CC">Office Spaces 45%</text>
                <text x="188" y="82" fontSize="8" fill="#22c55e">Co-working 9%</text>
                <text x="178" y="102" fontSize="8" fill="#3b82f6">Warehouse 18%</text>
                <text x="18" y="86" fontSize="8" fill="#7c3aed">Retail Units 28%</text>
              </svg>
            </div>
          </div>

          <div style={{ ...cardStyle, padding: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--spacespot-navy-primary)' }}>Lease Duration</div>
              <CalendarClock size={10} color="#8b5cf6" />
            </div>
            <div style={{ height: '108px', borderRadius: '6px', border: '1px solid var(--spacespot-gray-200)', backgroundColor: 'var(--spacespot-gray-50)', position: 'relative', padding: '8px 8px 14px' }}>
              <svg width="100%" height="100%" viewBox="0 0 300 108" preserveAspectRatio="none">
                <g stroke="rgba(107,114,128,0.16)" strokeWidth="1">
                  <line x1="98" y1="10" x2="98" y2="90" />
                  <line x1="138" y1="10" x2="138" y2="90" />
                  <line x1="178" y1="10" x2="178" y2="90" />
                  <line x1="218" y1="10" x2="218" y2="90" />
                  <line x1="258" y1="10" x2="258" y2="90" />
                </g>

                <g fill="#6b7280" fontSize="8" textAnchor="end">
                  <text x="92" y="25">0-6 months</text>
                  <text x="92" y="45">6-12 months</text>
                  <text x="92" y="65">12-24 months</text>
                  <text x="92" y="85">24+ months</text>
                </g>

                <rect x="98" y="14" width="56" height="14" rx="4" fill="#7c4de2" />
                <rect x="98" y="34" width="96" height="14" rx="4" fill="#7c4de2" />
                <rect x="98" y="54" width="146" height="14" rx="4" fill="#7c4de2" />
                <rect x="98" y="74" width="106" height="14" rx="4" fill="#7c4de2" />

                <g fill="#6b7280" fontSize="8" textAnchor="middle">
                  <text x="98" y="102">0</text>
                  <text x="138" y="102">10</text>
                  <text x="178" y="102">20</text>
                  <text x="218" y="102">30</text>
                  <text x="258" y="102">40</text>
                </g>
              </svg>
            </div>
          </div>

          <div style={{ ...cardStyle, padding: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--spacespot-navy-primary)' }}>Expiring Leases</div>
              <Clock3 size={10} color="var(--spacespot-error)" />
            </div>
            <div style={{ height: '108px', borderRadius: '6px', border: '1px solid var(--spacespot-gray-200)', backgroundColor: 'var(--spacespot-gray-50)', position: 'relative', padding: '8px 8px 14px' }}>
              <svg width="100%" height="100%" viewBox="0 0 300 108" preserveAspectRatio="none">
                <g stroke="rgba(107,114,128,0.16)" strokeWidth="1">
                  <line x1="34" y1="10" x2="270" y2="10" />
                  <line x1="34" y1="30" x2="270" y2="30" />
                  <line x1="34" y1="50" x2="270" y2="50" />
                  <line x1="34" y1="70" x2="270" y2="70" />
                  <line x1="34" y1="90" x2="270" y2="90" />
                  <line x1="34" y1="10" x2="34" y2="90" />
                </g>

                <g fill="#6b7280" fontSize="8" textAnchor="end">
                  <text x="30" y="92">0</text>
                  <text x="30" y="72">20</text>
                  <text x="30" y="52">40</text>
                  <text x="30" y="32">60</text>
                  <text x="30" y="12">80</text>
                </g>

                <polyline points="34,84 86,80 138,74 190,78 222,58 270,18" fill="none" stroke="#ef4444" strokeWidth="2.5" />
                {[['34','84'], ['86','80'], ['138','74'], ['190','78'], ['270','18']].map((p, i) => (
                  <circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill="#ef4444" />
                ))}

                <g fill="#6b7280" fontSize="8" textAnchor="middle">
                  <text x="86" y="102">Next Month</text>
                  <text x="138" y="102">2 Months</text>
                  <text x="222" y="102">4+ Months</text>
                </g>
              </svg>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ ...cardStyle, border: '1.5px solid var(--spacespot-cyan-primary)', backgroundColor: 'rgba(20,216,204,0.07)', padding: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: 700, color: 'var(--spacespot-navy-primary)', marginBottom: '8px' }}>
              <TrendingUp size={11} color="var(--spacespot-cyan-primary)" />
              Performance Highlights
            </div>
            {[
              { title: 'Best Performing Floor', sub: 'Floor 4 - 100% Occupancy', icon: Award },
              { title: 'Top Revenue Generator', sub: 'Office Spaces - $285K', icon: DollarSign },
              { title: 'New Leases This Month', sub: '13 new agreements signed', icon: FileText },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} style={{ backgroundColor: 'var(--spacespot-white)', border: '1px solid rgba(20,216,204,0.5)', borderRadius: '6px', padding: '6px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div>
                    <div style={{ fontSize: '8px', fontWeight: 700, color: 'var(--spacespot-navy-primary)' }}>{item.title}</div>
                    <div style={{ fontSize: '7px', color: 'var(--spacespot-gray-500)' }}>{item.sub}</div>
                  </div>
                  <Icon size={11} color="var(--spacespot-cyan-primary)" />
                </div>
              );
            })}
          </div>

          <div style={{ ...cardStyle, border: '1.5px solid var(--spacespot-warning)', backgroundColor: 'rgba(245,158,11,0.08)', padding: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: 700, color: 'var(--spacespot-navy-primary)', marginBottom: '8px' }}>
              <AlertCircle size={11} color="var(--spacespot-warning)" />
              Action Items
            </div>
            {[
              { title: '4 Leases Expiring This Month', sub: 'Contact customers for renewal', color: 'var(--spacespot-error)' },
              { title: 'Floor 5 Underperforming', sub: '8 vacant units - review pricing', color: 'var(--spacespot-warning)' },
              { title: 'Revenue Target on Track', sub: '85% of Q2 target achieved', color: 'var(--spacespot-success)' },
            ].map((item) => (
              <div key={item.title} style={{ backgroundColor: 'var(--spacespot-white)', border: '1px solid rgba(245,158,11,0.5)', borderRadius: '6px', padding: '6px 8px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '999px', backgroundColor: item.color, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '8px', fontWeight: 700, color: 'var(--spacespot-navy-primary)' }}>{item.title}</div>
                  <div style={{ fontSize: '7px', color: 'var(--spacespot-gray-500)' }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

