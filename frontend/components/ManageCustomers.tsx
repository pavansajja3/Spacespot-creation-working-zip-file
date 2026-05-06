import React, { useEffect, useMemo, useState } from 'react';
import api from '../src/api/axios';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  ChevronDown,
  CircleCheck,
  CircleDot,
  Clock3,
  Download,
  Eye,
  FolderSearch,
  Mail,
  Pencil,
  Phone,
  Search,
  Trash2,
  User,
  Plus,
} from 'lucide-react';

type CustomerStatus = 'Verified' | 'Pending' | 'Initiated';

type Customer = {
  id: string;
  brandName: string;
  ownerName: string;
  email: string;
  phone: string;
  category: string;
  level: string;
  status: CustomerStatus;
  joinedDate: string;
};


const cardBase: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  border: '1px solid #9fe5df',
  boxShadow: '0 1px 6px rgba(15, 23, 42, 0.08)',
};

const chipStyle = (status: CustomerStatus): React.CSSProperties => {
  if (status === 'Verified') {
    return { backgroundColor: '#eafaf2', color: 'var(--spacespot-success)', border: '1px solid #b9e9d2' };
  }
  if (status === 'Pending') {
    return { backgroundColor: '#fff6e6', color: 'var(--spacespot-warning)', border: '1px solid #f6ddaa' };
  }
  return { backgroundColor: '#edf2ff', color: '#3b82f6', border: '1px solid #c7d8ff' };
};

const levelStyle = (level: string): React.CSSProperties => {
  if (level === 'Premium') {
    return { backgroundColor: '#e8fbf7', color: '#0ea5a1', border: '1px solid #b6ece5' };
  }
  if (level === 'Small business') {
    return { backgroundColor: '#edf2ff', color: '#3b82f6', border: '1px solid #c7d8ff' };
  }
  return { backgroundColor: '#f3f5f8', color: '#64748b', border: '1px solid #e2e8f0' };
};

