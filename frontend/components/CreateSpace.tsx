import { useRef, useState } from 'react';
import {
  ArrowLeft,
  Building2,
  Calendar,
  Check,
  Clock,
  FileText,
  Globe,
  Info,
  Layers,
  Mail,
  MapPin,
  Maximize2,
  Phone,
  Plus,
  Settings,
  Shield,
  Upload,
  Users,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type SpaceFormState = {
  spaceName: string;
  category: string;
  spaceWebsite: string;
  tradingHours: string;
  managedByEmail: string;
  managedByPhone: string;
  spaceAddress: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude: string;
  longitude: string;
  activeFrom: string;
  activeTo: string;
  ownership: string;
  management: string;
  overallRentableArea: string;
  permanentRentableArea: string;
  otherRentableArea: string;
  expectedFootTraffic: string;
  expectedRevenue: string;
  addFloors: string;
  floorNamingPattern: string;
  minPLIValue: string;
};

const CYAN = 'var(--spacespot-cyan-primary, #14D8CC)';
const NAVY = '#1a2b3c';

const sectionCardStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  border: '1px solid #dbe5ee',
  borderRadius: '10px',
  padding: '20px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid #cfd7e2',
  borderRadius: '6px',
  padding: '9px 12px',
  fontSize: '13px',
  color: '#1f2937',
  backgroundColor: '#f9fbfc',
  outline: 'none',
  boxSizing: 'border-box',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'none',
  paddingRight: '30px',
  cursor: 'pointer',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238fafc4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
};

const labelStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#374151',
  fontWeight: 600,
  marginBottom: '6px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
};

const twoColStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px',
};

const chipStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 14px',
  backgroundColor: '#eaf6f5',
  border: '1px solid #b2e0dc',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: 600,
  color: NAVY,
  cursor: 'pointer',
};

const iconBtnBase: React.CSSProperties = {
  width: '40px',
  height: '38px',
  borderRadius: '8px',
  border: 'none',
  display: 'grid',
  placeItems: 'center',
  cursor: 'pointer',
};

const sqMSuffix: React.CSSProperties = {
  position: 'absolute',
  right: '10px',
  top: '50%',
  transform: 'translateY(-50%)',
  fontSize: '11px',
  color: '#8fafc4',
  fontWeight: 500,
};

const fieldIcon = (Icon: React.ElementType) => <Icon size={13} color={CYAN} />;

const generateFloorNames = (
  count: number,
  pattern: string,
  customNames = ''
): string[] => {
  if (pattern === 'Other') {
    return customNames
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean);
  }

  const names: string[] = [];

  for (let i = 1; i <= count; i++) {
    if (pattern.startsWith('Level')) names.push(`Level ${i}`);
    else if (pattern.startsWith('Floor')) names.push(`Floor ${i}`);
    else if (pattern.startsWith('Ground')) {
      names.push(i === 1 ? 'Ground' : `Level ${i - 1}`);
    } else if (pattern.startsWith('With')) {
      if (i === 1) names.push('Basement');
      else if (i === 2) names.push('Ground');
      else names.push(`Level ${i - 2}`);
    }
  }

  return names;
};

