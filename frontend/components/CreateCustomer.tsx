import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../src/api/axios';
import {
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  FileText,
  Globe,
  Info,
  Mail,
  MapPin,
  Phone,
  Star,
  Upload,
  User,
} from 'lucide-react';

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
  verificationStatus: string;
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
  padding: '10px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '8px',
  color: '#7f8ea1',
  marginBottom: '4px',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  letterSpacing: '0.04em',
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
  height: '26px',
  border: '1px solid #9fb0c4',
  borderRadius: '4px',
  backgroundColor: '#ffffff',
  fontSize: '10px',
  color: '#203249',
  padding: '0 8px',
  boxSizing: 'border-box',
};

export default function CreateCustomer() {
  const navigate = useNavigate();
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] = useState(false);
  const [brandLogoFile, setBrandLogoFile] = useState<File | null>(null);
  const [proofDocumentFile, setProofDocumentFile] = useState<File | null>(null);

  const [form, setForm] = useState<CustomerFormData>({
    customerBrandName: '',
    brandCategory: 'Select an option',
    ownerName: '',
    referenceName: '',
    customerLevel: 'Select an option',
    email: '',
    primaryPhone: '412356789',
    secondaryPhone: '412356789',
    businessWebsite: 'www.pinkdiamonds.com',
    preferredSpaceUnit: 'BEACH-L1-U1 (Space-Level-Unit)',
    proposedUsage: '',
    address1: '20 Bond Street Canberra ACT-1000',
    brandLogo: '',
    abn: '3456789012',
    acn: '2345678901',
    verificationStatus: 'Verified',
    paymentMethod: 'Select an option',
    paymentFrequency: 'Select an option',
    invoiceStartDate: '',
    securityDeposit: '$500',
    billingAddress: '20 Bond Street Canberra ACT-1000',
    gstEligible: 'No',
    taxAuthorityType: 'GST 10%',
    leaseStartDate: '',
    insuranceCheckStatus: 'Initiate',
    identityCheckStatus: 'Pending',
    financialCheckStatus: 'Verified',
    tcAcceptanceStatus: 'Initiate',
    advancePaymentStatus: 'Initiate',
  });

  const updateField = (key: keyof CustomerFormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const completion = useMemo(() => {
    const values = [
      form.customerBrandName,
      form.brandCategory,
      form.ownerName,
      form.referenceName,
      form.customerLevel,
      form.email,
      form.primaryPhone,
      form.businessWebsite,
      form.preferredSpaceUnit,
      form.proposedUsage,
      form.address1,
      form.abn,
      form.acn,
      form.paymentMethod,
      form.paymentFrequency,
      form.securityDeposit,
      form.billingAddress,
      form.gstEligible,
      form.taxAuthorityType,
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

const handleInitiateAllVerification = () => {
  setForm((prev) => ({
    ...prev,
    insuranceCheckStatus: 'Pending',
    identityCheckStatus: 'Pending',
    financialCheckStatus: 'Pending',
    tcAcceptanceStatus: 'Pending',
  }));

  setIsVerificationDialogOpen(true);
};

const handleCreateCustomer = async () => {
  try {
    await api.post('/customers', {
      company_name: form.customerBrandName,
      contact_person: form.ownerName || form.referenceName,
      email: form.email,
      phone: form.primaryPhone,
      address: form.address1,
      website: form.businessWebsite,
      tax_id: form.abn,
      status: 'active',
      metadata: {
        brandCategory: form.brandCategory,
        customerLevel: form.customerLevel,
        referenceName: form.referenceName,
        secondaryPhone: form.secondaryPhone,
        preferredSpaceUnit: form.preferredSpaceUnit,
        proposedUsage: form.proposedUsage,
        acn: form.acn,
        verificationStatus: form.verificationStatus,
        paymentMethod: form.paymentMethod,
        paymentFrequency: form.paymentFrequency,
        securityDeposit: form.securityDeposit,
        billingAddress: form.billingAddress,
        gstEligible: form.gstEligible,
        taxAuthorityType: form.taxAuthorityType,
      },
    });

    toast.success('Created Customer Successfully');
    navigate('/manage/customers');
  } catch (error: any) {
    console.error('Create customer error:', error);
    toast.error(error?.response?.data?.message || 'Failed to create customer');
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
          <div style={{ display: 'grid', gap: '8px', paddingRight: '250px' }}>
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
                <User size={15} color="#ffffff" />
              </div>
              <div style={{ fontSize: '20px', color: 'var(--spacespot-navy-primary)', fontWeight: 700, lineHeight: 1.1 }}>Create New Customer</div>
            </div>

            <div style={sectionCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '14px' }}>
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '6px',
                    backgroundColor: '#dff9f7',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <Building2 size={10} color="var(--spacespot-cyan-primary)" />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--spacespot-navy-primary)', lineHeight: 1 }}>Customer Details</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 14px' }}>
                <div>
                  <label style={customerDetailsLabelStyle}>Customer Brand Name *</label>
                  <input style={{ ...inputStyle, height: '30px', fontSize: '10px' }} value={form.customerBrandName} onChange={(e) => updateField('customerBrandName', e.target.value)} placeholder="e.g., ABC Phones" />
                </div>
                <div>
                  <label style={customerDetailsLabelStyle}>Brand Category</label>
                  <select style={{ ...inputStyle, height: '30px', fontSize: '10px' }} value={form.brandCategory} onChange={(e) => updateField('brandCategory', e.target.value)}>
                    <option>Select an option</option>
                    <option>Electronics</option>
                    <option>Fashion</option>
                    <option>Food & Beverage</option>
                  </select>
                </div>

                <div>
                  <label style={customerDetailsLabelStyle}>Owner Name *</label>
                  <input style={{ ...inputStyle, height: '30px', fontSize: '10px' }} value={form.ownerName} onChange={(e) => updateField('ownerName', e.target.value)} placeholder="e.g., John Phillip" />
                </div>
                <div>
                  <label style={customerDetailsLabelStyle}>Reference/Responsible Name</label>
                  <input style={{ ...inputStyle, height: '30px', fontSize: '10px' }} value={form.referenceName} onChange={(e) => updateField('referenceName', e.target.value)} placeholder="Enter reference name" />
                </div>

                <div>
                  <label style={customerDetailsLabelStyle}>Customer Level</label>
                  <select style={{ ...inputStyle, height: '30px', fontSize: '10px' }} value={form.customerLevel} onChange={(e) => updateField('customerLevel', e.target.value)}>
                    <option>Select an option</option>
                    <option>Level 1</option>
                    <option>Level 2</option>
                    <option>Level 3</option>
                  </select>
                </div>
                <div>
                  <label style={customerDetailsLabelStyle}>Email *</label>
                  <input style={{ ...inputStyle, height: '30px', fontSize: '10px' }} value={form.email} onChange={(e) => updateField('email', e.target.value)} placeholder="Admin@abcphones.com" />
                </div>

                <div>
                  <label style={customerDetailsLabelStyle}>Phone Number (Primary)</label>
                  <input style={{ ...inputStyle, height: '30px', fontSize: '10px' }} value={form.primaryPhone} onChange={(e) => updateField('primaryPhone', e.target.value)} placeholder="412356789" />
                </div>
                <div>
                  <label style={customerDetailsLabelStyle}>Phone Number (Secondary)</label>
                  <input style={{ ...inputStyle, height: '30px', fontSize: '10px' }} value={form.secondaryPhone} onChange={(e) => updateField('secondaryPhone', e.target.value)} placeholder="412356789" />
                </div>

                <div>
                  <label style={customerDetailsLabelStyle}>Business Website</label>
                  <input style={{ ...inputStyle, height: '30px', fontSize: '10px' }} value={form.businessWebsite} onChange={(e) => updateField('businessWebsite', e.target.value)} placeholder="www.pinkdiamonds.com" />
                </div>
                <div>
                  <label style={customerDetailsLabelStyle}>Preferred Space-Unit</label>
                  <input style={{ ...inputStyle, height: '30px', fontSize: '10px' }} value={form.preferredSpaceUnit} onChange={(e) => updateField('preferredSpaceUnit', e.target.value)} placeholder="BEACH-L1-U1 (Space-Level-Unit)" />
                </div>

                <div>
                  <label style={customerDetailsLabelStyle}>Proposed Usage of the Unit</label>
                  <input style={{ ...inputStyle, height: '30px', fontSize: '10px' }} value={form.proposedUsage} onChange={(e) => updateField('proposedUsage', e.target.value)} placeholder="e.g., Coffee Shop, Retail Store" />
                </div>
                <div />

                <div>
                      <label style={customerDetailsLabelStyle}>Brand Logo</label>

                      <input
                        id="brandLogoUpload"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setBrandLogoFile(file);
                        }}
                      />

                      <button
                        type="button"
                        onClick={() => document.getElementById('brandLogoUpload')?.click()}
                        style={{
                          ...inputStyle,
                          height: '30px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          gap: '6px',
                          cursor: 'pointer',
                          backgroundColor: '#f8fbfd',
                        }}
                      >
                        <Upload size={11} color="var(--spacespot-cyan-primary)" />
                        {brandLogoFile ? brandLogoFile.name : 'Upload image'}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 12px' }}>
                <div>
                  <label style={customerDetailsLabelStyle}>ABN</label>
                  <input style={{ ...inputStyle, height: '30px', fontSize: '10px' }} value={form.abn} onChange={(e) => updateField('abn', e.target.value)} placeholder="3456789012" />
                </div>
                <div>
                  <label style={customerDetailsLabelStyle}>ACN</label>
                  <input style={{ ...inputStyle, height: '30px', fontSize: '10px' }} value={form.acn} onChange={(e) => updateField('acn', e.target.value)} placeholder="2345678901" />
                </div>

                <div style={{ gridColumn: '1 / span 2' }}>
                  <label style={customerDetailsLabelStyle}>Document Upload (Any other Proof)</label>
                  <input
  id="proofDocumentUpload"
  type="file"
  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
  style={{ display: 'none' }}
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) setProofDocumentFile(file);
  }}
