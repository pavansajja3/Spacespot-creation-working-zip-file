import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import {
  Activity, Settings, User, Server,
  Users, Building2, Bell, Shield, CreditCard, FileText, Mail, Database,
  Key, BarChart2, HardDrive, Wifi, Clock3, CircleCheck, CalendarDays,
} from 'lucide-react';

export default function Administration() {
  const [activeTab, setActiveTab] = useState<'settings' | 'users' | 'activity' | 'health'>('settings');

  const systemMetrics = [
    {
      name: 'Server Status',
      status: 'Operational',
      meta: 'Uptime: 99.98%',
      bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      icon: <Server size={18} color="white" />,
    },
    {
      name: 'Database',
      status: 'Connected',
      meta: 'Response: 12ms',
      bg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      icon: <Database size={18} color="white" />,
    },
    {
      name: 'Storage',
      status: '68% Used',
      meta: '245 GB / 360 GB',
      bg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      icon: <HardDrive size={18} color="white" />,
    },
    {
      name: 'Network',
      status: 'Stable',
      meta: 'Latency: 23ms',
      bg: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
      icon: <Wifi size={18} color="white" />,
    },
  ];

  const components = [
    { name: 'API Server', status: 'Operational', uptime: '99.98%', responseTime: '45ms' },
    { name: 'Database', status: 'Operational', uptime: '99.99%', responseTime: '12ms' },
    { name: 'File Storage', status: 'Operational', uptime: '100%', responseTime: '23ms' },
    { name: 'Email Service', status: 'Operational', uptime: '99.95%', responseTime: '156ms' },
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: 'var(--spacespot-gray-50)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>Administration</h1>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>System management and configuration</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Settings size={14} />System Preferences
            </Button>
            <Button variant="primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <HardDrive size={14} />Backup Now
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '26px', marginBottom: '24px', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px' }}>
          {(['settings', 'users', 'activity', 'health'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0',
                color: activeTab === tab ? 'var(--spacespot-cyan-primary)' : '#6b7280',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeTab === tab ? '600' : '500',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {tab === 'settings' && <Settings size={14} />}
              {tab === 'users' && <User size={14} />}
              {tab === 'activity' && <Activity size={14} />}
              {tab === 'health' && <Server size={14} />}
              {tab === 'settings' && 'Settings'}
              {tab === 'users' && 'Users'}
              {tab === 'activity' && 'Activity Log'}
              {tab === 'health' && 'System Health'}
            </button>
          ))}
        </div>

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div>
            {/* 8 Settings Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>

              {/* User Management */}
              <Card style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#e0f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Users size={22} color="var(--spacespot-cyan-primary)" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1f2937', margin: 0, marginBottom: '4px' }}>User Management</h3>
                      <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, marginBottom: '8px' }}>Manage users, roles, and permissions</p>
                      <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--spacespot-cyan-primary)', cursor: 'pointer' }}>12 Active Users</span>
                    </div>
                  </div>
                  <Settings size={16} color="#9ca3af" style={{ marginTop: '2px', flexShrink: 0 }} />
                </div>
              </Card>

              {/* Property Settings */}
              <Card style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Building2 size={22} color="#7c3aed" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1f2937', margin: 0, marginBottom: '4px' }}>Property Settings</h3>
                      <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, marginBottom: '8px' }}>Configure buildings, floors, and spaces</p>
                      <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--spacespot-cyan-primary)', cursor: 'pointer' }}>5 Buildings</span>
                    </div>
                  </div>
                  <Settings size={16} color="#9ca3af" style={{ marginTop: '2px', flexShrink: 0 }} />
                </div>
              </Card>

              {/* Notifications */}
              <Card style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Bell size={22} color="#f97316" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1f2937', margin: 0, marginBottom: '4px' }}>Notifications</h3>
                      <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, marginBottom: '8px' }}>Configure alerts and notification preferences</p>
                      <span style={{ fontSize: '13px', fontWeight: '500', color: '#f97316', cursor: 'pointer' }}>8 Active Alerts</span>
                    </div>
                  </div>
                  <Settings size={16} color="#9ca3af" style={{ marginTop: '2px', flexShrink: 0 }} />
                </div>
              </Card>

              {/* Security & Access */}
              <Card style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Shield size={22} color="#16a34a" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1f2937', margin: 0, marginBottom: '4px' }}>Security & Access</h3>
                      <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, marginBottom: '8px' }}>Security settings, 2FA, and access control</p>
                      <span style={{ fontSize: '13px', fontWeight: '500', color: '#16a34a', cursor: 'pointer' }}>Enabled</span>
                    </div>
                  </div>
                  <Settings size={16} color="#9ca3af" style={{ marginTop: '2px', flexShrink: 0 }} />
                </div>
              </Card>

              {/* Billing & Payments */}
              <Card style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CreditCard size={22} color="#2563eb" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1f2937', margin: 0, marginBottom: '4px' }}>Billing & Payments</h3>
                      <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, marginBottom: '8px' }}>Payment methods, invoicing, and billing</p>
                      <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--spacespot-cyan-primary)', cursor: 'pointer' }}>$1.03M MTD</span>
                    </div>
                  </div>
                  <Settings size={16} color="#9ca3af" style={{ marginTop: '2px', flexShrink: 0 }} />
                </div>
              </Card>

              {/* Documents & Templates */}
              <Card style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#fce7f3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <FileText size={22} color="#db2777" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1f2937', margin: 0, marginBottom: '4px' }}>Documents & Templates</h3>
                      <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, marginBottom: '8px' }}>Manage lease templates and documents</p>
                      <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--spacespot-cyan-primary)', cursor: 'pointer' }}>24 Templates</span>
                    </div>
                  </div>
                  <Settings size={16} color="#9ca3af" style={{ marginTop: '2px', flexShrink: 0 }} />
                </div>
              </Card>

              {/* Email Configuration */}
              <Card style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Mail size={22} color="#3b82f6" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1f2937', margin: 0, marginBottom: '4px' }}>Email Configuration</h3>
                      <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, marginBottom: '8px' }}>Email templates and SMTP settings</p>
                      <span style={{ fontSize: '13px', fontWeight: '500', color: '#16a34a', cursor: 'pointer' }}>Connected</span>
                    </div>
                  </div>
                  <Settings size={16} color="#9ca3af" style={{ marginTop: '2px', flexShrink: 0 }} />
                </div>
              </Card>

              {/* Data & Backups */}
              <Card style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Database size={22} color="#0284c7" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1f2937', margin: 0, marginBottom: '4px' }}>Data & Backups</h3>
                      <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, marginBottom: '8px' }}>Database management and backup schedules</p>
                      <span style={{ fontSize: '13px', fontWeight: '500', color: '#6b7280', cursor: 'pointer' }}>Last: 2h ago</span>
                    </div>
                  </div>
                  <Settings size={16} color="#9ca3af" style={{ marginTop: '2px', flexShrink: 0 }} />
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <div style={{ backgroundColor: '#f0fdfc', border: '1px solid #99f6e4', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1f2937', margin: 0, marginBottom: '16px' }}>Quick Actions</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', color: '#374151', fontWeight: '500' }}>
                  <Key size={20} color="var(--spacespot-cyan-primary)" />
                  Generate API Key
                </button>
                <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', color: '#374151', fontWeight: '500' }}>
                  <Mail size={20} color="var(--spacespot-cyan-primary)" />
                  Test Email
                </button>
                <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', color: '#374151', fontWeight: '500' }}>
                  <Database size={20} color="var(--spacespot-cyan-primary)" />
                  Export Data
                </button>
                <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', color: '#374151', fontWeight: '500' }}>
                  <BarChart2 size={20} color="var(--spacespot-cyan-primary)" />
                  System Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Search users..."
                  style={{ padding: '8px 14px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', color: '#374151', width: '200px', outline: 'none' }}
                />
                <select style={{ padding: '8px 14px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', color: '#374151', backgroundColor: 'white', cursor: 'pointer', outline: 'none', minWidth: '120px' }}>
                  <option value="">All Roles</option>
                  <option value="administrator">Administrator</option>
                  <option value="property_manager">Property Manager</option>
                  <option value="leasing_agent">Leasing Agent</option>
                  <option value="finance_manager">Finance Manager</option>
                </select>
              </div>
              <button style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '9px 18px', backgroundColor: 'var(--spacespot-cyan-primary)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                <User size={15} />
                Add New User
              </button>
            </div>

            {/* Table */}
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                    {['Name', 'Email', 'Role', 'Status', 'Last Login', 'Actions'].map((h) => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#374151' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { initials: 'SJ', name: 'Sarah Johnson',   email: 'sarah.j@spacespot.com',   role: 'Administrator',    roleColor: '#e0f2fe', roleText: '#0369a1', active: true,  lastLogin: '2 hours ago' },
                    { initials: 'MC', name: 'Michael Chen',    email: 'michael.c@spacespot.com', role: 'Property Manager', roleColor: '#e0f9f9', roleText: '#0e7490', active: true,  lastLogin: '5 hours ago' },
                    { initials: 'ER', name: 'Emily Rodriguez', email: 'emily.r@spacespot.com',   role: 'Leasing Agent',    roleColor: '#dcfce7', roleText: '#15803d', active: true,  lastLogin: '1 day ago' },
                    { initials: 'DK', name: 'David Kim',       email: 'david.k@spacespot.com',   role: 'Finance Manager',  roleColor: '#fef9c3', roleText: '#a16207', active: true,  lastLogin: '3 hours ago' },
                    { initials: 'JW', name: 'Jessica Williams',email: 'jessica.w@spacespot.com', role: 'Leasing Agent',    roleColor: '#dcfce7', roleText: '#15803d', active: false, lastLogin: '5 days ago' },
                  ].map((u, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--spacespot-cyan-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '13px', fontWeight: '600', flexShrink: 0 }}>
                            {u.initials}
                          </div>
                          <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '14px', color: '#6b7280' }}>{u.email}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ display: 'inline-block', padding: '3px 10px', backgroundColor: u.roleColor, color: u.roleText, borderRadius: '6px', fontSize: '13px', fontWeight: '500' }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '500', color: u.active ? 'var(--spacespot-success)' : '#9ca3af' }}>
                          <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: u.active ? 'var(--spacespot-success)' : '#9ca3af', display: 'inline-block' }} />
                          {u.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '14px', color: '#6b7280' }}>{u.lastLogin}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: '14px' }}>
                          <button style={{ background: 'none', border: 'none', color: 'var(--spacespot-cyan-primary)', fontSize: '13px', fontWeight: '500', cursor: 'pointer', padding: 0 }}>Edit</button>
                          <button style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '13px', fontWeight: '500', cursor: 'pointer', padding: 0 }}>Remove</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {/* Activity Log Tab */}
        {activeTab === 'activity' && (
          <div>
            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder=""
                  style={{ padding: '8px 14px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', color: '#374151', width: '120px', outline: 'none' }}
                />
                <input
                  type="text"
                  placeholder=""
                  style={{ padding: '8px 14px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', color: '#374151', width: '120px', outline: 'none' }}
                />
              </div>
              <button style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '9px 18px', backgroundColor: 'white', color: '#374151', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                <FileText size={15} color="#6b7280" />
                Export Log
              </button>
            </div>

            {/* Recent Activity Card */}
            <Card style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1f2937', margin: 0 }}>Recent Activity</h3>
              </div>
              {[
                { icon: 'activity', color: 'var(--spacespot-cyan-primary)', title: 'User login',          by: 'Sarah Johnson', time: '10 minutes ago' },
                { icon: 'check',    color: 'var(--spacespot-cyan-primary)', title: 'New lease created',   by: 'Michael Chen',  time: '1 hour ago' },
                { icon: 'check',    color: 'var(--spacespot-cyan-primary)', title: 'Payment received',    by: 'System',        time: '2 hours ago' },
                { icon: 'warning',  color: '#f59e0b',                       title: 'Failed login attempt',by: 'Unknown',       time: '3 hours ago' },
                { icon: 'activity', color: 'var(--spacespot-cyan-primary)', title: 'User role updated',   by: 'Sarah Johnson', time: '5 hours ago' },
                { icon: 'check',    color: 'var(--spacespot-cyan-primary)', title: 'Backup completed',    by: 'System',        time: '6 hours ago' },
              ].map((item, i, arr) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: i < arr.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: item.icon === 'warning' ? '#fef3c7' : '#e0f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {item.icon === 'activity' && <Activity size={15} color={item.color} />}
                      {item.icon === 'check'    && (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                      )}
                      {item.icon === 'warning'  && (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '2px' }}>{item.title}</div>
                      <div style={{ fontSize: '13px', color: '#6b7280' }}>by <span style={{ fontWeight: '500', color: '#374151' }}>{item.by}</span> • {item.time}</div>
                    </div>
                  </div>
                  <button style={{ background: 'none', border: 'none', color: 'var(--spacespot-cyan-primary)', fontSize: '13px', fontWeight: '500', cursor: 'pointer', padding: 0 }}>Details</button>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* System Health Tab */}
        {activeTab === 'health' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px', marginBottom: '20px' }}>
              {systemMetrics.map((metric) => (
                <Card
                  key={metric.name}
                  style={{
                    padding: '14px 14px 12px',
                    background: metric.bg,
                    border: 'none',
                    boxShadow: '0 10px 20px rgba(15, 23, 42, 0.12)',
                    minHeight: '102px',
                  }}
                >
                  <div style={{ marginBottom: '10px', opacity: 0.95, display: 'inline-flex' }}>{metric.icon}</div>
                  <div
                    style={{
                      fontSize: '10px',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      color: 'rgba(255, 255, 255, 0.86)',
                      marginBottom: '3px',
                    }}
                  >
                    {metric.name}
                  </div>
                  <div style={{ fontSize: '21px', fontWeight: '700', color: 'white', marginBottom: '6px' }}>{metric.status}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.84)' }}>{metric.meta}</div>
                </Card>
              ))}
            </div>

            <Card style={{ padding: 0, marginBottom: '20px', overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                <h3 style={{ margin: 0, color: '#1f2937', fontSize: '16px', fontWeight: '600' }}>Component Health</h3>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '10px 16px', textAlign: 'left', color: '#6b7280', fontSize: '12px', fontWeight: '600' }}>Component</th>
                    <th style={{ padding: '10px 16px', textAlign: 'left', color: '#6b7280', fontSize: '12px', fontWeight: '600' }}>Status</th>
                    <th style={{ padding: '10px 16px', textAlign: 'left', color: '#6b7280', fontSize: '12px', fontWeight: '600' }}>Uptime</th>
                    <th style={{ padding: '10px 16px', textAlign: 'left', color: '#6b7280', fontSize: '12px', fontWeight: '600' }}>Avg Response Time</th>
                    <th style={{ padding: '10px 16px', textAlign: 'left', color: '#6b7280', fontSize: '12px', fontWeight: '600' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {components.map((comp) => (
                    <tr key={comp.name} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '14px 16px', color: '#374151', fontSize: '14px', fontWeight: '600' }}>{comp.name}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '14px', fontWeight: '600' }}>
                          <CircleCheck size={14} />
                          {comp.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#6b7280', fontSize: '14px' }}>{comp.uptime}</td>
                      <td style={{ padding: '14px 16px', color: '#6b7280', fontSize: '14px' }}>{comp.responseTime}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <button style={{ background: 'none', border: 'none', color: 'var(--spacespot-cyan-primary)', fontSize: '13px', fontWeight: '500', cursor: 'pointer', padding: 0 }}>
                          Monitor
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Card style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Clock3 size={16} color='var(--spacespot-cyan-primary)' />
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>Scheduled Maintenance</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ border: '1px solid #67e8f9', backgroundColor: '#ecfeff', borderRadius: '8px', padding: '10px 12px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>Database Optimization</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Scheduled: Sunday, 2:00 AM</div>
                  </div>
                  <div style={{ border: '1px solid #c4b5fd', backgroundColor: '#f5f3ff', borderRadius: '8px', padding: '10px 12px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>Security Patches</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Scheduled: Next Tuesday, 3:00 AM</div>
                  </div>
                </div>
              </Card>

              <Card style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Database size={16} color='var(--spacespot-success)' />
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>Backup Status</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ border: '1px solid #6ee7b7', backgroundColor: '#ecfdf5', borderRadius: '8px', padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>Last Full Backup</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>2 hours ago</div>
                    </div>
                    <CircleCheck size={16} color='#10b981' />
                  </div>
                  <div style={{ border: '1px solid #fcd34d', backgroundColor: '#fffbeb', borderRadius: '8px', padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>Next Scheduled</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>In 22 hours</div>
                    </div>
                    <CalendarDays size={16} color='#f59e0b' />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

