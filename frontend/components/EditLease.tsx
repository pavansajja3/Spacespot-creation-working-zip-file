import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Bell,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock3,
  CreditCard,
  FileCheck,
  FileText,
  Info,
  Search,
} from 'lucide-react';

type LeaseStatus = 'Approved' | 'Pending' | 'Active' | 'Expired';

type LeaseNavState = {
  lease?: {
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
};

type LeaseFormData = {
  leaseId: string;
  leaseForUnitId: string;
  leasedTo: string;
  leasePrice: string;
  leasePeriodCount: string;
  leasePeriodUnit: string;
  leaseStartDate: string;
  leaseEndDate: string;
  spaceTncStatus: 'Accepted' | 'Pending';
  privacyAuthStatus: 'Received' | 'Pending';
  pliStatus: 'Received' | 'Pending';
  pliValidAmount: string;
  pliValidUntil: string;
  leaseInvoicePeriod: string;
  advancePaymentReceived: 'Yes' | 'No';
  paymentStatus: 'Received' | 'Pending';
  monthlyPaymentStatus: 'On Track' | 'At Risk';
};

const sectionCard: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1.5px solid #9fe5df',
  borderRadius: '8px',
  padding: '9px',
};

const leaseDetailsCard: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1.5px solid #6f7b8d',
  borderRadius: '10px',
  padding: '10px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '10px',
  color: 'var(--spacespot-navy-primary)',
  marginBottom: '6px',
  display: 'block',
  fontWeight: 600,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: '30px',
  border: '1px solid #7f8ea1',
  borderRadius: '4px',
  backgroundColor: '#ffffff',
  fontSize: '10px',
  color: '#203249',
  padding: '0 8px',
  boxSizing: 'border-box',
};

