import React, { useEffect, useMemo, useState } from 'react';
import api from '../src/api/axios';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock3,
  Download,
  Eye,
  FileText,
  Pencil,
  Search,
  User,
} from 'lucide-react';

type LeaseStatus = 'Approved' | 'Pending' | 'Active' | 'Expired';

type Lease = {
  code: string;
  title: string;
  unit: string;
  customer: string;
  customerId: string;
  contact: string;
  period: string;
  amount: string;
  status: LeaseStatus;
};

const cardBase: React.CSSProperties = {
  backgroundColor: 'var(--spacespot-white)',
  borderRadius: '12px',
  border: '1px solid var(--spacespot-cyan-300)',
  boxShadow: '0 2px 10px rgba(15, 23, 42, 0.06)',
};

const statusStyle = (status: LeaseStatus): React.CSSProperties => {
  if (status === 'Approved') {
    return { backgroundColor: '#eafaf2', color: 'var(--spacespot-success)', border: '1px solid #b9e9d2' };
  }
  if (status === 'Pending') {
    return { backgroundColor: '#fff6e6', color: 'var(--spacespot-warning)', border: '1px solid #f6ddaa' };
  }
  if (status === 'Active') {
    return { backgroundColor: '#e8fbf7', color: '#0ea5a1', border: '1px solid #b6ece5' };
  }
  return { backgroundColor: '#fef2f2', color: 'var(--spacespot-error)', border: '1px solid #fecaca' };
};

