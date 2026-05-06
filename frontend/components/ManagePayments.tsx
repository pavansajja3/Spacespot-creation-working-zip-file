import React, { useState } from 'react';
import { Button } from './ui/Button';

interface Payment {
  id: string;
  date: string;
  receivedFrom: string;
  unit: string;
  amount: number;
  method: string;
  status: 'completed' | 'pending' | 'late';
}

const MOCK_PAYMENTS: Payment[] = [
  { id: 'P001', date: '2024-01-10', receivedFrom: 'ABC Corp', unit: 'Unit 101', amount: 5000, method: 'Bank Transfer', status: 'completed' },
  { id: 'P002', date: '2024-01-05', receivedFrom: '123 Inc', unit: 'Unit 102', amount: 4000, method: 'Check', status: 'completed' },
  { id: 'P003', date: '2024-01-15', receivedFrom: 'XYZ Ltd', unit: 'Unit 201', amount: 6000, method: 'ACH', status: 'pending' },
  { id: 'P004', date: '2023-12-05', receivedFrom: 'Old Tenant', unit: 'Unit 202', amount: 5500, method: 'Credit Card', status: 'late' },
];

export default function ManagePayments() {
  const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.receivedFrom.toLowerCase().includes(searchTerm.toLowerCase()) || payment.unit.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || payment.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalCollected = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const totalLate = payments.filter(p => p.status === 'late').reduce((sum, p) => sum + p.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return { bg: '#d1fae5', color: 'var(--spacespot-success)' };
      case 'pending':
        return { bg: '#fef3c7', color: 'var(--spacespot-warning)' };
      case 'late':
        return { bg: '#fee2e2', color: 'var(--spacespot-error)' };
      default:
        return { bg: 'var(--spacespot-gray-100)', color: '#6b7280' };
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: 'var(--spacespot-gray-50)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>Manage Payments</h1>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>Track rent and payment collections</p>
          </div>
          <Button variant="primary" onClick={() => console.log('Log payment')}>+ Log Payment</Button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Total Collected', value: `$${totalCollected.toLocaleString()}`, color: 'var(--spacespot-success)' },
            { label: 'Pending', value: `$${totalPending.toLocaleString()}`, color: 'var(--spacespot-warning)' },
            { label: 'Late/Overdue', value: `$${totalLate.toLocaleString()}`, color: 'var(--spacespot-error)' },
          ].map((stat) => (
            <div key={stat.label} style={{ padding: '16px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', fontWeight: '500', textTransform: 'uppercase' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: stat.color }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ padding: '16px', marginBottom: '24px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px' }}>
            <input
              type="text"
              placeholder="Search by tenant or unit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '12px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              {['All', 'completed', 'pending', 'late'].map(status => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: selectedStatus === status ? '2px solid var(--spacespot-cyan-primary)' : '1px solid #e5e7eb',
                    backgroundColor: selectedStatus === status ? '#f0fffe' : '#ffffff',
                    color: selectedStatus === status ? 'var(--spacespot-cyan-primary)' : '#6b7280',
                    cursor: 'pointer',
                    fontWeight: selectedStatus === status ? '600' : '500',
                    fontSize: '12px',
                  }}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--spacespot-gray-50)', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>DATE</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>FROM</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>UNIT</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>AMOUNT</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>METHOD</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map(payment => {
                  const colors = getStatusColor(payment.status);
                  return (
                    <tr key={payment.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '12px 16px', fontSize: '13px', color: '#6b7280' }}>{payment.date}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '500', color: '#1f2937' }}>{payment.receivedFrom}</td>
                      <td style={{ padding: '12px 16px', fontSize: '12px', color: '#6b7280' }}>{payment.unit}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: 'var(--spacespot-cyan-primary)' }}>${payment.amount}</td>
                      <td style={{ padding: '12px 16px', fontSize: '12px', color: '#6b7280' }}>{payment.method}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'inline-block', padding: '4px 8px', borderRadius: '4px', backgroundColor: colors.bg, color: colors.color, fontSize: '11px', fontWeight: '500', textTransform: 'capitalize' }}>
                          {payment.status}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