export default function CreateSpace() {
  const navigate = useNavigate();

  const [form, setForm] = useState<SpaceFormState>({
    spaceName: '',
    category: 'Retail',
    spaceWebsite: '',
    tradingHours: '',
    managedByEmail: '',
    managedByPhone: '',
    spaceAddress: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    latitude: '',
    longitude: '',
    activeFrom: '',
    activeTo: '',
    ownership: '',
    management: '',
    overallRentableArea: '',
    permanentRentableArea: '',
    otherRentableArea: '',
    expectedFootTraffic: '',
    expectedRevenue: '',
    addFloors: '',
    floorNamingPattern: 'Level 1, Level 2, Level 3...',
    minPLIValue: '',
  });

  const [precinctInput, setPrecinctInput] = useState('');
  const [precincts, setPrecincts] = useState<string[]>([]);
  const [floorNames, setFloorNames] = useState<string[]>([]);
  const [spaceImages, setSpaceImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [documents, setDocuments] = useState<File[]>([]);
  const docInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [editingFloor, setEditingFloor] = useState<number | null>(null);
  const [editingFloorName, setEditingFloorName] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [customFloorNames, setCustomFloorNames] = useState('');

  const updateField = (key: keyof SpaceFormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const saveSpace = async (status: 'draft' | 'pending') => {
    try {
      const token = localStorage.getItem('sbp_token');

      if (!token) {
        toast.error('Please login again');
        navigate('/login');
        return;
      }

      if (!form.spaceName.trim()) {
        toast.error('Space name is required');
        return;
      }

      const formData = new FormData();

      formData.append('name', form.spaceName);
      formData.append('description', '');
      formData.append('address', form.spaceAddress);
      formData.append('city', form.city);
      formData.append('state', form.state);
      formData.append('country', form.country);
      formData.append('postal_code', form.postalCode);
      formData.append('latitude', String(Number(form.latitude)));
      formData.append('longitude', String(Number(form.longitude)));
      formData.append('total_area_sqm', String(Number(form.overallRentableArea) || 0));
      formData.append('floor_count', String(Number(form.addFloors) || 1));

      const floors = floorNames.map((name, index) => ({
        floor_number: String(index + 1),
        floor_name: name || `Floor ${index + 1}`,
        total_units: 0,
      }));

      formData.append('floors', JSON.stringify(floors));
      formData.append('amenities', JSON.stringify(precincts));
      formData.append('status', status);

      formData.append(
        'features',
        JSON.stringify({
          category: form.category === 'Other' ? customCategory : form.category,
          website: form.spaceWebsite,
          tradingHours: form.tradingHours,
          managedByEmail: form.managedByEmail,
          managedByPhone: form.managedByPhone,
          ownership: form.ownership,
          management: form.management,
          permanentRentableArea: form.permanentRentableArea,
          otherRentableArea: form.otherRentableArea,
          expectedFootTraffic: form.expectedFootTraffic,
          expectedRevenue: form.expectedRevenue,
          minPLIValue: form.minPLIValue,
          floorNames,
        })
      );

      spaceImages.forEach((image) => {
        formData.append('images', image);
      });

      documents.forEach((file) => {
        formData.append('documents', file);
      });

      const response = await fetch('http://localhost:3000/api/spaces', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to create space');
      }

      toast.success(
        status === 'draft'
          ? 'Space saved as draft'
          : 'Space submitted for approval'
      );

      navigate('/manage/spaces');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create space');
    }
  };

  const handleSaveDraft = () => saveSpace('draft');
  const handleSubmitForApproval = () => saveSpace('pending');

  const updateFloors = (
    count: number,
    pattern: string,
    customNames = customFloorNames
  ) => {
    if (pattern === 'Other') {
      setFloorNames(generateFloorNames(count, pattern, customNames));
    } else {
      setFloorNames(
        count > 0 && count <= 200 ? generateFloorNames(count, pattern) : []
      );
    }

    setEditingFloor(null);
  };

  const confirmFloorEdit = () => {
    if (editingFloor !== null && editingFloorName.trim()) {
      setFloorNames((prev) =>
        prev.map((n, i) => (i === editingFloor ? editingFloorName.trim() : n))
      );
    }
    setEditingFloor(null);
    setEditingFloorName('');
  };

  const cancelFloorEdit = () => {
    setEditingFloor(null);
    setEditingFloorName('');
  };

  const addPrecinct = () => {
    if (precinctInput.trim()) {
      setPrecincts((prev) => [...prev, precinctInput.trim()]);
      setPrecinctInput('');
    }
  };

  const filledCount = Object.values(form).filter(
    (v) => typeof v === 'string' && v.trim() !== ''
  ).length;
  const completionPct = Math.round((filledCount / Object.keys(form).length) * 100);

  const sectionHeader = (
    icon: React.ReactNode,
    title: string,
    subtitle?: string
  ) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '18px' }}>
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #14D8CC 0%, #0FB6C5 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '15px', fontWeight: 700, color: NAVY }}>{title}</div>
        {subtitle && <div style={{ fontSize: '12px', color: '#8a9ab0', marginTop: '2px' }}>{subtitle}</div>}
      </div>
    </div>
  );

  const textField = (
    label: string,
    Icon: React.ElementType,
    key: keyof SpaceFormState,
    placeholder: string,
    extra?: Partial<React.InputHTMLAttributes<HTMLInputElement>>
  ) => (
    <div>
      <label style={labelStyle}>{fieldIcon(Icon)} {label}</label>
      <input
        style={inputStyle}
        placeholder={placeholder}
        value={form[key]}
        onChange={(e) => updateField(key, e.target.value)}
        {...extra}
      />
    </div>
  );

  const areaField = (
    label: string,
    key: keyof SpaceFormState,
    placeholder: string
  ) => (
    <div>
      <label style={labelStyle}>{fieldIcon(Maximize2)} {label}</label>
      <div style={{ position: 'relative' }}>
        <input
          style={{ ...inputStyle, paddingRight: '45px' }}
          placeholder={placeholder}
          value={form[key]}
          onChange={(e) => updateField(key, e.target.value)}
        />
        <span style={sqMSuffix}>Sq M</span>
      </div>
    </div>
  );

  const sidebarRow = (Icon: React.ElementType, value: string, fallback: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5f7286', fontSize: '12px' }}>
      <Icon size={14} color="#8fafc4" />
      <span>{value || fallback}</span>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#eef2f6', minHeight: '100vh', padding: '16px 16px 32px' }}>
      <button
        type="button"
        onClick={() => navigate(-1)}
        style={{
          border: 'none',
          backgroundColor: '#fff',
          color: NAVY,
          borderRadius: '8px',
          padding: '8px 12px',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
          fontWeight: 600,
        }}
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 260px', gap: '16px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: NAVY }}>Create New Space</h1>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7e91' }}>Complete all the required details to register a new space</p>
          </div>

          <div style={sectionCardStyle}>
            {sectionHeader(<Info size={16} color="#fff" />, 'Basic Information', 'Primary space details and contact information')}
            <div style={{ display: 'grid', gap: '14px' }}>
              {textField('Space Name', Building2, 'spaceName', 'e.g., Beachside Canberra Mall')}

              <div style={twoColStyle}>
                <div>
                  <label style={labelStyle}>{fieldIcon(Layers)} Category</label>
                  <select
                    style={selectStyle}
                    value={form.category === 'Other' ? 'Other' : form.category}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === 'Other') {
                        updateField('category', 'Other');
                      } else {
                        setCustomCategory('');
                        updateField('category', value);
                      }
                    }}
                  >
                    <option value="Retail">Retail</option>
                    <option value="Commercial">Commercial</option>
                    <option value="CoWorking">CoWorking</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Other">Other</option>
                  </select>

                  {form.category === 'Other' && (
                    <input
                      style={{ ...inputStyle, marginTop: '6px' }}
                      placeholder="Enter custom category"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                    />
                  )}
                </div>

                <div>
                  <label style={labelStyle}>
                    {fieldIcon(Globe)} Space Website
                    <span style={{ fontWeight: 400, color: '#8a9ab0', fontSize: '11px' }}>(Optional)</span>
                  </label>
                  <input
                    style={inputStyle}
                    placeholder="www.beachsideactmall.co"
                    value={form.spaceWebsite}
                    onChange={(e) => updateField('spaceWebsite', e.target.value)}
                  />
                </div>
              </div>

              <div style={twoColStyle}>
                {textField('Trading Hours', Clock, 'tradingHours', '8:30 AM - 5:30 PM (Mon-...')}
                {textField('Managed By (Email)', Mail, 'managedByEmail', 'mallmanager@company.c')}
              </div>

              {textField('Managed By Phone', Phone, 'managedByPhone', '+61 411111111')}

              <div>
                <label style={labelStyle}>{fieldIcon(MapPin)} Space Address</label>
                <textarea
                  style={{
                    ...inputStyle,
                    minHeight: '80px',
                    resize: 'vertical',
                  }}
                  placeholder="Enter complete address"
                  value={form.spaceAddress}
                  onChange={(e) => updateField('spaceAddress', e.target.value)}
                />
              </div>

              <div style={twoColStyle}>
                <div>
                  <label style={labelStyle}>{fieldIcon(MapPin)} City</label>
                  <input
                    style={inputStyle}
                    placeholder="e.g., Sydney"
                    autoComplete="address-level2"
                    value={form.city}
                    onChange={(e) => updateField('city', e.target.value)}
                  />
                </div>

                <div>
                  <label style={labelStyle}>{fieldIcon(MapPin)} State</label>
                  <input
                    style={inputStyle}
                    placeholder="e.g., NSW"
                    autoComplete="address-level1"
                    value={form.state}
                    onChange={(e) => updateField('state', e.target.value)}
                  />
                </div>
              </div>

              <div style={twoColStyle}>
                <div>
                  <label style={labelStyle}>{fieldIcon(Globe)} Country <span style={{ color: 'red' }}>*</span></label>
                  <input
                    style={inputStyle}
                    placeholder="e.g., Australia"
                    autoComplete="country-name"
                    value={form.country}
                    onChange={(e) => updateField('country', e.target.value)}
                  />
                </div>

                <div>
                  <label style={labelStyle}>{fieldIcon(MapPin)} Postal Code <span style={{ color: 'red' }}>*</span></label>
                  <input
                    style={inputStyle}
                    placeholder="e.g., 2000"
                    autoComplete="postal-code"
                    value={form.postalCode}
                    onChange={(e) => updateField('postalCode', e.target.value)}
                  />
                </div>
              </div>

              <div style={twoColStyle}>
                <div>
                  <label style={labelStyle}>{fieldIcon(MapPin)} Latitude</label>
                  <input
                    type="number"
                    step="any"
                    min="-90"
                    max="90"
                    style={inputStyle}
                    placeholder="e.g., -33.8688"
                    value={form.latitude}
                    onChange={(e) => updateField('latitude', e.target.value)}
                  />
                </div>

                <div>
                  <label style={labelStyle}>{fieldIcon(MapPin)} Longitude</label>
                  <input
                    type="number"
                    step="any"
                    min="-180"
                    max="180"
                    style={inputStyle}
                    placeholder="e.g., 151.2093"
                    value={form.longitude}
                    onChange={(e) => updateField('longitude', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>{fieldIcon(ImageIcon)} Space Images</label>
                <input
                  ref={imageInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length > 0) {
                      setSpaceImages(files);
                      setImagePreview(URL.createObjectURL(files[0]));
                      e.target.value = '';
                    }
                  }}
                />

                <div
                  onClick={() => imageInputRef.current?.click()}
                  style={{
                    border: '1.5px dashed #b0bec8',
                    borderRadius: '8px',
                    padding: '24px 16px',
                    display: 'grid',
                    placeItems: 'center',
                    backgroundColor: '#fafcfd',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#eafaf8', display: 'grid', placeItems: 'center' }}>
                      <Upload size={18} color={CYAN} />
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7e91', fontWeight: 500 }}>Click to upload images</div>
                    <div style={{ fontSize: '11px', color: '#aab4bf' }}>PNG, JPG up to 25MB</div>
                  </div>
                </div>

                {spaceImages.length > 0 && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7e91' }}>
                    {spaceImages.length} image(s) selected
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={sectionCardStyle}>
            {sectionHeader(<Settings size={16} color="#fff" />, 'Operational Details')}
            <div style={{ display: 'grid', gap: '14px' }}>
              <div style={twoColStyle}>
                <div>
                  <label style={labelStyle}>{fieldIcon(Calendar)} Active From</label>
                  <input type="date" style={inputStyle} value={form.activeFrom} onChange={(e) => updateField('activeFrom', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>{fieldIcon(Calendar)} Active To</label>
                  <input type="date" style={inputStyle} value={form.activeTo} onChange={(e) => updateField('activeTo', e.target.value)} />
                </div>
              </div>

              <div style={twoColStyle}>
                {textField('Ownership', Building2, 'ownership', 'Business Name of the spa...')}
                {textField('Management', Users, 'management', 'Business Name of the con...')}
              </div>

              <div style={twoColStyle}>
                {areaField('Overall Rentable Area', 'overallRentableArea', 'e.g., 5000')}
                {areaField('Permanent Rentable Area', 'permanentRentableArea', 'e.g., 3800')}
              </div>

              <div style={twoColStyle}>
                {areaField('Other Rentable Area', 'otherRentableArea', 'e.g., 1200')}
                {textField('Expected Foot Traffic (per month)', Users, 'expectedFootTraffic', 'e.g., 10000')}
              </div>

              {textField('Expected Revenue for the Space (per month)', FileText, 'expectedRevenue', 'e.g., 100000')}

              <div>
                <label style={labelStyle}>{fieldIcon(Layers)} Add Floors</label>
                <div style={twoColStyle}>
                  <input
                    type="number"
                    min="0"
                    style={inputStyle}
                    placeholder="How many floors? (e.g., 5)"
                    value={form.addFloors}
                    onChange={(e) => {
                      updateField('addFloors', e.target.value);
                      updateFloors(parseInt(e.target.value, 10), form.floorNamingPattern);
                    }}
                  />
                  <div>
                    <select
                      style={selectStyle}
                      value={form.floorNamingPattern}
                      onChange={(e) => {
                        const value = e.target.value;
                        updateField('floorNamingPattern', value);

                        if (value === 'Other') {
                          setFloorNames([]);
                        } else {
                          setCustomFloorNames('');
                          updateFloors(parseInt(form.addFloors, 10), value);
                        }
                      }}
                    >
                      <option value="Level 1, Level 2, Level 3...">Level 1, Level 2, Level 3...</option>
                      <option value="Floor 1, Floor 2, Floor 3...">Floor 1, Floor 2, Floor 3...</option>
                      <option value="Ground, Level 1, Level 2...">Ground, Level 1, Level 2...</option>
                      <option value="With Basements">With Basements</option>
                      <option value="Other">Other</option>
                    </select>

                    {form.floorNamingPattern === 'Other' && (
                      <input
                        style={{ ...inputStyle, marginTop: '8px' }}
                        placeholder="Enter floor names separated by comma e.g. Ground, Mezzanine, Terrace"
                        value={customFloorNames}
                        onChange={(e) => {
                          setCustomFloorNames(e.target.value);
                          updateFloors(parseInt(form.addFloors, 10), 'Other', e.target.value);
                        }}
                      />
                    )}
                  </div>
                </div>

                <div style={{ fontSize: '11px', color: '#8a9ab0', marginTop: '5px' }}>
                  Select naming pattern – floors will be auto-named. You can edit names below.
                </div>

                {floorNames.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {floorNames.map((name, i) => (
                        <span
                          key={i}
                          onClick={() => {
                            setEditingFloor(i);
                            setEditingFloorName(name);
                          }}
                          style={{
                            ...chipStyle,
                            ...(editingFloor === i ? { backgroundColor: '#d5f5f2', border: '1.5px solid #14D8CC' } : {}),
                          }}
                        >
                          <Layers size={13} color={CYAN} />{name}
                        </span>
                      ))}
                    </div>

                    {editingFloor !== null && (
                      <div style={{ border: '1.5px dashed #14D8CC', borderRadius: '10px', padding: '14px 16px', backgroundColor: '#fafffe' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: NAVY, marginBottom: '10px' }}>
                          Edit Floor {editingFloor + 1} Name
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input
                            style={{ ...inputStyle, flex: 1 }}
                            value={editingFloorName}
                            onChange={(e) => setEditingFloorName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && confirmFloorEdit()}
                            autoFocus
                          />
                          <button type="button" onClick={confirmFloorEdit} style={{ ...iconBtnBase, backgroundColor: NAVY, color: '#fff' }}><Check size={18} /></button>
                          <button type="button" onClick={cancelFloorEdit} style={{ ...iconBtnBase, backgroundColor: '#9ca3af', color: '#fff' }}><X size={18} /></button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label style={labelStyle}>{fieldIcon(MapPin)} Add Precincts</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    style={{ ...inputStyle, flex: 1 }}
                    placeholder="e.g., Water Front"
                    value={precinctInput}
                    onChange={(e) => setPrecinctInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addPrecinct()}
                  />
                  <button
                    type="button"
                    onClick={addPrecinct}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '9px 18px', backgroundColor: NAVY, border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, color: '#fff', cursor: 'pointer', whiteSpace: 'nowrap' }}
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>

                {precincts.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                    {precincts.map((p, i) => (
                      <span key={i} style={{ padding: '5px 12px', backgroundColor: '#eaf6f5', border: '1px solid #b2e0dc', borderRadius: '6px', fontSize: '12px', fontWeight: 600, color: NAVY }}>{p}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={sectionCardStyle}>
            {sectionHeader(<Shield size={16} color="#fff" />, 'Lease Requirements')}
            <div style={{ display: 'grid', gap: '14px' }}>
              {textField('Min. Space Public Liability Insurance Value', Shield, 'minPLIValue', '1000000')}

              <div>
                <label style={labelStyle}>{fieldIcon(FileText)} Upload Documents</label>
                <input
                  ref={docInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => setDocuments(Array.from(e.target.files || []))}
                />

                <div
                  onClick={() => docInputRef.current?.click()}
                  style={{
                    border: '1.5px dashed #b0bec8',
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: '#fafcfd',
                  }}
                >
                  <Upload size={18} color={CYAN} />
                  <div style={{ fontSize: '12px', marginTop: '6px' }}>
                    Click to upload documents (PDF, DOC, Excel, Images)
                  </div>
                </div>

                {documents.length > 0 && (
                  <div style={{ marginTop: '8px', fontSize: '12px' }}>
                    {documents.length} file(s) selected
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
            <button
              type="button"
             onClick={() => {
                navigate("/home", { replace: true });

                setTimeout(() => {
                  window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: "auto",
                  });
                }, 300);
              }}
              
              style={{
                border: 'none',
                backgroundColor: 'Navy',
                color: '#fff',
                borderRadius: '8px',
                padding: '10px 24px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSaveDraft}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                border: 'none',
                backgroundColor: NAVY,
                color: '#fff',
                borderRadius: '8px',
                padding: '10px 24px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Check size={14} /> Save to Draft
            </button>
          </div>
        </div>

        <aside style={{ position: 'sticky', top: '16px' }}>
          <div style={{ backgroundColor: '#fff', border: '1.5px solid #9fe5df', borderRadius: '12px', padding: '16px', fontSize: '13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Building2 size={18} color="#2e455d" />
              <span style={{ fontWeight: 700, fontSize: '15px', color: NAVY }}>Space Summary</span>
            </div>

            <div
              style={{
                width: '100%',
                aspectRatio: '16 / 10',
                backgroundColor: '#17283e',
                borderRadius: '8px',
                overflow: 'hidden',
                marginBottom: '14px',
              }}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Space"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <ImageIcon size={24} color="#4a6a85" />
                    <span style={{ fontSize: '11px', color: '#4a6a85' }}>Space Main Image</span>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#eafaf8', borderRadius: '8px', padding: '10px 12px', marginBottom: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: CYAN, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700, fontSize: '16px', color: '#fff' }}>
                {form.spaceName ? form.spaceName.charAt(0).toUpperCase() : '?'}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '13px', color: NAVY }}>{form.spaceName || 'Space Name'}</div>
                <div style={{ fontSize: '11px', color: '#6b7e91', marginTop: '2px' }}>{form.category || 'Category'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
              {sidebarRow(MapPin, form.spaceAddress, 'No address')}
              {sidebarRow(Mail, form.managedByEmail, 'No email')}
              {sidebarRow(Phone, form.managedByPhone, 'No phone')}
            </div>

            <div style={{ height: '1px', backgroundColor: '#e4edf4', margin: '12px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: '#5f7286' }}>Form Completion</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: CYAN }}>{completionPct}%</span>
            </div>

            <div style={{ height: '6px', backgroundColor: '#e6edf3', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: `${completionPct}%`, height: '100%', backgroundColor: CYAN, borderRadius: '999px', transition: 'width 0.3s' }} />
            </div>

            <button
              type="button"
              onClick={handleSubmitForApproval}
              style={{
                width: '100%',
                marginTop: '14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: NAVY,
                color: '#fff',
                fontSize: '13px',
                padding: '11px 10px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Check size={14} /> Submit for Approval
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