/>

<button
  type="button"
  onClick={() => document.getElementById('proofDocumentUpload')?.click()}
  style={{
    ...inputStyle,
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '6px',
    cursor: 'pointer',
    backgroundColor: '#f8fbfd',
  }}
>
  <Upload size={11} color="var(--spacespot-cyan-primary)" />
  {proofDocumentFile ? proofDocumentFile.name : 'Upload document'}
</button>
                </div>
              </div>

              <div style={{ marginTop: '10px' }}>
                <div style={{ ...customerDetailsLabelStyle, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={9} color="var(--spacespot-cyan-primary)" /> Verification
                </div>
                <button type="button" onClick={handleInitiateAllVerification} style={{ width: '100%', border: 'none', height: '26px', borderRadius: '4px', backgroundColor: 'var(--spacespot-navy-primary)', color: '#ffffff', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <CheckCircle2 size={10} color="#ffffff" /> Initiate All Verification
                </button>
              </div>

              <div style={{ marginTop: '10px', display: 'grid', gap: '8px' }}>
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
                              height: '20px',
                              fontSize: '8px',
                              cursor: 'pointer',
                              backgroundColor: bg,
                              color,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '3px',
                            }}
                          >
                            <CheckCircle2 size={8} color={color} /> {status}
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 12px' }}>
                <div>
                  <label style={customerDetailsLabelStyle}>Payment Method</label>
                  <select style={{ ...inputStyle, height: '30px', fontSize: '10px' }} value={form.paymentMethod} onChange={(e) => updateField('paymentMethod', e.target.value)}>
                    <option>Select an option</option>
                    <option>Bank transfer</option>
                    <option>Card</option>
                    <option>Cash</option>
                  </select>
                </div>
                <div>
                  <label style={customerDetailsLabelStyle}>Payment Frequency</label>
                  <select style={{ ...inputStyle, height: '30px', fontSize: '10px' }} value={form.paymentFrequency} onChange={(e) => updateField('paymentFrequency', e.target.value)}>
                    <option>Select an option</option>
                    <option>Monthly</option>
                    <option>Quarterly</option>
                    <option>Yearly</option>
                  </select>
                </div>

                <div>
                  <label style={customerDetailsLabelStyle}>Invoice Start Date</label>
                  <input
                      type="date"
                      style={{ ...inputStyle, height: '30px', fontSize: '10px' }}
                      value={form.invoiceStartDate}
                      onChange={(e) => updateField('invoiceStartDate', e.target.value)}
                    />
                </div>
                <div>
                  <label style={customerDetailsLabelStyle}>Security Deposit</label>
                  <input style={{ ...inputStyle, height: '30px', fontSize: '10px' }} value={form.securityDeposit} onChange={(e) => updateField('securityDeposit', e.target.value)} placeholder="$500" />
                </div>

                <div style={{ gridColumn: '1 / span 2' }}>
                  <label style={customerDetailsLabelStyle}>Billing Address</label>
                  <input style={{ ...inputStyle, height: '30px', fontSize: '10px' }} value={form.billingAddress} onChange={(e) => updateField('billingAddress', e.target.value)} placeholder="20 Bond Street Canberra ACT-1000" />
                </div>

                <div>
                  <label style={customerDetailsLabelStyle}>GST Eligible</label>
                  <select style={{ ...inputStyle, height: '30px', fontSize: '10px' }} value={form.gstEligible} onChange={(e) => updateField('gstEligible', e.target.value)}>
                    <option>No</option>
                    <option>Yes</option>
                  </select>
                </div>
                <div>
                  <label style={customerDetailsLabelStyle}>Tax Authority Type</label>
                  <select style={{ ...inputStyle, height: '30px', fontSize: '10px' }} value={form.taxAuthorityType} onChange={(e) => updateField('taxAuthorityType', e.target.value)}>
                    <option>GST 10%</option>
                    <option>GST 0%</option>
                  </select>
                </div>

                <div>
                  <label style={customerDetailsLabelStyle}>Lease Start Date</label>
                  <input
                    type="date"
                    style={{ ...inputStyle, height: '30px', fontSize: '10px' }}
                    value={form.leaseStartDate}
                    onChange={(e) => updateField('leaseStartDate', e.target.value)}
                  />
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
                            height: '20px',
                            fontSize: '8px',
                            cursor: 'pointer',
                            backgroundColor: selected ? '#2f6df6' : '#f4f6f9',
                            color: selected ? '#ffffff' : 'var(--spacespot-gray-400)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '3px',
                          }}
                        >
                          <CheckCircle2 size={8} color={selected ? '#ffffff' : 'var(--spacespot-gray-400)'} /> {status}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                style={{
                  border: '1px solid #cdd7e3',
                  backgroundColor: '#f8fafd',
                  borderRadius: '6px',
                  color: '#4d5f75',
                  fontSize: '10px',
                  height: '26px',
                  padding: '0 12px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>

          <aside
            style={{
              position: 'fixed',
              top: '96px',
              right: '32px',
              width: '230px',
              zIndex: 20,
              display: 'grid',
              gap: '8px',
            }}
          >
            <div style={sectionCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '6px', backgroundColor: '#dff9f7', display: 'grid', placeItems: 'center' }}>
                  <User size={9} color="var(--spacespot-cyan-primary)" />
                </div>
                <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--spacespot-navy-primary)' }}>Customer Summary</span>
              </div>

              <div style={{ backgroundColor: '#d9edf0', borderRadius: '6px', padding: '8px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '5px', backgroundColor: 'var(--spacespot-cyan-primary)', color: '#ffffff', fontSize: '10px', display: 'grid', placeItems: 'center', fontWeight: 700 }}>
                  ?
                </div>
                <div>
                  <div style={{ fontSize: '9px', color: 'var(--spacespot-navy-primary)', fontWeight: 600 }}>{form.customerBrandName || 'Brand Name'}</div>
                  <div style={{ fontSize: '7px', color: 'var(--spacespot-gray-500)' }}>{form.brandCategory || 'Category'}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '5px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '8px', color: '#8fa0b2' }}>
                  <User size={9} /> {form.ownerName || 'Owner Name'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '8px', color: '#8fa0b2' }}>
                  <Mail size={9} /> {form.email || 'email@example.com'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '8px', color: '#8fa0b2' }}>
                  <Phone size={9} /> {form.primaryPhone || 'Phone Number'}
                </div>
              </div>

              <div style={{ height: '1px', backgroundColor: '#e4edf5', margin: '7px 0' }} />

              <div style={{ fontSize: '8px', color: 'var(--spacespot-gray-500)', marginBottom: '5px' }}>Verification Status</div>
              <div style={{ display: 'grid', gap: '4px', marginBottom: '8px' }}>
                {[
                  { label: 'Insurance Check', value: form.insuranceCheckStatus },
                  { label: 'Identity Check', value: form.identityCheckStatus },
                  { label: 'Financial Check', value: form.financialCheckStatus },
                  { label: 'T&C Acceptance', value: form.tcAcceptanceStatus },
                ].map((row) => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '7px', color: 'var(--spacespot-gray-500)' }}>{row.label}</span>
                    <span style={{ ...statusChipStyle(row.value), fontSize: '7px', borderRadius: '999px', padding: '1px 6px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <CheckCircle2 size={7} /> {row.value}
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
                onClick={handleCreateCustomer}
                style={{
                  width: '100%',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: 'var(--spacespot-navy-primary)',
                  color: '#ffffff',
                  fontSize: '9px',
                  height: '30px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Create Customer
              </button>
            </div>

            <div style={{ ...sectionCard, padding: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                <Info size={9} color="var(--spacespot-cyan-primary)" />
                <span style={{ fontSize: '8px', fontWeight: 600, color: 'var(--spacespot-navy-primary)' }}>Required Fields</span>
              </div>
              <div style={{ fontSize: '7px', color: '#8a99aa', lineHeight: 1.4 }}>
                Brand Name, Owner Name, and Email are required to create a customer.
              </div>
            </div>
          </aside>

          {isVerificationDialogOpen && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.45)',
                display: 'grid',
                placeItems: 'center',
                zIndex: 120,
              }}
            >
              <div
                style={{
                  width: '260px',
                  borderRadius: '10px',
                  backgroundColor: '#ffffff',
                  padding: '18px',
                  boxShadow: '0 16px 30px rgba(15, 23, 42, 0.25)',
                }}
              >
                <div style={{ display: 'grid', placeItems: 'center', marginBottom: '10px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '999px',
                      backgroundColor: '#12b886',
                      display: 'grid',
                      placeItems: 'center',
                      boxShadow: '0 6px 12px rgba(18, 184, 134, 0.35)',
                    }}
                  >
                    <Mail size={20} color="#ffffff" />
                  </div>
                </div>

                <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: 700, color: '#303a46', marginBottom: '8px' }}>
                  Email Sent Successfully!
                </div>

                <div style={{ textAlign: 'center', fontSize: '9px', color: '#7b8898', lineHeight: 1.4 }}>
                  Verification requests have been sent to the customer at:
                </div>
                <div style={{ textAlign: 'center', fontSize: '10px', color: '#16c8bd', fontWeight: 600, marginTop: '2px', marginBottom: '10px' }}>
                  {form.email || 'customer@example.com'}
                </div>

                <div style={{ backgroundColor: '#f3f5f8', borderRadius: '8px', padding: '10px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '8px', color: '#75869a', marginBottom: '6px' }}>Initiated Verifications:</div>
                  <div style={{ display: 'grid', gap: '4px' }}>
                    {['Insurance Check', 'Identity Check', 'Financial Check', 'T&C Acceptance'].map((item) => (
                      <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9px', color: '#2f3b4a' }}>
                        <CheckCircle2 size={10} color="var(--spacespot-cyan-primary)" /> {item}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsVerificationDialogOpen(false)}
                  style={{
                    width: '100%',
                    border: 'none',
                    borderRadius: '6px',
                    backgroundColor: 'var(--spacespot-navy-primary)',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 700,
                    height: '30px',
                    cursor: 'pointer',
                  }}
                >
                  Got it, Thanks!
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