export default function ManageCustomers() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | CustomerStatus>('All');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
  let active = true;

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/customers', {
        params: { limit: 100 },
      });

      const data = response.data?.data || response.data;
      const rows = Array.isArray(data)
        ? data
        : data?.customers || data?.rows || [];

      if (active) {
        setCustomers(
          rows.map((customer: any) => ({
            id: String(customer.id ?? ''),
            brandName: String(customer.brand_name ?? customer.company_name ?? customer.name ?? '-'),
            ownerName: String(customer.contact_person ?? customer.owner_name ?? '-'),
            email: String(customer.email ?? '-'),
            phone: String(customer.phone ?? '-'),
            category: String(customer.category ?? customer.business_type ?? '-'),
            level: String(customer.level ?? customer.customer_level ?? 'Standard'),
            status:
              customer.status === 'verified'
                ? 'Verified'
                : customer.status === 'pending'
                  ? 'Pending'
                  : 'Initiated',
            joinedDate: customer.created_at
              ? new Date(customer.created_at).toLocaleDateString()
              : '-',
          }))
        );
      }
    } catch (err) {
      if (active) {
        console.error('Customers API error:', err);
        setError(
          (err as any)?.response?.data?.message ||
          'Failed to load customers'
        );
        setCustomers([]);
      }
    } finally {
      if (active) {
        setLoading(false);
      }
    }
  };

  loadCustomers();

  return () => {
    active = false;
  };
}, []);

  const filteredCustomers = useMemo(() => {
  return customers.filter((customer) => {
    const query = search.toLowerCase();

    const matchesSearch = [
      customer.brandName,
      customer.ownerName,
      customer.email,
      customer.category,
    ].some((item) => item.toLowerCase().includes(query));

    const matchesFilter = filter === 'All' || customer.status === filter;

    return matchesSearch && matchesFilter;
  });
}, [customers, search, filter]);

  const stats = useMemo(
  () => ({
    total: customers.length,
    verified: customers.filter((c) => c.status === 'Verified').length,
    pending: customers.filter((c) => c.status === 'Pending').length,
    initiated: customers.filter((c) => c.status === 'Initiated').length,
  }),
  [customers]
);
  return (
    <div style={{ padding: '10px 10px 20px', backgroundColor: '#eef2f6', minHeight: '100%' }}>
      <div style={{ maxWidth: '1060px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  backgroundColor: '#17cfc4',
                  display: 'grid',
                  placeItems: 'center',
                  boxShadow: '0 6px 10px rgba(20, 216, 204, 0.2)',
                }}
              >
                <User size={15} color="#ffffff" />
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--spacespot-navy-primary)' }}>Manage Customers</div>
                <div style={{ fontSize: '10px', color: 'var(--spacespot-gray-500)' }}>View and manage customer information</div>
              </div>
            </div>
            <div style={{ width: '86px', height: '2px', backgroundColor: 'var(--spacespot-cyan-primary)', marginTop: '10px' }} />
          </div>

          <div style={{ display: 'grid', justifyItems: 'end', gap: '8px' }}>
            <button
              type="button"
              style={{
                height: '24px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: 'var(--spacespot-navy-primary)',
                color: '#ffffff',
                fontSize: '9px',
                fontWeight: 600,
                padding: '0 10px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              All Spaces <ChevronDown size={10} />
            </button>
            <button
              type="button"
              onClick={() => navigate('/create/customer')}
              style={{
                height: '28px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: 'var(--spacespot-navy-primary)',
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: 600,
                padding: '0 12px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Plus size={10} /> Add New Customer
            </button>
          </div>
        </div>

        <div style={{ ...cardBase, padding: '10px' }}>

  {/* HEADER */}
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  }}>
    <div style={{
      fontSize: '12px',
      fontWeight: 700,
      color: 'var(--spacespot-navy-primary)'
    }}>
      Customer List ({filteredCustomers.length})
    </div>

    <button
      type="button"
      style={{
        border: 'none',
        height: '24px',
        borderRadius: '6px',
        backgroundColor: '#6e7f93',
        color: '#ffffff',
        fontSize: '9px',
        padding: '0 10px',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        cursor: 'pointer',
      }}
    >
      <Download size={10} /> Export
    </button>
  </div>

  {/* LOADING */}
  {loading && (
    <div style={{
      padding: '24px 0',
      textAlign: 'center',
      fontSize: '10px',
      color: '#92a2b4'
    }}>
      Loading customers...
    </div>
  )}

  {/* ERROR */}
  {error && !loading && (
    <div style={{
      padding: '24px 0',
      textAlign: 'center',
      fontSize: '10px',
      color: 'red'
    }}>
      {error}
    </div>
  )}

  {/* TABLE */}
{!loading && !error && (
  <div style={{ overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
      <thead>
        <tr>
          <th style={{ fontSize: '8px', padding: '8px' }}>CUSTOMER</th>
          <th style={{ fontSize: '8px', padding: '8px' }}>CONTACT</th>
          <th style={{ fontSize: '8px', padding: '8px' }}>CATEGORY</th>
          <th style={{ fontSize: '8px', padding: '8px' }}>LEVEL</th>
          <th style={{ fontSize: '8px', padding: '8px' }}>STATUS</th>
          <th style={{ fontSize: '8px', padding: '8px' }}>JOINED</th>
          <th style={{ fontSize: '8px', padding: '8px' }}>ACTIONS</th>
        </tr>
      </thead>

      <tbody>
        {filteredCustomers.map((customer) => (
          <tr key={customer.id}>
            <td>
              <div>
                <div style={{ fontWeight: 600 }}>{customer.brandName}</div>
                <div style={{ fontSize: '10px', color: '#95a4b5' }}>
                  {customer.ownerName}
                </div>
              </div>
            </td>

            <td>
              <div style={{ fontSize: '10px' }}>
                <div>{customer.email}</div>
                <div>{customer.phone}</div>
              </div>
            </td>

            <td>{customer.category}</td>
            <td>{customer.level}</td>
            <td>{customer.status}</td>
            <td>{customer.joinedDate}</td>

            <td>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <button onClick={() => console.log('view', customer.id)}>
                  <Eye size={12} />
                </button>

                <button
                  onClick={() => navigate(`/manage/edit-customer/${customer.id}`)
                  }
                >
                  <Pencil size={12} />
                </button>

                <button onClick={() => console.log('delete', customer.id)}>
                  <Trash2 size={12} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

{/* EMPTY */}
{!loading && !error && filteredCustomers.length === 0 && (
  <div style={{ padding: '24px 0', textAlign: 'center' }}>
    No customers found
  </div>
)}

        </div>
      </div>
    </div>
  );
}

