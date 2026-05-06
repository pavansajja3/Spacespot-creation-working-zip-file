import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {BarChart3,Building2,Check,Lock,Mail,MessageSquareText,Play,Star,User,} 
from 'lucide-react';
import Logo from './Logo';

type SignUpForm = {
  fullName: string;
  email: string;
  password: string;
};

type FormErrors = Partial<Record<keyof SignUpForm | 'submit', string>>;

const brandLogos = ['wework', 'Square', 'CBRE', 'COMPASS'];

const heroMetrics = [
  { value: '500+', label: 'Spaces Managed' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '24/7', label: 'Support Available' },
];

const featureCards = [
  {
    title: 'Unit & Lease Tracking',
    icon: Building2,
    accent: '#1DB8C9',
    bullets: ['Track occupancy and lease expirations', 'Monitor rent payments', 'Centralize all property data'],
    visual: 'property',
  },
  {
    title: 'Visual Analytics',
    icon: BarChart3,
    accent: '#16B1D8',
    bullets: ['Get actionable insights in real-time', 'Track occupancy trends & revenue', 'Identify opportunities for growth'],
    visual: 'analytics',
  },
  {
    title: 'Tenant Communication',
    icon: MessageSquareText,
    accent: '#339DD5',
    bullets: ['Streamline communication with tenants', 'Manage maintenance requests', 'Improve tenant retention'],
    visual: 'messages',
  },
];

const ds = {
  colors: {
    textPrimary: 'var(--spacespot-text-primary)',
    textSecondary: 'var(--spacespot-text-secondary)',
    heroTitle: 'var(--spacespot-hero-title)',
    heroBody: 'var(--spacespot-hero-body)',
    borderSubtle: 'var(--spacespot-border-subtle)',
    surface: 'var(--spacespot-surface-primary)',
    surfaceStrong: 'var(--spacespot-glass-surface-strong)',
    glass: 'var(--spacespot-glass-surface)',
    glassBorder: 'var(--spacespot-glass-border)',
    cyan: 'var(--spacespot-cyan-primary)',
    success: 'var(--spacespot-success)',
    white: 'var(--spacespot-white)',
  },
  type: {
    xs: 'var(--spacespot-text-xs)',
    sm: 'var(--spacespot-text-sm)',
    base: 'var(--spacespot-text-base)',
    lg: 'var(--spacespot-text-lg)',
    h2: 'var(--spacespot-heading-2)',
  },
  radius: {
    sm: 'var(--spacespot-radius-base)',
    md: 'var(--spacespot-radius-md)',
    lg: 'var(--spacespot-radius-lg)',
    xl: 'var(--spacespot-radius-xl)',
    xxl: 'var(--spacespot-radius-2xl)',
    full: 'var(--spacespot-radius-full)',
  },
  space: {
    xs: 'var(--spacespot-space-1)',
    sm: 'var(--spacespot-space-2)',
    md: 'var(--spacespot-space-3)',
    lg: 'var(--spacespot-space-4)',
    xl: 'var(--spacespot-space-5)',
    xxl: 'var(--spacespot-space-6)',
    xxxl: 'var(--spacespot-space-8)',
  },
  shadows: {
    hero: 'var(--spacespot-elevation-hero)',
    panel: 'var(--spacespot-elevation-panel)',
    card: 'var(--spacespot-elevation-card)',
    button: 'var(--spacespot-elevation-button)',
    sm: 'var(--spacespot-shadow-sm)',
  },
  gradients: {
    primary: 'linear-gradient(90deg, #0FB6C5 0%, #17D1C6 100%)',
  },
};

const socialButtonBaseStyle: React.CSSProperties = {
  width: '100%',
  height: '44px',
  borderRadius: ds.radius.sm,
  border: `1px solid ${ds.colors.borderSubtle}`,
  backgroundColor: ds.colors.surface,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: ds.space.sm,
  cursor: 'pointer',
  fontSize: ds.type.sm,
  fontWeight: 600,
  color: ds.colors.textPrimary,
  boxShadow: ds.shadows.sm,
};

