import React, { useEffect, useState } from "react";
import { Card } from "../ui/Card";
import { ImageWithFallback } from "./ImageWithFallback";
import { imgIcon, imgImageSpaceSpotCommercialLeaseManagement } from "./assets";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

// Global chart defaults to match design tokens
ChartJS.defaults.font.family = "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial";
ChartJS.defaults.color = '#6b7280';

export default function DashboardVenueOwner() {
  const [colors, setColors] = useState({ cyan: 'var(--spacespot-cyan-primary)', cyanLight: '#E0F9F7', gray: '#6b7280', success: '#10B981' });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const s = getComputedStyle(document.documentElement);
    setColors({
      cyan: s.getPropertyValue('--spacespot-cyan-primary')?.trim() || 'var(--spacespot-cyan-primary)',
      cyanLight: s.getPropertyValue('--spacespot-cyan-pale')?.trim() || '#E0F9F7',
      gray: s.getPropertyValue('--spacespot-gray-500')?.trim() || '#6b7280',
      success: s.getPropertyValue('--spacespot-success')?.trim() || '#10B981',
    });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-semibold mb-6" style={{ color: 'var(--spacespot-navy-primary)' }}>Welcome</h1>

      <div className="flex gap-6">
        <div className="flex-1">
          <Card variant="gradient" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-transparent">
                  <ImageWithFallback src={imgIcon} alt="icon" className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-semibold" style={{ color: 'var(--spacespot-navy-primary)' }}>Visual Analytics</h2>
              </div>
              <div className="text-white rounded-md px-3 py-1 text-sm" style={{ background: 'var(--spacespot-cyan-primary)' }}>This Month</div>
            </div>

            <div className="grid grid-cols-5 gap-4 mb-4">
                {[
                { label: "Available Spaces", value: 32, colorVar: 'spacespot-success' },
                { label: "Rented Spaces", value: 66, colorVar: 'spacespot-cyan-primary' },
                { label: "Leases Closed", value: 14, colorVar: 'spacespot-info' },
                { label: "Precinct", value: "Downtown", colorVar: 'spacespot-navy-primary' },
                { label: "Fast Leasing", value: "Level 3A", colorVar: 'spacespot-error' }
              ].map((s, i) => (
                <div key={i} className="bg-white border rounded-lg p-3 shadow-sm" style={{ borderColor: 'var(--spacespot-gray-200)' }}>
                  <div className="flex items-start gap-3">
                    <div style={{ background: `var(--${s.colorVar})` }} className="w-10 h-10 rounded-md" />
                    <div>
                      <div className="text-xs uppercase" style={{ color: 'var(--spacespot-gray-500)' }}>{s.label}</div>
                      <div className="text-2xl font-bold" style={{ color: 'var(--spacespot-navy-primary)' }}>{s.value}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-[#6b7280] rounded-lg p-4 shadow-sm h-48">
                <div className="text-sm font-semibold mb-2">Revenue Trend</div>
                <Line
                  data={{
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [
                      {
                        label: 'Revenue',
                        data: [30000, 35000, 33000, 42000, 48000, 46000],
                        borderColor: colors.cyan,
                        backgroundColor: colors.cyan,
                        pointBackgroundColor: colors.cyan,
                        pointRadius: 3,
                        pointHoverRadius: 5,
                        tension: 0.38,
                        fill: true,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: { ticks: { color: '#6b7280' }, grid: { color: 'rgba(15,23,36,0.06)' } },
                      x: { ticks: { color: '#6b7280' }, grid: { display: false } },
                    },
                  }}
                  style={{ height: '160px' }}
                />
              </div>
              <div className="bg-white border border-[#6b7280] rounded-lg p-4 shadow-sm h-48 flex items-center justify-center">
                <div className="w-36 h-36">
                  <Doughnut
                    data={{
                      labels: ['Occupied', 'Available'],
                      datasets: [
                        {
                          data: [68, 32],
                          backgroundColor: [colors.cyan, 'var(--spacespot-gray-100)'],
                          hoverBackgroundColor: [colors.success, 'var(--spacespot-gray-500)'],
                          borderWidth: 0,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      cutout: '68%'
                        ,plugins: { legend: { position: 'bottom' as const, labels: { color: '#6b7280' } } },
                    }}
                    style={{ height: '120px' }}
                  />
                </div>
              </div>
            </div>
          </Card>

          <h3 className="mt-6 mb-3 text-lg font-semibold text-[#1f2937]">Space Availability Overview</h3>
          <Card className="p-4">
            <div className="w-full h-64">
              <Bar
                data={{
                  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                  datasets: [
                    {
                      label: 'Available Spaces',
                      data: [45, 50, 48, 52, 47, 44],
                      backgroundColor: 'var(--spacespot-gray-500)',
                      borderRadius: 6,
                      barThickness: 18,
                    },
                    {
                      label: 'Rented Spaces',
                      data: [34, 38, 40, 43, 41, 39],
                      backgroundColor: 'var(--spacespot-cyan-primary)',
                      borderRadius: 6,
                      barThickness: 18,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom' as const, labels: { color: '#6b7280' } } },
                  scales: {
                    x: { grid: { display: false }, ticks: { color: '#6b7280' } },
                    y: { grid: { color: 'rgba(15,23,36,0.06)' }, ticks: { color: '#6b7280' } },
                  },
                }}
              />
            </div>
          </Card>
        </div>

        <div style={{ width: 320 }}>
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">February 2026</div>
              <div className="text-sm">◀ ▶</div>
            </div>
            <div className="bg-[#0f1724] text-white rounded-lg p-4">[Calendar placeholder]</div>
          </Card>

          <Card className="p-3 mt-4 bg-[#0f766e] text-white">
            <div className="text-sm font-semibold">Board Meeting - Q1 Review</div>
            <div className="text-xs text-[#d1fae5] mt-1">Important Event</div>
          </Card>
        </div>
      </div>
    </div>
  );
}

