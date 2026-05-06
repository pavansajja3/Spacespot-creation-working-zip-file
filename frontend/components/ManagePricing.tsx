import { toast } from "sonner";
import React, { useMemo, useState } from 'react';
import {
  Activity,
  Building2,
  Calculator,
  ChevronDown,
  DollarSign,
  Lock,
  MapPinned,
  Ruler,
  Search,
  Sparkles,
  TrendingUp,
  Waves,
} from 'lucide-react';

type RevenueLevel = 'Low' | 'Medium' | 'High';
type DistanceToCity = 'Close' | 'Moderate' | 'Far';
type FootTrafficLevel = 'Low' | 'Medium' | 'High';
type LocationCategory = 'Secondary' | 'Prime' | 'Flagship';

interface PricingState {
  unitId: string;
  areaSqm: number;
  demandLevel: RevenueLevel;
  leaseMonths: number;
  basePrice: number;
  weeklyPrice: number;
  discountedPrice: number;
  customerDiscountPrice: number;
  demandAdjustment: number;
  footTrafficAdjustment: number;
  locationAdjustment: number;
  proximityAdjustment: number;
  revenueAdjustment: number;
  footTrafficLevel: FootTrafficLevel;
  locationCategory: LocationCategory;
  distanceToCity: DistanceToCity;
  revenueLevel: RevenueLevel;
}

const panelStyle: React.CSSProperties = {
  backgroundColor: 'var(--spacespot-white)',
  border: '1.5px solid var(--spacespot-cyan-primary)',
  borderRadius: '8px',
  padding: '12px',
};

const fieldLabelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '9px',
  fontWeight: 600,
  color: 'var(--spacespot-navy-primary)',
  marginBottom: '6px',
};

const fieldStyle: React.CSSProperties = {
  width: '100%',
  height: '32px',
  border: '1px solid #9aa8ba',
  borderRadius: '6px',
  backgroundColor: 'var(--spacespot-white)',
  padding: '0 10px',
  fontSize: '10px',
  color: 'var(--spacespot-navy-primary)',
  boxSizing: 'border-box',
};

const sectionTitleStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '11px',
  fontWeight: 600,
  color: 'var(--spacespot-navy-primary)',
  marginBottom: '12px',
};

