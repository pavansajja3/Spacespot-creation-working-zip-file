import React, { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Info,
  MapPin,
  Ruler,
  Sparkles,
  X,
} from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../src/api/axios.js';

type UnitState = 'Active' | 'Inactive' | 'Occupied' | 'Maintenance' | 'Reserved';

type ManagedUnitStatus = 'Leased' | 'Available Soon' | 'Proposed' | 'Occupied';

type EditUnitNavState = {
  unit?: {
    id: string;
    code: string;
    name: string;
    location: string;
    precinct: string;
    category: string;
    area: number;
    frontage: string;
    monthlyRate: number;
    status: ManagedUnitStatus;
  };
};

const sectionCard: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1.5px solid #9fe5df',
  borderRadius: '12px',
  padding: '16px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  color: '#374151',
  fontWeight: 600,
  marginBottom: '4px',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: '32px',
  border: '1px solid #94a3b8',
  borderRadius: '8px',
  backgroundColor: '#ffffff',
  fontSize: '14px',
  color: '#374151',
  padding: '0 10px',
  boxSizing: 'border-box',
};

export default function EditUnit() {
  const navigate = useNavigate();
  const location = useLocation();
  const { spaceId, unitId = 'UNIT-01' } = useParams();
  const navState = location.state as EditUnitNavState | undefined;
  const selectedUnit = navState?.unit;


  const occupiedFromManage = selectedUnit?.status === 'Leased' || selectedUnit?.status === 'Occupied';
  const initialUnitState: UnitState = occupiedFromManage
    ? 'Occupied'
    : selectedUnit?.status === 'Available Soon'
      ? 'Active'
      : selectedUnit?.status === 'Proposed'
        ? 'Reserved'
        : 'Active';

  const initialForm = useMemo(
    () => ({
      unitId: selectedUnit?.id || unitId,
      unitName: selectedUnit?.name || 'Unit 001',
      floor: '',
      unitType: selectedUnit?.category || 'Retail',
      status: occupiedFromManage ? 'Occupied' : 'Available',
      location: selectedUnit
        ? `${selectedUnit.location}${selectedUnit.precinct ? `, ${selectedUnit.precinct}` : ''}`
        : '123, Pitt St, NSW 2000',
      frontage: selectedUnit?.frontage?.replace('m', '') || '18.10',
      rentableArea: selectedUnit?.area ? String(selectedUnit.area) : '65.79',
      description: 'Enter unit description...',
      tenantName: occupiedFromManage ? 'EG' : '',
      leaseStartDate: occupiedFromManage ? '05/03/2024' : '',
      leaseEndDate: occupiedFromManage ? '12/12/2029' : '',
      monthlyRent: selectedUnit?.monthlyRate ? String(selectedUnit.monthlyRate) : '8000',
      securityDeposit: occupiedFromManage ? '12000' : '0',
      includedInRent: occupiedFromManage ? 'Yes' : 'No',
      height: '4.89',
      width: '6.28',
      length: '11.42',
      features: 'Power, Water, Internet, Furniture',
      standardPrice: selectedUnit?.monthlyRate ? String(Math.max(1, Math.round(selectedUnit.monthlyRate / 30))) : '95',
      footTraffic: '40-50 people per hour',
      hotness: 'Busy',
      unitCategory: selectedUnit?.category || 'Restaurant',
      availableFrom: '',
      availableTo: '',
      precinct: selectedUnit?.precinct || 'West Wing',
      specialConditions: '',
    }),
    [selectedUnit, unitId, occupiedFromManage],
  );

  const [form, setForm] = useState(initialForm);
const [unitState, setUnitState] = useState<UnitState>(initialUnitState);
const [floors, setFloors] = useState<any[]>([]);
console.log("SPACE ID:", spaceId);


useEffect(() => {
  setForm(initialForm);
  setUnitState(initialUnitState);
}, [initialForm, initialUnitState]);

useEffect(() => {
  const fetchFloors = async () => {
    if (!spaceId) return;

    try {
        const response = await api.get(`/floors/spaces/${spaceId}/floors`);
        console.log("FLOORS API:", response.data); // 👈 ADD THIS
        setFloors(response.data?.data || response.data || []);
      }catch (error) {
      console.error("Failed to load floors:", error);
      setFloors([]);
    }
  };

  fetchFloors();
}, [spaceId]);
  


  const completion = useMemo(() => {
    const values = [
      form.unitId,
      form.unitName,
      form.floor,
      form.unitType,
      form.status,
      form.location,
      form.rentableArea,
      form.tenantName,
      form.monthlyRent,
      form.standardPrice,
    ];
    const filled = values.filter((value) => value.trim().length > 0).length;
    return Math.round((filled / values.length) * 100);
  }, [form]);

  const setField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const isOccupiedUnit = form.status === 'Occupied' || unitState === 'Occupied';
  const currentStatusLabel = isOccupiedUnit ? 'Occupied' : selectedUnit?.status === 'Proposed' ? 'Proposed' : selectedUnit?.status === 'Available Soon' ? 'Available Soon' : unitState;
  const currentStatusColor = currentStatusLabel === 'Occupied'
    ? 'var(--spacespot-cyan-primary)'
    : currentStatusLabel === 'Proposed'
      ? 'var(--spacespot-warning)'
      : '#10b981';

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

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '9px',
              backgroundColor: 'var(--spacespot-cyan-primary)',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <Building2 size={15} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 600, color: 'var(--spacespot-navy-primary)' }}>Edit Unit</div>
            <div style={{ fontSize: '11px', color: '#9ca3af' }}>Update unit information and lease details</div>
          </div>
        </div>

        <div style={{ marginBottom: '8px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '10px',
              color: '#6b7280',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              borderRadius: '999px',
              padding: '4px 10px',
            }}
          >
            <Building2 size={10} color="var(--spacespot-cyan-primary)" />
            {form.unitName} • {form.floor}
          </span>
        </div>

        <div style={{ position: 'relative' }}>
          <div style={{ display: 'grid', gap: '8px', paddingRight: '294px' }}>
            <div style={sectionCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
                <Info size={12} color="var(--spacespot-cyan-primary)" />
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#223247' }}>Basic Information</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={labelStyle}><Info size={9} color="var(--spacespot-cyan-primary)" />Unit ID</label>
                  <input style={inputStyle} value={form.unitId} onChange={(e) => setField('unitId', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}><Building2 size={9} color="var(--spacespot-cyan-primary)" />Unit Name</label>
                  <input style={inputStyle} value={form.unitName} onChange={(e) => setField('unitName', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}><MapPin size={9} color="var(--spacespot-cyan-primary)" />Floor ID</label>
                  <select
                    style={inputStyle}
                    value={form.floor}
                    onChange={(e) => setField('floor', e.target.value)}
                  >
                    <option value="">Select Floor</option>

                    {floors.map((floor) => (
                      <option key={floor.id} value={String(floor.id)}>
                        {floor.floor_name} (Level {floor.floor_number})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}><Sparkles size={9} color="var(--spacespot-cyan-primary)" />Unit Type</label>
                  <select style={inputStyle} value={form.unitType} onChange={(e) => setField('unitType', e.target.value)}>
                    <option>Retail</option>
                    <option>Office</option>
                    <option>Kiosk</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}><CheckCircle2 size={9} color="var(--spacespot-cyan-primary)" />Unit Status</label>
                  <select style={inputStyle} value={form.status} onChange={(e) => setField('status', e.target.value)}>
                    <option>Occupied</option>
                    <option>Available</option>
                    <option>Inactive</option>
                    <option>Maintenance</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}><MapPin size={9} color="var(--spacespot-cyan-primary)" />Location</label>
                  <input style={inputStyle} value={form.location} onChange={(e) => setField('location', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}><Ruler size={9} color="var(--spacespot-cyan-primary)" />Frontage (m)</label>
                  <input style={inputStyle} value={form.frontage} onChange={(e) => setField('frontage', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}><Ruler size={9} color="var(--spacespot-cyan-primary)" />Rentable Area</label>
                  <input style={inputStyle} value={form.rentableArea} onChange={(e) => setField('rentableArea', e.target.value)} />
                </div>
                <div style={{ gridColumn: '1 / span 2' }}>
                  <label style={labelStyle}><Info size={9} color="var(--spacespot-cyan-primary)" />Description</label>
                  <textarea
                    rows={3}
                    style={{ ...inputStyle, height: 'auto', minHeight: '84px', padding: '8px 10px', resize: 'vertical', fontSize: '13px' }}
                    value={form.description}
                    onChange={(e) => setField('description', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {isOccupiedUnit ? (
              <div style={sectionCard}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
                  <Calendar size={12} color="var(--spacespot-cyan-primary)" />
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#223247' }}>Lease Information</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={labelStyle}>Tenant Name</label>
                    <input style={inputStyle} value={form.tenantName} onChange={(e) => setField('tenantName', e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>Lease Start Date</label>
                    <input style={inputStyle} value={form.leaseStartDate} onChange={(e) => setField('leaseStartDate', e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>Lease End Date</label>
                    <input style={inputStyle} value={form.leaseEndDate} onChange={(e) => setField('leaseEndDate', e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>Monthly Rent</label>
                    <input style={inputStyle} value={form.monthlyRent} onChange={(e) => setField('monthlyRent', e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>Security Deposit</label>
                    <input style={inputStyle} value={form.securityDeposit} onChange={(e) => setField('securityDeposit', e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>Included in Rent</label>
                    <select style={inputStyle} value={form.includedInRent} onChange={(e) => setField('includedInRent', e.target.value)}>
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div style={sectionCard}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
                  <Calendar size={12} color="var(--spacespot-cyan-primary)" />
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#223247' }}>Availability Information</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={labelStyle}>Available From</label>
                    <input style={inputStyle} value={form.availableFrom} onChange={(e) => setField('availableFrom', e.target.value)} placeholder="Select start date" />
                  </div>
                  <div>
                    <label style={labelStyle}>Available To</label>
                    <input style={inputStyle} value={form.availableTo} onChange={(e) => setField('availableTo', e.target.value)} placeholder="Select end date" />
                  </div>
                  <div>
                    <label style={labelStyle}>Target Monthly Rent</label>
                    <input style={inputStyle} value={form.monthlyRent} onChange={(e) => setField('monthlyRent', e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>Security Deposit</label>
                    <input style={inputStyle} value={form.securityDeposit} onChange={(e) => setField('securityDeposit', e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>Included in Rent</label>
                    <select style={inputStyle} value={form.includedInRent} onChange={(e) => setField('includedInRent', e.target.value)}>
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Availability Status</label>
                    <input style={inputStyle} value={currentStatusLabel} readOnly />
                  </div>
                </div>
              </div>
            )}

            <div style={sectionCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
                <Sparkles size={12} color="var(--spacespot-cyan-primary)" />
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#223247' }}>Unit Specifications</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={labelStyle}>Height (m)</label>
                  <input style={inputStyle} value={form.height} onChange={(e) => setField('height', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Width (m)</label>
                  <input style={inputStyle} value={form.width} onChange={(e) => setField('width', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Length (m)</label>
                  <input style={inputStyle} value={form.length} onChange={(e) => setField('length', e.target.value)} />
                </div>
              </div>
              <div style={{ marginTop: '8px' }}>
                <label style={labelStyle}>Unit Features</label>
                <input style={inputStyle} value={form.features} onChange={(e) => setField('features', e.target.value)} />
              </div>
            </div>

            <div style={sectionCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
                <Calendar size={12} color="var(--spacespot-cyan-primary)" />
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#223247' }}>Pricing & Availability</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={labelStyle}>Standard Unit Price (Per Day)</label>
                  <input style={inputStyle} value={form.standardPrice} onChange={(e) => setField('standardPrice', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Expected Foot Traffic</label>
                  <input style={inputStyle} value={form.footTraffic} onChange={(e) => setField('footTraffic', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Unit Hotness</label>
                  <input style={inputStyle} value={form.hotness} onChange={(e) => setField('hotness', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Unit Category</label>
                  <input style={inputStyle} value={form.unitCategory} onChange={(e) => setField('unitCategory', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Available From</label>
                  <input style={inputStyle} value={form.availableFrom} onChange={(e) => setField('availableFrom', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Available To</label>
                  <input style={inputStyle} value={form.availableTo} onChange={(e) => setField('availableTo', e.target.value)} />
                </div>
                <div style={{ gridColumn: '1 / span 2' }}>
                  <label style={labelStyle}>Precinct</label>
                  <input style={inputStyle} value={form.precinct} onChange={(e) => setField('precinct', e.target.value)} />
                </div>
              </div>
            </div>

            <div style={{ ...sectionCard, borderColor: '#cad3de' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
                <Info size={12} color="#7f8ea1" />
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#223247' }}>Special Conditions</span>
              </div>
              <textarea
                rows={3}
                style={{ ...inputStyle, height: 'auto', minHeight: '84px', padding: '8px 10px', resize: 'vertical', fontSize: '13px' }}
                placeholder="e.g., No political party hire, no power facility"
                value={form.specialConditions}
                onChange={(e) => setField('specialConditions', e.target.value)}
              />
            </div>

            <div style={{ ...sectionCard, borderColor: '#f5d39c' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
                <CheckCircle2 size={12} color="var(--spacespot-warning)" />
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#223247' }}>Unit Status</span>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {(['Active', 'Inactive', 'Occupied', 'Maintenance', 'Reserved'] as UnitState[]).map((state) => {
                  const selected = unitState === state;
                  return (
                    <button
                      key={state}
                      type="button"
                      onClick={() => setUnitState(state)}
                      style={{
                        border: selected ? '1px solid var(--spacespot-success)' : '1px solid var(--spacespot-gray-300)',
                        backgroundColor: selected ? 'var(--spacespot-success-light)' : '#ffffff',
                        color: selected ? 'var(--spacespot-success)' : 'var(--spacespot-gray-500)',
                        borderRadius: '999px',
                        height: '28px',
                        padding: '0 12px',
                        fontSize: '10px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {state}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                style={{
                  flex: 1,
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: 'var(--spacespot-navy-primary)',
                  color: '#ffffff',
                  height: '34px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Save Changes
              </button>
              <button
                  type="button"
                  onClick={() => navigate('/manage/units')}
                  style={{
                    width: '120px',
                    border: '1px solid var(--spacespot-gray-300)',
                    borderRadius: '6px',
                    backgroundColor: '#ffffff',
                    color: 'var(--spacespot-gray-600)',
                    height: '34px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                  }}
                >
                  <X size={12} /> Cancel
                </button>
            </div>
          </div>

          <aside
            style={{
              position: 'fixed',
              top: '96px',
              right: '32px',
              width: '280px',
              maxHeight: 'calc(100vh - 112px)',
              overflowY: 'auto',
              paddingRight: '4px',
              zIndex: 20,
            }}
          >
            <div style={{ backgroundColor: '#ffffff', border: '1.5px solid #9fe5df', borderRadius: '12px', padding: '16px', marginBottom: '10px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1f2937', marginBottom: '8px' }}>Form Completion</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#6b7280', marginBottom: '6px' }}>
                <span>Progress</span>
                <strong style={{ color: 'var(--spacespot-cyan-primary)', fontWeight: 700 }}>{completion}%</strong>
              </div>
              <div style={{ height: '6px', backgroundColor: '#d1d5db', borderRadius: '999px', overflow: 'hidden', marginBottom: '10px' }}>
                <div style={{ width: `${completion}%`, height: '100%', backgroundColor: 'var(--spacespot-cyan-primary)' }} />
              </div>
              <div style={{ fontSize: '10px', color: '#6b7280', lineHeight: 1.65 }}>
                <div>- Fill all required fields</div>
                <div>- Set unit status</div>
                <div>- Add tenant information (if occupied)</div>
                <div>- Review financial details</div>
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1.5px solid #9fe5df', borderRadius: '12px', padding: '16px', marginBottom: '10px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1f2937', marginBottom: '10px' }}>Unit Overview</div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: '#6b7280', padding: '2px 0 8px' }}>
                <span>Unit ID</span>
                <strong style={{ color: '#374151', fontWeight: 700 }}>{form.unitId.replace('UNIT-', 'U')}</strong>
              </div>
              <div style={{ height: '1px', backgroundColor: '#d1d5db', marginBottom: '8px' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: '#6b7280', paddingBottom: '8px' }}>
                <span>Space</span>
                <strong style={{ color: '#374151', fontWeight: 700 }}>SP001</strong>
              </div>
              <div style={{ height: '1px', backgroundColor: '#d1d5db', marginBottom: '8px' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: '#6b7280', paddingBottom: '8px' }}>
                <span>Floor</span>
                <strong style={{ color: '#374151', fontWeight: 700 }}>{form.floor}</strong>
              </div>
              <div style={{ height: '1px', backgroundColor: '#d1d5db', marginBottom: '8px' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: '#6b7280', paddingBottom: '8px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><Calendar size={11} /> Created Date</span>
                <strong style={{ color: '#374151', fontWeight: 700 }}>Mar 4, 2026</strong>
              </div>
              <div style={{ height: '1px', backgroundColor: '#d1d5db', marginBottom: '8px' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: '#6b7280' }}>
                <span>Last Modified</span>
                <strong style={{ color: '#374151', fontWeight: 700 }}>Mar 5, 2026</strong>
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1.5px solid #9fe5df', borderRadius: '12px', padding: '16px', marginBottom: '10px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1f2937', marginBottom: '8px' }}>Current Status</div>
              <div style={{ fontSize: '11px', color: currentStatusColor, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '7px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: currentStatusColor, display: 'inline-block' }} />
                {currentStatusLabel}
              </div>
            </div>

            <div style={{ backgroundColor: '#dff7f6', border: '1.5px solid #9fe5df', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1f2937', marginBottom: '7px' }}>Need Help?</div>
              <div style={{ fontSize: '10px', color: '#6b7280', lineHeight: 1.45, marginBottom: '10px' }}>
                Make sure all required fields are filled before saving. Review your changes carefully.
              </div>
              <button
                type="button"
                style={{
                  width: '100%',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: 'var(--spacespot-navy-primary)',
                  color: '#fff',
                  height: '32px',
                  fontSize: '10px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                View Documentation
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