export default function EditLease() {
  const navigate = useNavigate();
  const location = useLocation();
  const { leaseId = 'LEASE-001' } = useParams();
  const navState = location.state as LeaseNavState | undefined;
  const selectedLease = navState?.lease;

  const derivedPeriod = selectedLease?.period?.split(' - ') || ['03/03/2024', '03/03/2027'];

  const initialForm = useMemo<LeaseFormData>(
    () => ({
      leaseId: selectedLease?.code || leaseId,
      leaseForUnitId: selectedLease?.unit || 'BEACH-L1-U2',
      leasedTo: selectedLease?.customer || 'ABC Phones',
      leasePrice: selectedLease?.amount || '$1200 per day',
      leasePeriodCount: '3',
      leasePeriodUnit: 'Year',
      leaseStartDate: derivedPeriod[0] || '03/03/2024',
      leaseEndDate: derivedPeriod[1] || '03/03/2027',
      spaceTncStatus: 'Accepted',
      privacyAuthStatus: 'Pending',
      pliStatus: 'Received',
      pliValidAmount: '$10,000',
      pliValidUntil: '03/03/2027',
      leaseInvoicePeriod: 'Weekly',
      advancePaymentReceived: 'No',
      paymentStatus: 'Pending',
      monthlyPaymentStatus: 'At Risk',
    }),
    [selectedLease, leaseId, derivedPeriod],
  );

  const [form, setForm] = useState<LeaseFormData>(initialForm);

  useEffect(() => {
    setForm(initialForm);
  }, [initialForm]);

  const updateField = <K extends keyof LeaseFormData>(key: K, value: LeaseFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const summaryItems = [
    { label: "Space T&C's", value: form.spaceTncStatus },
    { label: 'Privacy & Auth', value: form.privacyAuthStatus },
    { label: 'PLI', value: form.pliStatus },
    { label: 'Advance Payment', value: form.advancePaymentReceived === 'Yes' ? 'Received' : 'Pending' },
    { label: 'Monthly Payment', value: form.paymentStatus },
  ];

  const statusColor = (value: string) => {
    if (value === 'Accepted' || value === 'Received') {
      return 'var(--spacespot-success)';
    }
    return 'var(--spacespot-warning)';
  };

  return (
    <div style={{ padding: '12px 10px 20px', backgroundColor: '#eef2f6', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1060px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
          <button
            type="button"
            style={{
              border: '1px solid #d0dae5',
              backgroundColor: '#1e2f46',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '11px',
              height: '28px',
              padding: '0 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            All Spaces <ChevronDown size={13} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '10px', alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: '7px', paddingRight: '246px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2px' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  backgroundColor: '#1fc8bf',
                  display: 'grid',
                  placeItems: 'center',
                  boxShadow: '0 6px 10px rgba(20, 216, 204, 0.2)',
                }}
              >
                <FileText size={15} color="#ffffff" />
              </div>
              <div>
                <div style={{ fontSize: '20px', color: 'var(--spacespot-navy-primary)', fontWeight: 700, lineHeight: 1.1 }}>Edit Lease</div>
                <div style={{ fontSize: '9px', color: 'var(--spacespot-gray-500)', marginTop: '1px' }}>Update lease agreement information</div>
              </div>
            </div>

            <div style={leaseDetailsCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '12px' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '6px', backgroundColor: '#dff9f7', display: 'grid', placeItems: 'center' }}>
                  <Calendar size={10} color="var(--spacespot-cyan-primary)" />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--spacespot-navy-primary)' }}>Lease Details</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px 12px' }}>
                <div>
                  <label style={labelStyle}>Lease ID *</label>
                  <input style={inputStyle} value={form.leaseId} onChange={(e) => updateField('leaseId', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Lease For (Unit ID) *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '6px' }}>
                    <input style={inputStyle} value={form.leaseForUnitId} onChange={(e) => updateField('leaseForUnitId', e.target.value)} />
                    <button type="button" style={{ height: '30px', border: 'none', borderRadius: '4px', backgroundColor: '#6b7788', color: '#ffffff', fontSize: '9px', padding: '0 10px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      <Search size={11} /> Lookup
                    </button>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Leased To *</label>
                  <input style={inputStyle} value={form.leasedTo} onChange={(e) => updateField('leasedTo', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Lease Price</label>
                  <input style={inputStyle} value={form.leasePrice} onChange={(e) => updateField('leasePrice', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Lease Period</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    <input style={inputStyle} value={form.leasePeriodCount} onChange={(e) => updateField('leasePeriodCount', e.target.value)} />
                    <select style={inputStyle} value={form.leasePeriodUnit} onChange={(e) => updateField('leasePeriodUnit', e.target.value)}>
                      <option>Week</option>
                      <option>Month</option>
                      <option>Year</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Lease Start Date</label>
                  <input style={inputStyle} value={form.leaseStartDate} onChange={(e) => updateField('leaseStartDate', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Lease End Date</label>
                  <input style={inputStyle} value={form.leaseEndDate} onChange={(e) => updateField('leaseEndDate', e.target.value)} />
                </div>
              </div>
            </div>

            <div style={sectionCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '5px', backgroundColor: '#dff9f7', display: 'grid', placeItems: 'center' }}>
                  <FileCheck size={9} color="var(--spacespot-cyan-primary)" />
                </div>
                <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--spacespot-navy-primary)' }}>Terms & Conditions Documents</span>
              </div>

              <div style={{ display: 'grid', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '8px', color: 'var(--spacespot-navy-primary)', fontWeight: 600 }}>Space T&C's (Guidelines)</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', backgroundColor: '#f2f4f7', borderRadius: '999px', padding: '2px' }}>
                  {['Accepted', 'Pending'].map((status) => {
                    const active = form.spaceTncStatus === status;
                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => updateField('spaceTncStatus', status as 'Accepted' | 'Pending')}
                        style={{
                          border: 'none',
                          borderRadius: '999px',
                          height: '18px',
                          fontSize: '7px',
                          cursor: 'pointer',
                          backgroundColor: active ? (status === 'Accepted' ? 'var(--spacespot-success)' : '#e5e7eb') : 'transparent',
                          color: active ? '#ffffff' : 'var(--spacespot-gray-400)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '3px',
                        }}
                      >
                        <Clock3 size={7} color={active ? '#ffffff' : 'var(--spacespot-gray-400)'} /> {status}
                      </button>
                    );
                  })}
                </div>

                <div>
                  <label style={{ ...labelStyle, fontSize: '8px', marginBottom: '4px' }}>Privacy & Authorisation</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', backgroundColor: '#f2f4f7', borderRadius: '999px', padding: '2px' }}>
                    {['Accepted', 'Pending'].map((status) => {
                      const active = (status === 'Accepted' ? 'Received' : 'Pending') === form.privacyAuthStatus;
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => updateField('privacyAuthStatus', status === 'Accepted' ? 'Received' : 'Pending')}
                          style={{
                            border: 'none',
                            borderRadius: '999px',
                            height: '18px',
                            fontSize: '7px',
                            cursor: 'pointer',
                            backgroundColor: active ? (status === 'Accepted' ? '#e5e7eb' : 'var(--spacespot-warning)') : 'transparent',
                            color: active ? '#ffffff' : 'var(--spacespot-gray-400)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '3px',
                          }}
                        >
                          <Clock3 size={7} color={active ? '#ffffff' : 'var(--spacespot-gray-400)'} /> {status}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', alignItems: 'end' }}>
                  <div>
                    <label style={{ ...labelStyle, fontSize: '8px', marginBottom: '4px' }}>Unit Terms & Conditions</label>
                    <button type="button" style={{ ...inputStyle, height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '6px', backgroundColor: '#ffffff', color: '#7f8ea1' }}>
                      <CheckCircle2 size={9} color="var(--spacespot-cyan-primary)" /> Upload Signed Copy
                    </button>
                  </div>
                  <span style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1px solid var(--spacespot-success)', color: 'var(--spacespot-success)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={10} />
                  </span>
                </div>

                <div>
                  <label style={{ ...labelStyle, fontSize: '8px', marginBottom: '4px' }}>Lease confirmation form</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', alignItems: 'end' }}>
                    <button type="button" style={{ ...inputStyle, height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '6px', backgroundColor: '#ffffff', color: '#7f8ea1' }}>
                      <CheckCircle2 size={9} color="var(--spacespot-cyan-primary)" /> Upload Signed Copy
                    </button>
                    <span style={{ fontSize: '7px', color: 'var(--spacespot-gray-400)', backgroundColor: '#f3f4f6', borderRadius: '4px', padding: '4px 8px', lineHeight: 1 }}>Not yet</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={sectionCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '5px', backgroundColor: '#dff9f7', display: 'grid', placeItems: 'center' }}>
                  <CreditCard size={9} color="var(--spacespot-cyan-primary)" />
                </div>
                <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--spacespot-navy-primary)' }}>Payment</span>
              </div>

              <div style={{ display: 'grid', gap: '8px' }}>
                <div>
                  <label style={{ ...labelStyle, fontSize: '8px', marginBottom: '4px' }}>PLI</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', backgroundColor: '#f2f4f7', borderRadius: '999px', padding: '2px' }}>
                    {['Received', 'Pending'].map((status) => {
                      const active = form.pliStatus === status;
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => updateField('pliStatus', status as 'Received' | 'Pending')}
                          style={{
                            border: 'none',
                            borderRadius: '999px',
                            height: '18px',
                            fontSize: '7px',
                            cursor: 'pointer',
                            backgroundColor: active ? (status === 'Received' ? 'var(--spacespot-success)' : 'var(--spacespot-warning)') : 'transparent',
                            color: active ? '#ffffff' : 'var(--spacespot-gray-400)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '3px',
                          }}
                        >
                          {!active && <Clock3 size={7} />} {status}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {form.pliStatus === 'Received' && (
                  <div style={{ border: '1px solid #14D8CC', borderRadius: '6px', padding: '8px', backgroundColor: '#d9edf0' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      <input style={{ ...inputStyle, height: '24px', fontSize: '8px' }} value={form.pliValidAmount} onChange={(e) => updateField('pliValidAmount', e.target.value)} />
                      <input style={{ ...inputStyle, height: '24px', fontSize: '8px' }} value={form.pliValidUntil} onChange={(e) => updateField('pliValidUntil', e.target.value)} />
                    </div>
                  </div>
                )}

                <div>
                  <label style={{ ...labelStyle, fontSize: '8px', marginBottom: '4px' }}>Lease Invoice Period</label>
                  <select style={{ ...inputStyle, height: '26px', fontSize: '8px' }} value={form.leaseInvoicePeriod} onChange={(e) => updateField('leaseInvoicePeriod', e.target.value)}>
                    <option>Weekly</option>
                    <option>Monthly</option>
                    <option>Quarterly</option>
                  </select>
                </div>

                <div style={{ backgroundColor: '#f3f5f8', borderRadius: '6px', padding: '8px' }}>
                  <div style={{ fontSize: '8px', color: 'var(--spacespot-navy-primary)', marginBottom: '5px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <Bell size={8} color="var(--spacespot-cyan-primary)" /> Manual Setup Email Reminder to Customer
                  </div>
                  <div style={{ fontSize: '7px', color: 'var(--spacespot-gray-500)', lineHeight: 1.35 }}>A week before the payment date</div>
                </div>

                <div>
                  <label style={{ ...labelStyle, fontSize: '8px', marginBottom: '4px' }}>Advance Payment Received</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', backgroundColor: '#f2f4f7', borderRadius: '999px', padding: '2px' }}>
                    {['Yes', 'No'].map((status) => {
                      const active = form.advancePaymentReceived === status;
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => updateField('advancePaymentReceived', status as 'Yes' | 'No')}
                          style={{
                            border: 'none',
                            borderRadius: '999px',
                            height: '18px',
                            fontSize: '7px',
                            cursor: 'pointer',
                            backgroundColor: active ? (status === 'Yes' ? 'var(--spacespot-success)' : 'var(--spacespot-warning)') : 'transparent',
                            color: active ? '#ffffff' : 'var(--spacespot-gray-400)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '3px',
                          }}
                        >
                          {!active && <Clock3 size={7} />} {status}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label style={{ ...labelStyle, fontSize: '8px', marginBottom: '4px' }}>Active Payment Received</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', backgroundColor: '#f2f4f7', borderRadius: '999px', padding: '2px' }}>
                    {['Received', 'Pending'].map((status) => {
                      const active = form.paymentStatus === status;
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => updateField('paymentStatus', status as 'Received' | 'Pending')}
                          style={{
                            border: 'none',
                            borderRadius: '999px',
                            height: '18px',
                            fontSize: '7px',
                            cursor: 'pointer',
                            backgroundColor: active ? (status === 'Received' ? 'var(--spacespot-success)' : 'var(--spacespot-warning)') : 'transparent',
                            color: active ? '#ffffff' : 'var(--spacespot-gray-400)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '3px',
                          }}
                        >
                          {!active && <Clock3 size={7} />} {status}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', paddingTop: '2px' }}>
              <button
                type="button"
                onClick={() => navigate('/manage/leases')}
                style={{ border: '1px solid #cdd7e3', backgroundColor: '#f8fafd', borderRadius: '6px', color: '#4d5f75', fontSize: '10px', height: '26px', minWidth: '68px', padding: '0 14px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                style={{ border: 'none', backgroundColor: 'var(--spacespot-navy-primary)', borderRadius: '6px', color: '#ffffff', fontSize: '10px', height: '26px', minWidth: '112px', padding: '0 16px', cursor: 'pointer' }}
              >
                Edit Lease
              </button>
            </div>
          </div>

          <aside
            style={{
              position: 'fixed',
              top: '96px',
              right: '32px',
              width: '230px',
              maxHeight: 'calc(100vh - 112px)',
              overflowY: 'auto',
              paddingRight: '4px',
              zIndex: 20,
              display: 'grid',
              gap: '10px',
            }}
          >
            <div style={{ ...sectionCard, padding: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '6px', backgroundColor: '#dff9f7', display: 'grid', placeItems: 'center' }}>
                  <FileText size={9} color="var(--spacespot-cyan-primary)" />
                </div>
                <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--spacespot-navy-primary)' }}>Lease Summary</span>
              </div>

              <div style={{ backgroundColor: '#d9edf0', borderRadius: '6px', padding: '8px', marginBottom: '8px' }}>
                <div style={{ fontSize: '7px', color: 'var(--spacespot-gray-500)' }}>Lease ID</div>
                <div style={{ fontSize: '9px', color: 'var(--spacespot-navy-primary)', fontWeight: 700 }}>{form.leaseId}</div>
              </div>

              <div style={{ display: 'grid', gap: '5px', marginBottom: '8px' }}>
                <div style={{ fontSize: '8px', color: '#8fa0b2' }}>{form.leasedTo}</div>
                <div style={{ fontSize: '7px', color: '#8fa0b2' }}>{form.leaseForUnitId}</div>
                <div style={{ fontSize: '7px', color: '#8fa0b2' }}>{form.leasePrice}</div>
              </div>

              <div style={{ height: '1px', backgroundColor: '#e4edf5', margin: '7px 0' }} />
              <div style={{ fontSize: '8px', color: 'var(--spacespot-gray-500)', marginBottom: '5px' }}>Document Status</div>
              <div style={{ display: 'grid', gap: '5px', marginBottom: '8px' }}>
                {summaryItems.map((item) => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '6px', color: 'var(--spacespot-gray-500)' }}>{item.label}</span>
                    <span style={{ fontSize: '6px', color: statusColor(item.value), minWidth: '50px', justifyContent: 'flex-end', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <Clock3 size={8} color={statusColor(item.value)} /> {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ height: '1px', backgroundColor: '#e4edf5', margin: '7px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: '#7f8ea1', marginBottom: '5px' }}>
                <span>Payment Status</span>
                <span style={{ color: form.paymentStatus === 'Received' ? 'var(--spacespot-success)' : 'var(--spacespot-warning)', fontWeight: 700 }}>{form.paymentStatus}</span>
              </div>
              <div style={{ height: '5px', backgroundColor: '#edf2f7', borderRadius: '999px', overflow: 'hidden', marginBottom: '10px' }}>
                <div style={{ width: form.paymentStatus === 'Received' ? '100%' : '60%', height: '100%', backgroundColor: 'var(--spacespot-cyan-primary)' }} />
              </div>

              <button
                type="button"
                style={{ width: '100%', border: 'none', borderRadius: '6px', backgroundColor: 'var(--spacespot-navy-primary)', color: '#ffffff', fontSize: '9px', height: '34px', cursor: 'pointer', fontWeight: 600 }}
              >
                Edit Lease
              </button>
            </div>

            <div style={{ ...sectionCard, padding: '8px', backgroundColor: '#f8fbfd' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                <Info size={9} color="var(--spacespot-cyan-primary)" />
                <span style={{ fontSize: '8px', fontWeight: 600, color: 'var(--spacespot-navy-primary)' }}>Required Fields</span>
              </div>
              <div style={{ fontSize: '7px', color: '#8a99aa', lineHeight: 1.45 }}>
                Lease ID, Unit ID, lease dates, and customer details should be reviewed before saving.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
