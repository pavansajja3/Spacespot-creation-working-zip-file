import React, { useState } from 'react';
import { Button } from './ui/Button';

interface Booking {
  id: string;
  date: string;
  unit: string;
  visitor: string;
  timeSlot: string;
  purpose: string;
  status: 'confirmed' | 'pending' | 'completed';
}

const MOCK_BOOKINGS: Booking[] = [
  { id: 'B001', date: '2024-01-15', unit: 'Unit 101', visitor: 'John Smith', timeSlot: '10:00 - 11:00 AM', purpose: 'Facility Tour', status: 'confirmed' },
  { id: 'B002', date: '2024-01-16', unit: 'Unit 201', visitor: 'Sarah Johnson', timeSlot: '2:00 - 3:00 PM', purpose: 'Lease Discussion', status: 'pending' },
  { id: 'B003', date: '2024-01-10', unit: 'Unit 102', visitor: 'Mike Chen', timeSlot: '11:00 AM - 12:00 PM', purpose: 'Inspection', status: 'completed' },
];

export default function ManageBookings() {
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.visitor.toLowerCase().includes(searchTerm.toLowerCase()) || booking.unit.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || booking.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { bg: '#d1fae5', color: 'var(--spacespot-success)' };
      case 'pending':
        return { bg: '#fef3c7', color: 'var(--spacespot-warning)' };
      case 'completed':
        return { bg: '#f0fffe', color: 'var(--spacespot-cyan-primary)' };
      default:
        return { bg: 'var(--spacespot-gray-100)', color: '#6b7280' };
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: 'var(--spacespot-gray-50)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>Manage Visitor Bookings</h1>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>Schedule and track facility visits</p>
          </div>
          <Button variant="primary" onClick={() => console.log('New booking')}>+ New Booking</Button>
        </div>

        <div style={{ padding: '16px', marginBottom: '24px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px' }}>
            <input
              type="text"
              placeholder="Search by visitor or unit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '12px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              {['All', 'confirmed', 'pending', 'completed'].map(status => (
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

        <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--spacespot-gray-50)', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>DATE</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>VISITOR</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>UNIT</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>TIME</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>PURPOSE</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>STATUS</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map(booking => {
                  const colors = getStatusColor(booking.status);
                  return (
                    <tr key={booking.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '12px 16px', fontSize: '13px', color: '#6b7280' }}>{booking.date}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '500', color: '#1f2937' }}>{booking.visitor}</td>
                      <td style={{ padding: '12px 16px', fontSize: '12px', color: '#6b7280' }}>{booking.unit}</td>
                      <td style={{ padding: '12px 16px', fontSize: '12px', color: '#6b7280' }}>{booking.timeSlot}</td>
                      <td style={{ padding: '12px 16px', fontSize: '12px', color: '#6b7280' }}>{booking.purpose}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'inline-block', padding: '4px 8px', borderRadius: '4px', backgroundColor: colors.bg, color: colors.color, fontSize: '11px', fontWeight: '500', textTransform: 'capitalize' }}>
                          {booking.status}
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px' }}>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--spacespot-cyan-primary)', fontWeight: '500' }}>View</button>
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