export default function ManageLeases() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | LeaseStatus>('All');
  const [leases, setLeases] = useState<Lease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
  let active = true;

  const loadLeases = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/leases', {
        params: { limit: 100 }
      });

      const data = response.data?.data || response.data;
      const rows = Array.isArray(data)
        ? data
        : data?.leases || data?.rows || [];

      if (active) {
        setLeases(rows.map((lease: any) => {
          const status = lease.status === 'pending'
            ? 'Pending'
            : lease.status === 'approved'
              ? 'Approved'
              : lease.status === 'expired'
                ? 'Expired'
                : 'Active';

          return {
            code: String(lease.lease_reference ?? lease.code ?? lease.id ?? ''),
            title: status,
            unit: String(lease.unit?.unit_number ?? lease.unit_id ?? '-'),
            customer: String(lease.customer?.name ?? lease.customer?.contact_person ?? lease.customer_id ?? '-'),
            customerId: String(lease.customer_id ?? '-'),
            contact: String(lease.customer?.phone ?? lease.customer?.email ?? '-'),
            period: `${lease.start_date || '-'} - ${lease.end_date || '-'}`,
            amount: `${lease.currency || '$'}${lease.monthly_rent || 0} per month`,
            status,
          };
        }));
      }
    } catch (err) {
      console.error(err);
      if (active) setError('Failed to load leases');
    } finally {
      if (active) setLoading(false);
    }
  };

  loadLeases();

  return () => {
    active = false;
  };
}, []);

  const filtered = useMemo(() => {
    return leases.filter((lease) => {
      const query = search.toLowerCase();
      const matchesSearch = [lease.code, lease.customer, lease.unit].some((item) => item.toLowerCase().includes(query));
      const matchesFilter = filter === 'All' || lease.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [search, filter, leases]);

  const stats = useMemo(
    () => ({
      total: leases.length,
      approved: leases.filter((l) => l.status === 'Approved').length,
      pending: leases.filter((l) => l.status === 'Pending').length,
      active: leases.filter((l) => l.status === 'Active').length,
    }),
    [leases]
  );

  return (
    <div style={{ padding: '20px 22px 28px', backgroundColor: 'var(--spacespot-gray-50)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
        <div style={{ backgroundColor: '#f4f7fb', borderRadius: '14px', padding: '12px 12px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--spacespot-cyan-primary)',
                  display: 'grid',
                  placeItems: 'center',
                  boxShadow: '0 6px 10px rgba(20, 216, 204, 0.2)',
                }}
              >
                <FileText size={18} color="#ffffff" />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--spacespot-navy-primary)' }}>Manage Leases</div>
                <div style={{ fontSize: '11px', color: 'var(--spacespot-gray-500)' }}>View and manage all lease agreements</div>
              </div>
            </div>
            <div style={{ width: '86px', height: '2px', backgroundColor: 'var(--spacespot-cyan-primary)', marginTop: '12px', borderRadius: '999px' }} />
          </div>

          <button
            type="button"
            style={{
              height: '30px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: 'var(--spacespot-navy-primary)',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 600,
              padding: '0 12px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            All Spaces <ChevronDown size={13} />
          </button>
        </div>

        <div style={{ ...cardBase, padding: '10px', marginBottom: '10px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search size={13} color="var(--spacespot-gray-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Lease ID, Customer, or Unit..."
                style={{
                  width: '100%',
                  height: '34px',
                  border: '1px solid var(--spacespot-gray-300)',
                  borderRadius: '8px',
                  backgroundColor: 'var(--spacespot-white)',
                  fontSize: '11px',
                  color: 'var(--spacespot-navy-primary)',
                  padding: '0 12px 0 34px',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['All', 'Approved', 'Pending', 'Active', 'Expired'].map((item) => {
                const active = item === filter;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFilter(item as 'All' | LeaseStatus)}
                    style={{
                      border: 'none',
                      height: '28px',
                      borderRadius: '8px',
                      padding: '0 12px',
                      fontSize: '10px',
                      cursor: 'pointer',
                      backgroundColor: active ? 'var(--spacespot-cyan-primary)' : '#f4f7fb',
                      color: active ? '#ffffff' : 'var(--spacespot-gray-500)',
                      fontWeight: 600,
                    }}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '12px' }}>
          {[
            { label: 'Total Leases', value: stats.total, border: '#8be6df', icon: <FileText size={10} color="#16c8bd" /> },
            { label: 'Approved', value: stats.approved, border: '#8be6df', icon: <CheckCircle2 size={10} color="var(--spacespot-success)" /> },
            { label: 'Pending', value: stats.pending, border: '#f6d084', icon: <Clock3 size={10} color="var(--spacespot-warning)" /> },
            { label: 'Active', value: stats.active, border: '#8be6df', icon: <Circle size={10} color="var(--spacespot-success)" /> },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                ...cardBase,
                borderColor: stat.border,
                padding: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: '9px', color: 'var(--spacespot-gray-500)', marginBottom: '6px' }}>{stat.label}</div>
                <div style={{ fontSize: '27px', lineHeight: 1, color: 'var(--spacespot-navy-primary)', fontWeight: 500 }}>{stat.value}</div>
              </div>
              <div style={{ width: '24px', height: '24px', borderRadius: '8px', backgroundColor: '#eef6f8', display: 'grid', placeItems: 'center' }}>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gap: '10px' }}>
  {loading && (
    <div style={{ ...cardBase, padding: '18px', textAlign: 'center' }}>
      Loading leases...
    </div>
  )}

  {!loading && error && (
    <div style={{ ...cardBase, padding: '18px', textAlign: 'center', color: 'red' }}>
      {error}
    </div>
  )}

  {!loading && !error && filtered.length === 0 && (
    <div style={{ ...cardBase, padding: '18px', textAlign: 'center' }}>
      No leases found
    </div>
  )}

  {!loading && !error && filtered.map((lease) => (
            <div key={lease.code} style={{ ...cardBase, padding: '12px 14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '12px', alignItems: 'start' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '8px', backgroundColor: 'var(--spacespot-cyan-primary)', color: '#ffffff', display: 'grid', placeItems: 'center', fontSize: '8px', fontWeight: 700, marginTop: '2px' }}>
                  <FileText size={12} />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--spacespot-navy-primary)', fontWeight: 700 }}>{lease.code}</span>
                    <span style={{ ...statusStyle(lease.status), fontSize: '8px', borderRadius: '999px', padding: '2px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Circle size={6} /> {lease.title}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '10px' }}>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: 'var(--spacespot-gray-500)' }}><Building2 size={10} /> {lease.unit}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: 'var(--spacespot-gray-500)' }}><User size={10} /> {lease.customer}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: 'var(--spacespot-gray-500)' }}><FileText size={10} /> {lease.customerId}</span>
                    </div>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: 'var(--spacespot-gray-500)' }}><User size={10} /> {lease.contact}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: 'var(--spacespot-gray-500)' }}><Calendar size={10} /> {lease.period}</span>
                    </div>
                  </div>

                  <div style={{ fontSize: '10px', color: 'var(--spacespot-navy-primary)', fontWeight: 500 }}>{lease.amount}</div>
                </div>

                <div style={{ display: 'grid', gap: '6px', justifyItems: 'end', minWidth: '100px' }}>
                  <button
                    type="button"
                    style={{
                      border: 'none',
                      borderRadius: '999px',
                      backgroundColor: 'var(--spacespot-cyan-primary)',
                      color: '#ffffff',
                      fontSize: '8px',
                      height: '26px',
                      minWidth: '98px',
                      padding: '0 10px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    <Eye size={9} /> View Details
                  </button>

                  <button
                    type="button"
                    style={{
                      border: 'none',
                      borderRadius: '999px',
                      backgroundColor: lease.status === 'Pending' ? 'var(--spacespot-success)' : '#eef3f8',
                      color: lease.status === 'Pending' ? '#ffffff' : 'var(--spacespot-gray-500)',
                      fontSize: '8px',
                      height: '26px',
                      minWidth: '98px',
                      padding: '0 10px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    {lease.status === 'Pending' ? <CheckCircle2 size={9} /> : <Download size={9} />}{' '}
                    {lease.status === 'Pending' ? 'Approve' : 'Invoice'}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/manage/edit-lease/${encodeURIComponent(lease.code)}`, {
                        state: { lease },
                      })
                    }
                    style={{
                      border: '1px solid #d5e1ee',
                      borderRadius: '999px',
                      backgroundColor: '#ffffff',
                      color: 'var(--spacespot-gray-500)',
                      fontSize: '8px',
                      height: '26px',
                      minWidth: '98px',
                      padding: '0 10px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    <Pencil size={9} /> Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ ...cardBase, marginTop: '10px', padding: '9px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '8px', color: '#8a99aa' }}>Showing {filtered.length} of {leases.length} leases</span>
          <div style={{ display: 'flex', gap: '10px', fontSize: '8px' }}>
            <span style={{ color: 'var(--spacespot-success)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}><Circle size={7} fill="var(--spacespot-success)" /> Approved</span>
            <span style={{ color: 'var(--spacespot-warning)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}><Circle size={7} fill="var(--spacespot-warning)" /> Pending</span>
            <span style={{ color: 'var(--spacespot-error)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}><Circle size={7} fill="var(--spacespot-error)" /> Expired</span>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}