function GoogleBadge() {
  return (
    <div
      aria-hidden={true}
      style={{
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        background: 'conic-gradient(#EA4335 0deg 90deg, #FBBC05 90deg 180deg, #34A853 180deg 270deg, #4285F4 270deg 360deg)',
        position: 'relative',
      }}
    >
      <div style={{ position: 'absolute', inset: '3px', backgroundColor: '#FFFFFF', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', left: '8px', top: '7px', width: '7px', height: '4px', backgroundColor: '#4285F4', borderRadius: '3px' }} />
    </div>
  );
}

function MicrosoftBadge() {
  return (
    <div
      aria-hidden={true}
      style={{ width: '16px', height: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2px' }}
    >
      {['#F25022', '#7FBA00', '#00A4EF', '#FFB900'].map((color) => (
        <span key={color} style={{ backgroundColor: color, borderRadius: '1px' }} />
      ))}
    </div>
  );
}

export default function SignUp() {
  const navigate = useNavigate();
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);
  const [form, setForm] = useState<SignUpForm>({ fullName: '', email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const updateField = (field: keyof SignUpForm, value: string) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined, submit: undefined }));
  };

  const validateForm = (values: SignUpForm): FormErrors => {
    const nextErrors: FormErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!values.fullName.trim()) {
      nextErrors.fullName = 'Full name is required.';
    } else if (values.fullName.trim().length < 2) {
      nextErrors.fullName = 'Use at least 2 characters.';
    }

    if (!values.email.trim()) {
      nextErrors.email = 'Email address is required.';
    } else if (!emailPattern.test(values.email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!values.password) {
      nextErrors.password = 'Password is required.';
    } else if (values.password.length < 8) {
      nextErrors.password = 'Use at least 8 characters.';
    } else if (!/[A-Za-z]/.test(values.password) || !/[0-9]/.test(values.password)) {
      nextErrors.password = 'Include at least one letter and one number.';
    }

    return nextErrors;
  };

  const validateSingleField = (field: keyof SignUpForm, value: string) => {
    const fieldErrors = validateForm({ ...form, [field]: value });
    setErrors((currentErrors) => ({ ...currentErrors, [field]: fieldErrors[field], submit: undefined }));
  };

  const handleCreateAccount = async (event: React.FormEvent) => {
    event.preventDefault();

    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const nameParts = form.fullName.trim().split(" ");
const firstName = nameParts[0];
const lastName = nameParts.slice(1).join(" ") || "User";

const res = await fetch("http://localhost:3000/api/auth/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    first_name: firstName,
    last_name: lastName,
    email: form.email.trim().toLowerCase(),
    password: form.password,
  }),
});

      const data = await res.json();

      if (!res.ok) {
        setErrors({ submit: data.message || "Signup failed" });
        return;
      }

      navigate("/login", {
        state: {
          signupSuccess: true,
          email: form.email.trim().toLowerCase(),
        },
      });
    } catch (err) {
      console.error("Signup error:", err);
      setErrors({ submit: "Server error. Try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isTablet = viewportWidth < 1120;
  const isMobile = viewportWidth < 820;

  const fieldWrapperStyle = (field: keyof SignUpForm): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: ds.space.sm,
    height: '46px',
    borderRadius: ds.radius.sm,
    border: errors[field] ? '1px solid var(--spacespot-error)' : `1px solid ${ds.colors.borderSubtle}`,
    backgroundColor: ds.colors.surface,
    padding: '0 14px',
    boxShadow: ds.shadows.sm,
  });

  const inputStyle: React.CSSProperties = {
    border: 'none',
    outline: 'none',
    width: '100%',
    backgroundColor: 'transparent',
    color: ds.colors.textPrimary,
    fontSize: ds.type.sm,
  };

  const floatingCardStyle = (
    left: string,
    top: string,
    width: string,
    height?: string,
  ): React.CSSProperties => ({
    position: 'absolute',
    left,
    top,
    width,
    minHeight: height,
    backgroundColor: ds.colors.surfaceStrong,
    border: `1px solid ${ds.colors.glassBorder}`,
    borderRadius: ds.radius.xxl,
    boxShadow: ds.shadows.hero,
    backdropFilter: 'blur(18px)',
  });

  const renderMockDashboard = () => (
    <div style={{ position: 'relative', flex: 1, minHeight: isMobile ? 'auto' : isTablet ? '460px' : '480px' }}>
      {/* Revenue Card */}
      <div
        style={{
          ...floatingCardStyle(isMobile ? '0' : isTablet ? '12%' : '10%', '0', isMobile ? '100%' : isTablet ? '78%' : '78%'),
          padding: '12px 14px',
          borderRadius: '18px',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '9px', height: '9px', borderRadius: '3px', backgroundColor: ds.colors.cyan }} />
          <div style={{ fontSize: ds.type.sm, fontWeight: 600, color: ds.colors.textPrimary }}>Revenue</div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: ds.colors.textPrimary, lineHeight: 1 }}>96%</div>
            <div style={{ fontSize: ds.type.xs, color: ds.colors.success, fontWeight: 700 }}>+5%</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
          <span style={{ fontSize: isMobile ? '26px' : '28px', fontWeight: 700, color: ds.colors.textPrimary, lineHeight: 1 }}>$56,420</span>
          <span style={{ fontSize: ds.type.xs, color: ds.colors.success, fontWeight: 700 }}>+12%</span>
        </div>

        <div style={{ marginTop: '8px', height: '32px', borderRadius: '10px', background: 'linear-gradient(180deg, rgba(20, 216, 204, 0.1) 0%, rgba(20, 216, 204, 0.02) 100%)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: '8px', width: 'calc(100% - 16px)', height: '8px', background: 'rgba(20,216,204,0.18)', borderRadius: '4px' }} />
        </div>
      </div>

      {/* Occupancy Card */}
      <div
        style={{
          ...floatingCardStyle(isMobile ? '0' : isTablet ? '6%' : '4%', isMobile ? 'auto' : isTablet ? '150px' : '145px', isMobile ? '100%' : isTablet ? '78%' : '78%'),
          padding: '12px 14px',
          borderRadius: '18px',
          marginTop: isMobile ? '10px' : '0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: ds.type.sm, fontWeight: 600, color: ds.colors.textPrimary }}>Occupancy</span>
          <span style={{ fontSize: ds.type.xs, color: ds.colors.textSecondary }}>36 units</span>
        </div>
        <div style={{ marginTop: '6px', display: 'grid', gridTemplateColumns: 'auto auto auto', alignItems: 'end', gap: '8px' }}>
          <span style={{ fontSize: '28px', lineHeight: 1, fontWeight: 700, color: ds.colors.textPrimary }}>340</span>
          <span style={{ fontSize: ds.type.xs, color: ds.colors.textSecondary, marginBottom: '4px' }}>95</span>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', marginBottom: '4px', justifySelf: 'end' }}>
            <span style={{ width: '8px', height: '16px', borderRadius: '6px', backgroundColor: 'rgba(20,216,204,0.35)' }} />
            <span style={{ width: '8px', height: '24px', borderRadius: '6px', backgroundColor: ds.colors.cyan }} />
          </div>
        </div>
      </div>

      {/* Upcoming Expiries Card */}
      <div
        style={{
          ...floatingCardStyle(isMobile ? '0' : isTablet ? '14%' : '12%', isMobile ? 'auto' : isTablet ? '280px' : '275px', isMobile ? '100%' : isTablet ? '72%' : '72%'),
          padding: '12px 14px',
          borderRadius: '18px',
          marginTop: isMobile ? '10px' : '0',
        }}
      >
        <div style={{ fontSize: ds.type.xs, color: ds.colors.textSecondary, fontWeight: 600, marginBottom: '6px' }}>Upcoming Expiries</div>
        <div style={{ display: 'grid', gap: '4px' }}>
          {[
            ['Unit 12A', '4 days'],
            ['Loft 303', '10 days'],
            ['Apt 7F', '15 days'],
          ].map(([unit, days]) => (
            <div key={unit} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10px', color: ds.colors.textPrimary }}>
              <span>{unit}</span>
              <span style={{ color: ds.colors.textSecondary }}>{days}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFeatureVisual = (visual: string) => {
    if (visual === 'property') {
      return (
        <div
          style={{
            height: '128px',
            borderRadius: '18px',
            background: 'linear-gradient(160deg, #8FD5F2 0%, #DDF7FF 42%, #6DB3D1 100%)',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: 'inset 0 0 0 1px rgba(32, 49, 76, 0.08)',
          }}
        >
          <div style={{ position: 'absolute', inset: '26px 20px 18px', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 0.55fr', gap: '8px', alignItems: 'end' }}>
            {[72, 96, 58].map((height, index) => (
              <div key={index} style={{ height: `${height}px`, borderRadius: '10px 10px 0 0', background: index === 1 ? '#3E8EB2' : '#5EA7CA', boxShadow: '0 6px 18px rgba(36, 79, 108, 0.12)' }} />
            ))}
          </div>
          <div style={{ position: 'absolute', left: '16px', right: '16px', bottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#FFFFFF', fontSize: '11px', fontWeight: 600 }}>
            <span>Downtown Lofts</span>
            <span style={{ opacity: 0.9 }}>120 Active</span>
          </div>
        </div>
      );
    }

    if (visual === 'analytics') {
      return (
        <div
          style={{
            height: '128px',
            borderRadius: '18px',
            background: 'linear-gradient(180deg, #F9FBFD 0%, #EEF7FC 100%)',
            padding: '14px',
            boxShadow: 'inset 0 0 0 1px rgba(32, 49, 76, 0.08)',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '10px' }}>
            {[
              ['95%', 'Performance'],
              ['$56,420', 'Rev monthly'],
              ['200+', 'Reports'],
            ].map(([value, label]) => (
              <div key={label} style={{ borderRadius: '12px', backgroundColor: '#FFFFFF', padding: '10px' }}>
                <div style={{ fontSize: '22px', fontWeight: 700, color: '#20314C', lineHeight: 1 }}>{value}</div>
                <div style={{ marginTop: '4px', fontSize: '10px', color: '#6B7280' }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '10px', height: '44px' }}>
            <div style={{ borderRadius: '12px', backgroundColor: '#FFFFFF', padding: '10px', display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
              {[12, 18, 14, 21, 24, 28].map((height, index) => (
                <span key={index} style={{ flex: 1, height: `${height}px`, borderRadius: '999px 999px 0 0', backgroundColor: index > 2 ? '#14D8CC' : 'rgba(20, 216, 204, 0.28)' }} />
              ))}
            </div>
            <div style={{ borderRadius: '12px', backgroundColor: '#FFFFFF', padding: '10px', display: 'grid', gap: '6px' }}>
              {[72, 52, 86].map((width, index) => (
                <div key={index} style={{ height: '8px', borderRadius: '999px', backgroundColor: 'rgba(32, 49, 76, 0.08)', overflow: 'hidden' }}>
                  <div style={{ width: `${width}%`, height: '100%', borderRadius: '999px', backgroundColor: index === 1 ? '#A9B8CA' : '#14D8CC' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        style={{
          height: '128px',
          borderRadius: '18px',
          background: 'linear-gradient(180deg, #FAFCFE 0%, #EFF6FB 100%)',
          padding: '10px',
          display: 'grid',
          gap: '7px',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 0 1px rgba(32, 49, 76, 0.08)',
        }}
      >
        {[
          ['Samantha Lee', '20 mins ago'],
          ['Joseph Kirkland', '1 hr ago'],
          ['Debra Bryer', '3 hrs ago'],
        ].map(([name, time], index) => (
          <div key={name} style={{ display: 'grid', gridTemplateColumns: '24px 1fr auto', gap: '8px', alignItems: 'center', borderRadius: '10px', backgroundColor: '#FFFFFF', padding: '5px 8px' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0, backgroundColor: index === 0 ? '#F4C7B6' : index === 1 ? '#D4E2F8' : '#C9E8D7' }} />
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#20314C' }}>{name}</div>
              <div style={{ fontSize: '10px', color: '#6B7280' }}>Maintenance update</div>
            </div>
            <div style={{ fontSize: '10px', color: '#8CA4BC' }}>{time}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #F0F7FB 0%, #E8F4FA 40%, #FFFFFF 100%)' }}>
      <div style={{ maxWidth: '1380px', margin: '0 auto', padding: isMobile ? '0 16px' : isTablet ? '0 24px' : '0 34px' }}>
        {/* Header */}
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 0' }}>
          <Logo size={isMobile ? 140 : 170} />
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                type="button"
                onClick={() => navigate('/login')}
                style={{
                  height: '44px',
                  padding: '0 24px',
                  border: `1px solid ${ds.colors.borderSubtle}`,
                  borderRadius: ds.radius.md,
                  backgroundColor: ds.colors.surfaceStrong,
                  color: ds.colors.textPrimary,
                  fontSize: ds.type.sm,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => navigate('/login')}
                style={{
                  height: '44px',
                  padding: '0 24px',
                  border: 'none',
                  borderRadius: ds.radius.md,
                  background: ds.gradients.primary,
                  color: ds.colors.white,
                  fontSize: ds.type.sm,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: ds.shadows.button,
                }}
              >
                Get Started
              </button>
            </div>
          )}
        </header>

        {/* Hero Section */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'minmax(0, 1fr) 370px' : 'minmax(0, 1fr) 360px',
            gap: isMobile ? '24px' : isTablet ? '24px' : '30px',
            alignItems: 'start',
          }}
        >
          {/* Left Column: Hero Text + Dashboard */}
          <div style={{ position: 'relative', display: 'grid', alignContent: 'start', minHeight: isMobile ? 'auto' : isTablet ? '460px' : '480px' }}>
            <div>
              <div style={{ maxWidth: isMobile ? '100%' : isTablet ? '360px' : '420px', paddingTop: isMobile ? '8px' : '0' }}>
                <h1
                  style={{
                    margin: 0,
                    fontFamily: 'var(--spacespot-font-accent)',
                    fontSize: isMobile ? '48px' : isTablet ? '52px' : '58px',
                    lineHeight: isMobile ? 1.02 : 1,
                    letterSpacing: '-0.05em',
                    fontWeight: 700,
                    color: ds.colors.heroTitle,
                    maxWidth: '420px',
                  }}
                >
                  Manage Your Spaces
                  <br />
                  Effortlessly
                </h1>
                <p
                  style={{
                    margin: isMobile ? '14px 0 0' : '16px 0 0',
                    fontSize: isMobile ? '18px' : '19px',
                    lineHeight: 1.55,
                    color: ds.colors.heroBody,
                    maxWidth: '500px',
                  }}
                >
                  The all-in-one platform to track revenue, manage leases, and optimize occupancy.
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginTop: '22px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const formElement = document.getElementById('spacespot-signup-form');
                      formElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    style={{
                      height: '50px',
                      padding: '0 24px',
                      border: 'none',
                      borderRadius: ds.radius.md,
                      background: ds.gradients.primary,
                      color: ds.colors.white,
                      fontSize: '17px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: ds.shadows.button,
                    }}
                  >
                    Get Started
                  </button>

                  <button
                    type="button"
                    style={{
                      height: '50px',
                      padding: '0 22px',
                      borderRadius: ds.radius.md,
                      border: `1px solid ${ds.colors.borderSubtle}`,
                      backgroundColor: ds.colors.surfaceStrong,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      color: ds.colors.heroTitle,
                      fontSize: '17px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: ds.shadows.hero,
                    }}
                  >
                    <Play size={18} /> Watch Demo
                  </button>
                </div>

                <div style={{ marginTop: '14px', fontSize: '15px', color: ds.colors.textSecondary }}>
                  Free 14-day trial · No credit card required
                </div>
              </div>
            </div>

            <div>
              {isMobile ? (
                <div style={{ marginTop: '20px' }}>{renderMockDashboard()}</div>
              ) : (
                <div
                  style={{
                    position: 'absolute',
                    left: isTablet ? '240px' : '370px',
                    top: isTablet ? '14px' : '12px',
                    width: isTablet ? '360px' : '360px',
                  }}
                >
                  {renderMockDashboard()}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sign Up Form */}
          <aside
            id="spacespot-signup-form"
            style={{
              backgroundColor: ds.colors.surfaceStrong,
              borderRadius: ds.radius.xxl,
              padding: isMobile ? '22px 18px' : '26px 24px',
              boxShadow: ds.shadows.panel,
              border: `1px solid ${ds.colors.glassBorder}`,
              backdropFilter: 'blur(20px)',
              alignSelf: isMobile ? 'stretch' : 'start',
              marginTop: isMobile ? 0 : '70px',
            }}
          >
            <div style={{ fontSize: isMobile ? '22px' : '28px', lineHeight: 1.15, fontWeight: 700, color: ds.colors.textPrimary, maxWidth: '320px' }}>
              Get Started with SpaceSpot
            </div>
            <p style={{ margin: '10px 0 0', fontSize: ds.type.sm, lineHeight: 1.55, color: ds.colors.textSecondary }}>
              Sign up now to streamline your space management. No credit card required.
            </p>

            <form onSubmit={handleCreateAccount} style={{ marginTop: '22px', display: 'grid', gap: '12px' }}>
              <div>
                <div style={fieldWrapperStyle('fullName')}>
                  <User size={18} color="#7C8EA4" />
                  <input
                    value={form.fullName}
                    onChange={(event) => updateField('fullName', event.target.value)}
                    onBlur={(event) => validateSingleField('fullName', event.target.value)}
                    placeholder="Full Name"
                    aria-label="Full Name"
                    style={inputStyle}
                  />
                </div>
                {errors.fullName ? <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--spacespot-error)' }}>{errors.fullName}</div> : null}
              </div>

              <div>
                <div style={fieldWrapperStyle('email')}>
                  <Mail size={18} color="#7C8EA4" />
                  <input
                    value={form.email}
                    onChange={(event) => updateField('email', event.target.value)}
                    onBlur={(event) => validateSingleField('email', event.target.value)}
                    placeholder="Email Address"
                    aria-label="Email Address"
                    style={inputStyle}
                  />
                </div>
                {errors.email ? <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--spacespot-error)' }}>{errors.email}</div> : null}
              </div>

              <div>
                <div style={fieldWrapperStyle('password')}>
                  <Lock size={18} color="#7C8EA4" />
                  <input
                    type="password"
                    value={form.password}
                    onChange={(event) => updateField('password', event.target.value)}
                    onBlur={(event) => validateSingleField('password', event.target.value)}
                    placeholder="Password"
                    aria-label="Password"
                    style={inputStyle}
                  />
                </div>
                {errors.password ? <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--spacespot-error)' }}>{errors.password}</div> : null}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  marginTop: '4px',
                  height: '48px',
                  border: 'none',
                  borderRadius: ds.radius.md,
                  background: ds.gradients.primary,
                  color: ds.colors.white,
                  fontSize: '18px',
                  fontWeight: 700,
                  cursor: isSubmitting ? 'wait' : 'pointer',
                  boxShadow: ds.shadows.button,
                  opacity: isSubmitting ? 0.72 : 1,
                }}
              >
                {isSubmitting ? 'Creating Account...' : 'Sign Up'}
              </button>

              {errors.submit ? (
                <div style={{ fontSize: '12px', color: 'var(--spacespot-error)', textAlign: 'center' }}>{errors.submit}</div>
              ) : null}
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '18px 0 16px' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(32, 49, 76, 0.12)' }} />
              <span style={{ fontSize: '12px', color: '#7C8EA4', fontWeight: 600 }}>OR</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(32, 49, 76, 0.12)' }} />
            </div>

            <div style={{ display: 'grid', gap: '10px' }}>
              <button type="button" style={socialButtonBaseStyle}>
                <GoogleBadge />
                Continue with Google
              </button>
              <button type="button" style={socialButtonBaseStyle}>
                <MicrosoftBadge />
                Continue with Microsoft
              </button>
            </div>

            <div style={{ marginTop: '16px', fontSize: '11px', lineHeight: 1.6, color: '#7C8EA4', textAlign: 'center' }}>
              By signing up, you agree to our <span style={{ color: '#20314C', fontWeight: 600 }}>Terms of Service</span> and <span style={{ color: '#20314C', fontWeight: 600 }}>Privacy Policy</span>.
            </div>

            <button
              type="button"
              onClick={() => navigate('/login')}
              style={{
                marginTop: '14px',
                border: 'none',
                backgroundColor: 'transparent',
                color: ds.colors.heroTitle,
                fontSize: ds.type.sm,
                fontWeight: 600,
                cursor: 'pointer',
                alignSelf: 'center',
              }}
            >
              Already have an account? Sign in
            </button>
          </aside>
        </section>

        {/* Hero Metrics */}
        <div
          style={{
            marginTop: isMobile ? '34px' : '28px',
            borderRadius: ds.radius.xxl,
            backgroundColor: ds.colors.glass,
            backdropFilter: 'blur(18px)',
            boxShadow: ds.shadows.hero,
            border: `1px solid ${ds.colors.glassBorder}`,
            padding: isMobile ? '16px 18px' : '14px 24px',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: isMobile ? '14px' : '12px',
          }}
        >
          {heroMetrics.map((metric) => (
            <div key={metric.label} style={{ textAlign: isMobile ? 'left' : 'center' }}>
              <div style={{ fontSize: isMobile ? '30px' : '36px', fontWeight: 700, color: ds.colors.cyan, lineHeight: 1 }}>{metric.value}</div>
              <div style={{ marginTop: '5px', fontSize: ds.type.sm, color: ds.colors.textPrimary }}>{metric.label}</div>
            </div>
          ))}
        </div>

        {/* Trusted By */}
        <section style={{ marginTop: '20px' }}>
          <p style={{ textAlign: 'center', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8CA4BC', margin: '0 0 10px' }}>Trusted by leading property companies</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: isMobile ? '18px' : '36px', flexWrap: 'wrap', color: ds.colors.textSecondary }}>
            {brandLogos.map((logo) => (
              <span key={logo} style={{ fontSize: isMobile ? '14px' : '17px', fontWeight: logo === 'CBRE' ? 800 : 500, letterSpacing: logo === 'COMPASS' ? '0.12em' : 0, opacity: 0.72 }}>
                {logo}
              </span>
            ))}
          </div>
        </section>
      </div>

      {/* Feature Cards */}
      <main style={{ maxWidth: '1380px', margin: '0 auto', padding: isMobile ? '32px 16px 44px' : isTablet ? '38px 24px 56px' : '46px 34px 64px' }}>
        <h2
          style={{
            margin: 0,
            textAlign: 'center',
            fontSize: isMobile ? '26px' : '36px',
            lineHeight: 1.12,
            fontWeight: 700,
            color: '#17345C',
          }}
        >
          Comprehensive Tools Tailored for Space Management
        </h2>

        <div
          style={{
            marginTop: '28px',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, minmax(0, 1fr))' : 'repeat(3, minmax(0, 1fr))',
            gap: '18px',
          }}
        >
          {featureCards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.title}
                style={{
                  borderRadius: '22px',
                  padding: '18px',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(248,251,255,0.92) 100%)',
                  boxShadow: '0 20px 38px rgba(23, 52, 92, 0.08)',
                  border: '1px solid rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(14px)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '12px', backgroundColor: `${card.accent}1A`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} color={card.accent} />
                  </div>
                  <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#20314C' }}>{card.title}</h3>
                </div>

                {renderFeatureVisual(card.visual)}

                <div style={{ marginTop: '14px', display: 'grid', gap: '9px' }}>
                  {card.bullets.map((bullet) => (
                    <div key={bullet} style={{ display: 'flex', alignItems: 'center', gap: '9px', color: '#4A627D', fontSize: '13px' }}>
                      <span style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'rgba(20, 216, 204, 0.16)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Check size={12} color="var(--spacespot-cyan-primary)" strokeWidth={3} />
                      </span>
                      {bullet}
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>

        {/* Testimonial Section */}
        <section
          style={{
            marginTop: isMobile ? '34px' : '46px',
            borderRadius: ds.radius.xxl,
            padding: isMobile ? '22px 18px' : isTablet ? '28px 26px' : '34px 38px',
            background: 'linear-gradient(180deg, var(--spacespot-glass-surface-strong) 0%, var(--spacespot-glass-surface) 100%)',
            boxShadow: ds.shadows.card,
            border: `1px solid ${ds.colors.glassBorder}`,
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1.1fr 1fr',
            gap: isMobile ? '26px' : '30px',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '18px', alignItems: 'center' }}>
            <div
              style={{
                width: isMobile ? '72px' : '92px',
                height: isMobile ? '72px' : '92px',
                borderRadius: '50%',
                background: 'linear-gradient(180deg, #D8EBF8 0%, #A9C7DE 100%)',
                boxShadow: 'inset 0 0 0 4px rgba(255,255,255,0.75)',
              }}
            />
            <div>
              <div style={{ display: 'flex', gap: '4px', color: '#F6B400', marginBottom: '10px' }}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={18} fill="#F6B400" color="#F6B400" />
                ))}
              </div>
              <blockquote style={{ margin: 0, fontSize: isMobile ? '15px' : '17px', lineHeight: 1.6, color: '#314862' }}>
                "SpaceSpot has completely transformed how we manage our properties. The insights and automation features are game changers."
              </blockquote>
              <div style={{ marginTop: '10px', fontSize: ds.type.sm, fontWeight: 700, color: ds.colors.heroTitle }}>Jessica Petel</div>
              <div style={{ marginTop: '3px', fontSize: ds.type.xs, color: ds.colors.textSecondary }}>Property Manager</div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '14px', alignContent: 'center' }}>
            <h3 style={{ margin: 0, fontSize: isMobile ? '24px' : '34px', lineHeight: 1.1, fontWeight: 700, color: '#17345C' }}>
              Get Started with SpaceSpot Today
            </h3>
            <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.6, color: ds.colors.textSecondary, maxWidth: '520px' }}>
              Sign up now to streamline your space management. No credit card required.
            </p>
            <div>
              <button
                type="button"
                onClick={() => {
                  const formElement = document.getElementById('spacespot-signup-form');
                  formElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                style={{
                  marginTop: '6px',
                  height: '46px',
                  padding: '0 26px',
                  borderRadius: ds.radius.sm,
                  border: 'none',
                  background: ds.gradients.primary,
                  color: ds.colors.white,
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: ds.shadows.button,
                }}
              >
                Get Started
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          style={{
            marginTop: isMobile ? '30px' : '36px',
            paddingTop: '24px',
            borderTop: `1px solid ${ds.colors.borderSubtle}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <Logo size={160} />
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '14px' : '22px', flexWrap: 'wrap', color: ds.colors.textSecondary, fontSize: ds.type.sm }}>
            {['Features', 'Pricing', 'Contact', 'Terms of Service', 'Privacy Policy'].map((item) => (
              <button key={item} type="button" style={{ border: 'none', backgroundColor: 'transparent', padding: 0, color: ds.colors.textSecondary, fontSize: ds.type.sm, cursor: 'pointer' }}>
                {item}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {['t', 'in', 'f'].map((item) => (
              <span key={item} style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(20, 216, 204, 0.14)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#1386A8', fontSize: item === 'in' ? '11px' : '14px', fontWeight: 700 }}>
                {item}
              </span>
            ))}
          </div>
        </footer>
      </main>
    </div>
  );
}