export default function ManagePricing() {
  const [pricing, setPricing] = useState<PricingState>({
    unitId: 'BEACH-L1-U1',
    areaSqm: 10,
    demandLevel: 'High',
    leaseMonths: 12,
    basePrice: 1000,
    weeklyPrice: 700,
    discountedPrice: 950,
    customerDiscountPrice: 950,
    demandAdjustment: 1100,
    footTrafficAdjustment: 1050,
    locationAdjustment: 950,
    proximityAdjustment: 50,
    revenueAdjustment: 100,
    footTrafficLevel: 'High',
    locationCategory: 'Prime',
    distanceToCity: 'Close',
    revenueLevel: 'High',
  });

  const dynamicPrice = useMemo(() => {
    return (
      pricing.basePrice +
      pricing.demandAdjustment +
      pricing.footTrafficAdjustment +
      pricing.locationAdjustment +
      pricing.proximityAdjustment +
      pricing.revenueAdjustment
    );
  }, [pricing]);

  const projectedRevenue = useMemo(() => dynamicPrice * pricing.leaseMonths * 12 + pricing.weeklyPrice * 30, [dynamicPrice, pricing.leaseMonths, pricing.weeklyPrice]);

  const updateField = <K extends keyof PricingState>(field: K, value: PricingState[K]) => {
    setPricing((current) => ({ ...current, [field]: value }));
  };

  return (
    <div style={{ padding: '18px 22px 24px', backgroundColor: 'var(--spacespot-gray-50)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--spacespot-cyan-primary)',
                  display: 'grid',
                  placeItems: 'center',
                  boxShadow: '0 6px 10px rgba(20, 216, 204, 0.18)',
                }}
              >
                <DollarSign size={18} color="var(--spacespot-white)" />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--spacespot-navy-primary)' }}>Manage Pricing</div>
                <div style={{ fontSize: '11px', color: 'var(--spacespot-gray-500)' }}>Configure dynamic pricing and forecasting</div>
              </div>
            </div>
            <div style={{ width: '72px', height: '2px', backgroundColor: 'var(--spacespot-cyan-primary)', marginTop: '10px', borderRadius: '999px' }} />
          </div>

          <button
            type="button"
            style={{
              border: 'none',
              backgroundColor: 'var(--spacespot-navy-primary)',
              color: 'var(--spacespot-white)',
              borderRadius: '8px',
              height: '28px',
              padding: '0 11px',
              fontSize: '10px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              cursor: 'pointer',
            }}
          >
            All Spaces <ChevronDown size={12} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.95fr 0.95fr', gap: '12px', alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: '10px' }}>
            <div style={panelStyle}>
              <div style={sectionTitleStyle}>
                <span style={{ width: '18px', height: '18px', borderRadius: '6px', backgroundColor: 'var(--spacespot-cyan-pale)', display: 'grid', placeItems: 'center' }}>
                  <Lock size={10} color="var(--spacespot-cyan-primary)" />
                </span>
                Unit Selection
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={fieldLabelStyle}>Unit ID *</label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input value={pricing.unitId} onChange={(event) => updateField('unitId', event.target.value)} style={{ ...fieldStyle, flex: 1 }} />
                    <button type="button" style={{ width: '82px', border: 'none', borderRadius: '6px', backgroundColor: 'var(--spacespot-gray-500)', color: 'var(--spacespot-white)', fontSize: '9px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      <Search size={9} /> Lookup
                    </button>
                  </div>
                </div>
                <div>
                  <label style={fieldLabelStyle}>Unit Area (Sq.M)</label>
                  <input type="number" value={pricing.areaSqm} onChange={(event) => updateField('areaSqm', Number(event.target.value))} style={fieldStyle} />
                </div>
                <div>
                  <label style={fieldLabelStyle}>Unit Demand <span style={{ fontWeight: 400, color: 'var(--spacespot-gray-400)', fontSize: '8px' }}>(Based on last 12 months)</span></label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={pricing.demandLevel}
                      onChange={(event) => updateField('demandLevel', event.target.value as RevenueLevel)}
                      style={{
                        ...fieldStyle,
                        appearance: 'none',
                        backgroundColor: '#ecfaf3',
                        color: 'var(--spacespot-success)',
                        fontWeight: 600,
                        paddingRight: '28px',
                      }}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                    <ChevronDown size={13} color="var(--spacespot-success)" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  </div>
                </div>
                <div>
                  <label style={fieldLabelStyle}>Leased Period (Months)</label>
                  <input type="number" value={pricing.leaseMonths} onChange={(event) => updateField('leaseMonths', Number(event.target.value))} style={fieldStyle} />
                </div>
              </div>
            </div>

            <div style={panelStyle}>
              <div style={sectionTitleStyle}>
                <span style={{ width: '18px', height: '18px', borderRadius: '6px', backgroundColor: 'var(--spacespot-cyan-pale)', display: 'grid', placeItems: 'center' }}>
                  <DollarSign size={10} color="var(--spacespot-cyan-primary)" />
                </span>
                Base Pricing
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={fieldLabelStyle}>Base Price (AUD)</label>
                  <input type="number" value={pricing.basePrice} onChange={(event) => updateField('basePrice', Number(event.target.value))} style={fieldStyle} />
                </div>
                <div>
                  <label style={fieldLabelStyle}>Weekly Price (AUD)</label>
                  <input type="number" value={pricing.weeklyPrice} onChange={(event) => updateField('weeklyPrice', Number(event.target.value))} style={fieldStyle} />
                </div>
                <div>
                  <label style={fieldLabelStyle}>Applied Discounted Price <span style={{ fontWeight: 400, color: 'var(--spacespot-gray-400)' }}>(Price leased assessment)</span></label>
                  <input type="number" value={pricing.discountedPrice} onChange={(event) => updateField('discountedPrice', Number(event.target.value))} style={fieldStyle} />
                </div>
                <div>
                  <label style={fieldLabelStyle}>Customer Discount Price</label>
                  <input type="number" value={pricing.customerDiscountPrice} onChange={(event) => updateField('customerDiscountPrice', Number(event.target.value))} style={fieldStyle} />
                </div>
              </div>
            </div>

            <div style={panelStyle}>
              <div style={sectionTitleStyle}>
                <span style={{ width: '18px', height: '18px', borderRadius: '6px', backgroundColor: 'var(--spacespot-cyan-pale)', display: 'grid', placeItems: 'center' }}>
                  <Sparkles size={10} color="var(--spacespot-cyan-primary)" />
                </span>
                Dynamic Pricing Factors
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={fieldLabelStyle}>Price due to Demand <span style={{ fontWeight: 400, color: 'var(--spacespot-gray-400)' }}>(Foot traffic data)</span></label>
                  <input type="number" value={pricing.demandAdjustment} onChange={(event) => updateField('demandAdjustment', Number(event.target.value))} style={fieldStyle} />
                </div>
                <div>
                  <label style={fieldLabelStyle}>Foot Traffic Level</label>
                  <select value={pricing.footTrafficLevel} onChange={(event) => updateField('footTrafficLevel', event.target.value as FootTrafficLevel)} style={fieldStyle}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label style={fieldLabelStyle}>Price due to Location</label>
                  <input type="number" value={pricing.locationAdjustment} onChange={(event) => updateField('locationAdjustment', Number(event.target.value))} style={fieldStyle} />
                </div>
                <div>
                  <label style={fieldLabelStyle}>Location Category</label>
                  <select value={pricing.locationCategory} onChange={(event) => updateField('locationCategory', event.target.value as LocationCategory)} style={fieldStyle}>
                    <option value="Secondary">Secondary</option>
                    <option value="Prime">Prime</option>
                    <option value="Flagship">Flagship</option>
                  </select>
                </div>
                <div>
                  <label style={fieldLabelStyle}>Price due to Foot Traffic</label>
                  <input type="number" value={pricing.footTrafficAdjustment} onChange={(event) => updateField('footTrafficAdjustment', Number(event.target.value))} style={fieldStyle} />
                </div>
                <div>
                  <label style={fieldLabelStyle}>Distance to City</label>
                  <select value={pricing.distanceToCity} onChange={(event) => updateField('distanceToCity', event.target.value as DistanceToCity)} style={fieldStyle}>
                    <option value="Close">Close</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Far">Far</option>
                  </select>
                </div>
                <div>
                  <label style={fieldLabelStyle}>Price due to Proximity <span style={{ fontWeight: 400, color: 'var(--spacespot-gray-400)' }}>(Optional)</span></label>
                  <input type="number" value={pricing.proximityAdjustment} onChange={(event) => updateField('proximityAdjustment', Number(event.target.value))} style={fieldStyle} />
                </div>
                <div>
                  <label style={fieldLabelStyle}>Revenue Level</label>
                  <select value={pricing.revenueLevel} onChange={(event) => updateField('revenueLevel', event.target.value as RevenueLevel)} style={fieldStyle}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label style={fieldLabelStyle}>Price due to Revenue</label>
                  <input type="number" value={pricing.revenueAdjustment} onChange={(event) => updateField('revenueAdjustment', Number(event.target.value))} style={fieldStyle} />
                </div>
                <div>
                  <label style={fieldLabelStyle}>Dynamic Pricing (AUD)</label>
                  <input type="number" value={dynamicPrice} readOnly style={{ ...fieldStyle, backgroundColor: 'var(--spacespot-gray-50)' }} />
                </div>
              </div>
            </div>

            <div style={{ ...panelStyle, maxWidth: '520px' }}>
              <div style={sectionTitleStyle}>
                <span style={{ width: '18px', height: '18px', borderRadius: '6px', backgroundColor: 'var(--spacespot-cyan-pale)', display: 'grid', placeItems: 'center' }}>
                  <TrendingUp size={10} color="var(--spacespot-cyan-primary)" />
                </span>
                Annual Forecast
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={fieldLabelStyle}>Projected Annual Revenue (AUD)</label>
                  <input type="number" value={365000} readOnly style={fieldStyle} />
                </div>
                <div style={{ border: '1.5px solid var(--spacespot-cyan-primary)', borderRadius: '8px', padding: '10px 12px', backgroundColor: 'var(--spacespot-white)' }}>
                  <div style={{ fontSize: '8px', color: 'var(--spacespot-gray-400)', marginBottom: '6px' }}>Calculated Forecast</div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--spacespot-success)' }}>${projectedRevenue.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '10px', position: 'sticky', top: '86px' }}>
            <div style={panelStyle}>
              <div style={sectionTitleStyle}>
                <span style={{ width: '18px', height: '18px', borderRadius: '6px', backgroundColor: 'var(--spacespot-cyan-pale)', display: 'grid', placeItems: 'center' }}>
                  <Calculator size={10} color="var(--spacespot-cyan-primary)" />
                </span>
                Pricing Factors
              </div>

              <div style={{ display: 'grid', gap: '10px' }}>
                {[
                  { label: 'Area (Sq.M)', value: `${pricing.areaSqm}`, Icon: Ruler },
                  { label: 'Unit', value: pricing.unitId, Icon: Building2 },
                  { label: 'Base Price (AUD)', value: `${pricing.basePrice}`, Icon: DollarSign },
                  { label: 'Foot Traffic', value: pricing.footTrafficLevel.toLowerCase(), Icon: Activity },
                  { label: 'Distance to City', value: pricing.distanceToCity.toLowerCase(), Icon: MapPinned },
                  { label: 'Revenue Level', value: pricing.revenueLevel.toLowerCase(), Icon: TrendingUp },
                  { label: 'Demand', value: `${pricing.demandLevel.toLowerCase()} (12 month)`, Icon: Waves },
                  { label: 'Dynamic Price', value: `$${dynamicPrice}`, Icon: Sparkles },
                ].map(({ label, value, Icon }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9px', color: 'var(--spacespot-gray-500)', backgroundColor: 'var(--spacespot-gray-50)', borderRadius: '7px', padding: '7px 8px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Icon size={10} color="var(--spacespot-cyan-primary)" />
                      {label}
                    </span>
                    <span style={{ color: 'var(--spacespot-navy-primary)', fontWeight: 600 }}>{value}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--spacespot-gray-200)' }}>
                <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--spacespot-navy-primary)', marginBottom: '8px' }}>Price Summary</div>
                <div style={{ display: 'grid', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--spacespot-gray-500)' }}><span>Base Price:</span><span>${pricing.basePrice}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--spacespot-gray-500)' }}><span>Weekly Price:</span><span>${pricing.weeklyPrice}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--spacespot-gray-500)' }}><span>Discounted:</span><span style={{ color: 'var(--spacespot-cyan-primary)', fontWeight: 600 }}>${pricing.discountedPrice}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--spacespot-navy-primary)', fontWeight: 700, marginTop: '4px' }}><span>Dynamic Price:</span><span style={{ color: 'var(--spacespot-cyan-primary)' }}>${dynamicPrice}</span></div>
                </div>
              </div>

              <button
                type="button"
                style={{
                  marginTop: '14px',
                  width: '100%',
                  height: '32px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: 'var(--spacespot-navy-primary)',
                  color: 'var(--spacespot-white)',
                  fontSize: '10px',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <Calculator size={11} /> Recalculate Pricing
              </button>
            </div>

            <div style={{ ...panelStyle, padding: '10px 12px' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--spacespot-cyan-dark)', marginBottom: '6px' }}>Dynamic Pricing</div>
              <div style={{ fontSize: '8px', lineHeight: 1.5, color: 'var(--spacespot-gray-500)' }}>
                Prices are calculated based on multiple parameters including seasonal demand, foot traffic, and revenue performance.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

