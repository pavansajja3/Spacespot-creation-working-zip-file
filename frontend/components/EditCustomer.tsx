import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../src/api/axios';
import {
  Building2,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  FileText,
  Info,
  Mail,
  Phone,
  Upload,
  User,
} from 'lucide-react';

type CustomerStatus = 'Verified' | 'Pending' | 'Initiated';

type CustomerNavState = {
  customer?: {
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
};

type CustomerFormData = {
  customerBrandName: string;
  brandCategory: string;
  ownerName: string;
  referenceName: string;
  customerLevel: string;
  email: string;
  primaryPhone: string;
  secondaryPhone: string;
  businessWebsite: string;
  preferredSpaceUnit: string;
  proposedUsage: string;
  address1: string;
  brandLogo: string;
  abn: string;
  acn: string;
  verificationStatus: CustomerStatus;
  paymentMethod: string;
  paymentFrequency: string;
  invoiceStartDate: string;
  securityDeposit: string;
  billingAddress: string;
  gstEligible: string;
  taxAuthorityType: string;
  leaseStartDate: string;
  insuranceCheckStatus: string;
  identityCheckStatus: string;
  financialCheckStatus: string;
  tcAcceptanceStatus: string;
  advancePaymentStatus: string;
};

const sectionCard: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1.5px solid #9fe5df',
  borderRadius: '8px',
  padding: '9px',
};

const customerDetailsLabelStyle: React.CSSProperties = {
  fontSize: '10px',
  color: '#243447',
  marginBottom: '6px',
  display: 'block',
  fontWeight: 600,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: '30px',
  border: '1px solid #9fb0c4',
  borderRadius: '4px',
  backgroundColor: '#ffffff',
  fontSize: '10px',
  color: '#203249',
  padding: '0 8px',
  boxSizing: 'border-box',
};

export default function EditCustomer() {
  const navigate = useNavigate();
  const location = useLocation();
  const { customerId = 'A' } = useParams();
  const navState = location.state as CustomerNavState | undefined;
  const selectedCustomer = navState?.customer;

  const initialForm = useMemo<CustomerFormData>(() => ({
    customerBrandName: selectedCustomer?.brandName || 'ABC Customer',
    brandCategory: selectedCustomer?.category || 'Retail',
    ownerName: selectedCustomer?.ownerName || 'John Phillip',
    referenceName: 'Mark Taylor',
    customerLevel: selectedCustomer?.level || 'Premium',
    email: selectedCustomer?.email || 'admin@abccustomer.com',
    primaryPhone: selectedCustomer?.phone || '412356789',
    secondaryPhone: '412356781',
    businessWebsite: 'www.abccustomer.com',
    preferredSpaceUnit: 'BEACH-L1-U1',
    proposedUsage: 'Retail Store',
    address1: '20 Bond Street Canberra ACT-1000',
    brandLogo: '',
    abn: '3456789012',
    acn: '2345678901',
    verificationStatus: selectedCustomer?.status || 'Verified',
    paymentMethod: 'Email card',
    paymentFrequency: 'Weekly',
    invoiceStartDate: 'MAR-11-2026',
    securityDeposit: '$500',
    billingAddress: '20 Bond Street Canberra ACT-1000',
    gstEligible: 'Yes',
    taxAuthorityType: 'GST 10%',
    leaseStartDate: 'MAR-11-2026',
    insuranceCheckStatus: 'Initiate',
    identityCheckStatus: 'Pending',
    financialCheckStatus: 'Verified',
    tcAcceptanceStatus: 'Initiate',
    advancePaymentStatus: 'Initiate',
  }), [selectedCustomer]);

  const [form, setForm] = useState<CustomerFormData>(initialForm);

  useEffect(() => {
    setForm(initialForm);
  }, [initialForm]);

  const updateField = (key: keyof CustomerFormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const completion = useMemo(() => {
    const values = [
      form.customerBrandName,
      form.brandCategory,
      form.ownerName,
      form.customerLevel,
      form.email,
      form.primaryPhone,
      form.businessWebsite,
      form.preferredSpaceUnit,
      form.address1,
      form.abn,
      form.acn,
      form.paymentMethod,
      form.paymentFrequency,
      form.invoiceStartDate,
      form.securityDeposit,
      form.billingAddress,
      form.gstEligible,
      form.taxAuthorityType,
      form.leaseStartDate,
    ];
    const filled = values.filter((value) => value.trim().length > 0).length;
    return Math.round((filled / values.length) * 100);
  }, [form]);

  const statusChipStyle = (status: string): React.CSSProperties => {
    if (status === 'Verified') {
      return { backgroundColor: '#eafaf2', color: 'var(--spacespot-success)' };
    }
    if (status === 'Pending') {
      return { backgroundColor: '#fff4e5', color: 'var(--spacespot-warning)' };
    }
    return { backgroundColor: '#edf2ff', color: '#2f6df6' };
  };
  const handleSaveChanges = async () => {
  try {
    await api.put(`/customers/${customerId}`, {
      company_name: form.customerBrandName,
      contact_person: form.ownerName,
      email: form.email,
      phone: form.primaryPhone,
      address: form.address1,
      website: form.businessWebsite,
      tax_id: form.abn,
      status: 'active',
    });

    toast.success('Customer changes saved');
    navigate('/manage/customers');
  } catch (error: any) {
    console.error('Update customer error:', error);
    toast.error(error?.response?.data?.message || 'Failed to save changes');
  }
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
          <div style={{ display: 'grid', gap: '7px', paddingRight: '242px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0' }}>
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
                <User size={15} color="#ffffff" />
              </div>
              <div>
                <div style={{ fontSize: '20px', color: 'var(--spacespot-navy-primary)', fontWeight: 700, lineHeight: 1.1 }}>
                  Edit Customer
                </div>
                <div style={{ fontSize: '8px', color: '#8fa0b2', marginTop: '1px' }}>
                  Update customer information and payment details
                </div>
              </div>
            </div>

            <div style={sectionCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '14px' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '6px', backgroundColor: '#dff9f7', display: 'grid', placeItems: 'center' }}>
                  <Building2 size={10} color="var(--spacespot-cyan-primary)" />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--spacespot-navy-primary)', lineHeight: 1 }}>Customer Details</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 12px' }}>
                <div>
                  <label style={customerDetailsLabelStyle}>Customer Brand Name *</label>
                  <input style={inputStyle} value={form.customerBrandName} onChange={(e) => updateField('customerBrandName', e.target.value)} />
                </div>
                <div>
                  <label style={customerDetailsLabelStyle}>Brand Category</label>
                  <select style={inputStyle} value={form.brandCategory} onChange={(e) => updateField('brandCategory', e.target.value)}>
                    <option>Retail</option>
                    <option>Telecommunication</option>
                    <option>Food & Beverage</option>
                    <option>Health & Wellness</option>
                  </select>
                </div>

                <div>
                  <label style={customerDetailsLabelStyle}>Owner Name *</label>
                  <input style={inputStyle} value={form.ownerName} onChange={(e) => updateField('ownerName', e.target.value)} />
                </div>
                <div>
                  <label style={customerDetailsLabelStyle}>Reference/Responsible Name</label>
                  <input style={inputStyle} value={form.referenceName} onChange={(e) => updateField('referenceName', e.target.value)} />
                </div>

                <div>
                  <label style={customerDetailsLabelStyle}>Customer Level</label>
                  <input style={inputStyle} value={form.customerLevel} onChange={(e) => updateField('customerLevel', e.target.value)} />
                </div>
                <div>
                  <label style={customerDetailsLabelStyle}>Email *</label>
                  <input style={inputStyle} value={form.email} onChange={(e) => updateField('email', e.target.value)} />
                </div>

                <div>
                  <label style={customerDetailsLabelStyle}>Phone Number (Primary)</label>
                  <input style={inputStyle} value={form.primaryPhone} onChange={(e) => updateField('primaryPhone', e.target.value)} />
                </div>
                <div>
                  <label style={customerDetailsLabelStyle}>Phone Number (Secondary)</label>
                  <input style={inputStyle} value={form.secondaryPhone} onChange={(e) => updateField('secondaryPhone', e.target.value)} />
                </div>

                <div>
                  <label style={customerDetailsLabelStyle}>Business Website</label>
                  <input style={inputStyle} value={form.businessWebsite} onChange={(e) => updateField('businessWebsite', e.target.value)} />
                </div>
                <div>
                  <label style={customerDetailsLabelStyle}>Preferred Space-Unit</label>
                  <input style={inputStyle} value={form.preferredSpaceUnit} onChange={(e) => updateField('preferredSpaceUnit', e.target.value)} />
                </div>

                <div>
                  <label style={customerDetailsLabelStyle}>Proposed Usage of the Unit</label>
                  <input style={inputStyle} value={form.proposedUsage} onChange={(e) => updateField('proposedUsage', e.target.value)} />
                </div>
                <div />

                <div style={{ gridColumn: '1 / span 2' }}>
                  <label style={customerDetailsLabelStyle}>Address</label>
                  <input style={inputStyle} value={form.address1} onChange={(e) => updateField('address1', e.target.value)} />
                </div>

                <div>
                  <label style={customerDetailsLabelStyle}>Brand Logo</label>
                  <button type="button" style={{ ...inputStyle, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '6px', cursor: 'pointer', backgroundColor: '#f8fbfd' }}>
                    <Upload size={11} color="var(--spacespot-cyan-primary)" /> Upload image
                  </button>
                </div>
              </div>
            </div>

            <div style={sectionCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '6px', backgroundColor: '#dff9f7', display: 'grid', placeItems: 'center' }}>
                  <FileText size={10} color="var(--spacespot-cyan-primary)" />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--spacespot-navy-primary)' }}>Legal</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px 12px' }}>
                <div>
                  <label style={customerDetailsLabelStyle}>ABN</label>
                  <input style={inputStyle} value={form.abn} onChange={(e) => updateField('abn', e.target.value)} />
                </div>
                <div>
                  <label style={customerDetailsLabelStyle}>ACN</label>
                  <input style={inputStyle} value={form.acn} onChange={(e) => updateField('acn', e.target.value)} />
                </div>

                <div style={{ gridColumn: '1 / span 2' }}>
                  <label style={customerDetailsLabelStyle}>Document Upload (Any other Proof)</label>
                  <button type="button" style={{ ...inputStyle, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '6px', cursor: 'pointer', backgroundColor: '#f8fbfd' }}>
                    <Upload size={11} color="var(--spacespot-cyan-primary)" /> Upload document
                  </button>
                </div>
              </div>

              <div style={{ marginTop: '8px', display: 'grid', gap: '7px' }}>
                {[
                  { label: 'Insurance Check', value: form.insuranceCheckStatus, key: 'insuranceCheckStatus' as const },
                  { label: 'Identity Check', value: form.identityCheckStatus, key: 'identityCheckStatus' as const },
                  { label: 'Financial Check', value: form.financialCheckStatus, key: 'financialCheckStatus' as const },
                  { label: 'T&C Acceptance', value: form.tcAcceptanceStatus, key: 'tcAcceptanceStatus' as const },
                ].map((row) => (
                  <div key={row.label}>
                    <div style={{ ...customerDetailsLabelStyle, marginBottom: '4px' }}>{row.label}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                      {['Initiate', 'Pending', 'Verified'].map((status) => {
                        const selected = row.value === status;
                        const bg = selected
                          ? (row.label === 'Identity Check' && status === 'Pending'
                            ? 'var(--spacespot-warning)'
                            : row.label === 'Financial Check' && status === 'Verified'
                              ? 'var(--spacespot-success)'
                              : '#2f6df6')
                          : '#f4f6f9';
                        const color = selected ? '#ffffff' : 'var(--spacespot-gray-400)';

                        return (
                          <button
                            key={status}
                            type="button"
                            onClick={() => updateField(row.key, status)}
                            style={{
                              border: 'none',
                              borderRadius: '999px',
                              height: '18px',
                              fontSize: '7px',
                              cursor: 'pointer',
                              backgroundColor: bg,
                              color,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '3px',
                            }}
                          >
                            <CheckCircle2 size={7} color={color} /> {status}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={sectionCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '6px', backgroundColor: '#dff9f7', display: 'grid', placeItems: 'center' }}>
                  <CreditCard size={10} color="var(--spacespot-cyan-primary)" />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--spacespot-navy-primary)' }}>Payment Information</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px 12px' }}>
                <div>
                  <label style={customerDetailsLabelStyle}>Payment Method</label>
                  <select style={inputStyle} value={form.paymentMethod} onChange={(e) => updateField('paymentMethod', e.target.value)}>
                    <option>Email card</option>
                    <option>Bank transfer</option>
                    <option>Card</option>
                  </select>
                </div>
                <div>
                  <label style={customerDetailsLabelStyle}>Payment Frequency</label>
                  <select style={inputStyle} value={form.paymentFrequency} onChange={(e) => updateField('paymentFrequency', e.target.value)}>
                    <option>Weekly</option>
                    <option>Monthly</option>
                    <option>Quarterly</option>
                  </select>
                </div>

                <div>
                  <label style={customerDetailsLabelStyle}>Invoice Start Date</label>
                  <input style={inputStyle} value={form.invoiceStartDate} onChange={(e) => updateField('invoiceStartDate', e.target.value)} />
                </div>
                <div>
                  <label style={customerDetailsLabelStyle}>Security Deposit</label>
                  <input style={inputStyle} value={form.securityDeposit} onChange={(e) => updateField('securityDeposit', e.target.value)} />
                </div>

                <div style={{ gridColumn: '1 / span 2' }}>
                  <label style={customerDetailsLabelStyle}>Billing Address</label>
                  <input style={inputStyle} value={form.billingAddress} onChange={(e) => updateField('billingAddress', e.target.value)} />
                </div>

                <div>
                  <label style={customerDetailsLabelStyle}>GST Eligible</label>
                  <select style={inputStyle} value={form.gstEligible} onChange={(e) => updateField('gstEligible', e.target.value)}>
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </div>
                <div>
                  <label style={customerDetailsLabelStyle}>Tax Authority Type</label>
                  <select style={inputStyle} value={form.taxAuthorityType} onChange={(e) => updateField('taxAuthorityType', e.target.value)}>
                    <option>GST 10%</option>
                    <option>GST 0%</option>
                  </select>
                </div>

                <div>
                  <label style={customerDetailsLabelStyle}>Lease Start Date</label>
                  <input style={inputStyle} value={form.leaseStartDate} onChange={(e) => updateField('leaseStartDate', e.target.value)} />
                  <div style={{ fontSize: '8px', color: '#9aa8b9', marginTop: '4px' }}>(7 days after the advance payment receipt)</div>
                </div>
                <div>
                  <label style={customerDetailsLabelStyle}>Advance Payment</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                    {['Initiate', 'Received'].map((status) => {
                      const selected = form.advancePaymentStatus === status;
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => updateField('advancePaymentStatus', status)}
                          style={{
                            border: 'none',
                            borderRadius: '999px',
                            height: '18px',
                            fontSize: '7px',
                            cursor: 'pointer',
                            backgroundColor: selected ? '#2f6df6' : '#f4f6f9',
                            color: selected ? '#ffffff' : 'var(--spacespot-gray-400)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '3px',
                          }}
                        >
                          <CheckCircle2 size={7} color={selected ? '#ffffff' : 'var(--spacespot-gray-400)'} /> {status}
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
                onClick={() => navigate('/manage/customers')}
                style={{
                  border: '1px solid #cdd7e3',
                  backgroundColor: '#f8fafd',
                  borderRadius: '6px',
                  color: '#4d5f75',
                  fontSize: '10px',
                  height: '26px',
                  minWidth: '68px',
                  padding: '0 14px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveChanges}
                style={{
                  border: 'none',
                  backgroundColor: 'var(--spacespot-navy-primary)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '10px',
                  height: '26px',
                  minWidth: '112px',
                  padding: '0 16px',
                  cursor: 'pointer',
                }}
              >
                Save Changes
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
                  <User size={9} color="var(--spacespot-cyan-primary)" />
                </div>
                <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--spacespot-navy-primary)' }}>Customer Summary</span>
              </div>

              <div style={{ backgroundColor: '#d9edf0', borderRadius: '6px', padding: '8px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '7px' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '5px', backgroundColor: 'var(--spacespot-cyan-primary)', color: '#ffffff', fontSize: '9px', display: 'grid', placeItems: 'center', fontWeight: 700 }}>
                  {customerId}
                </div>
                <div>
                  <div style={{ fontSize: '9px', color: 'var(--spacespot-navy-primary)', fontWeight: 600 }}>{form.customerBrandName}</div>
                  <div style={{ fontSize: '7px', color: 'var(--spacespot-gray-500)' }}>{form.brandCategory}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '5px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '7px', color: '#8fa0b2' }}>
                  <User size={9} /> {form.ownerName}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '7px', color: '#8fa0b2' }}>
                  <Mail size={9} /> {form.email}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '7px', color: '#8fa0b2' }}>
                  <Phone size={9} /> {form.primaryPhone}
                </div>
              </div>

              <div style={{ height: '1px', backgroundColor: '#e4edf5', margin: '7px 0' }} />

              <div style={{ fontSize: '8px', color: 'var(--spacespot-gray-500)', marginBottom: '6px' }}>Verification Status</div>
              <div style={{ display: 'grid', gap: '5px', marginBottom: '9px' }}>
                {[
                  { label: 'Insurance Check', value: form.insuranceCheckStatus },
                  { label: 'Identity Check', value: form.identityCheckStatus },
                  { label: 'Financial Check', value: form.financialCheckStatus },
                  { label: 'T&C Acceptance', value: form.tcAcceptanceStatus },
                ].map((row) => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '6px', color: 'var(--spacespot-gray-500)' }}>{row.label}</span>
                    <span style={{ ...statusChipStyle(row.value), fontSize: '6px', borderRadius: '999px', padding: '1px 4px', minWidth: '54px', justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <CheckCircle2 size={6} /> {row.value}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ height: '1px', backgroundColor: '#e4edf5', margin: '7px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: '#7f8ea1', marginBottom: '5px' }}>
                <span>Form Completion</span>
                <span style={{ color: 'var(--spacespot-cyan-primary)', fontWeight: 700 }}>{completion}%</span>
              </div>
              <div style={{ height: '5px', backgroundColor: '#edf2f7', borderRadius: '999px', overflow: 'hidden', marginBottom: '10px' }}>
                <div style={{ width: `${completion}%`, height: '100%', backgroundColor: 'var(--spacespot-cyan-primary)' }} />
              </div>

              <button
                type="button"
                onClick={handleSaveChanges}
                style={{
                  width: '100%',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: 'var(--spacespot-navy-primary)',
                  color: '#ffffff',
                  fontSize: '9px',
                  height: '34px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Save Changes
              </button>
            </div>

            <div style={{ ...sectionCard, padding: '8px', backgroundColor: '#f8fbfd' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                <Info size={9} color="var(--spacespot-cyan-primary)" />
                <span style={{ fontSize: '8px', fontWeight: 600, color: 'var(--spacespot-navy-primary)' }}>Need Help?</span>
              </div>
              <div style={{ fontSize: '7px', color: '#8a99aa', lineHeight: 1.45 }}>
                Review verification items and billing information before saving updates.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
