import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../src/api/services';
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Logo from './Logo';

type LoginLocationState = {
  signupSuccess?: boolean;
  email?: string;
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);
  const [signupSuccessMessage, setSignupSuccessMessage] = useState('');

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const locationState = (location.state as LoginLocationState | null) ?? null;
    if (!locationState?.signupSuccess) {
      return;
    }

    if (locationState.email) {
      setEmail(locationState.email);
      setSignupSuccessMessage(`Account created successfully for ${locationState.email}. Please sign in.`);
    } else {
      setSignupSuccessMessage('Account created successfully. Please sign in.');
    }

    // Clear transient route state so banner is not shown on refresh/back navigation.
    navigate('/login', { replace: true });
  }, [location.state, navigate]);
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await authService.login(email, password);

    console.log("LOGIN RESPONSE:", response);

    const token = response.data?.data?.token || response.data?.token || response.token;
    const user = response.data?.data?.user || response.data?.user || response.user;

    if (!token) {
      alert("Login success but token not found");
      return;
    }

    localStorage.setItem("sbp_token", token);
    localStorage.setItem("sbp_user", JSON.stringify(user));

    navigate("/root", { replace: true });
  } catch (error) {
    console.error("Login failed:", error);
    alert("Invalid credentials");
  }
};

  const panelStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '10px',
    fontWeight: 700,
    color: 'var(--spacespot-navy-primary)',
    marginBottom: '6px',
  };

  const inputWrapStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    height: '38px',
    border: '1px solid rgba(31, 41, 55, 0.45)',
    borderRadius: '7px',
    padding: '0 12px',
    backgroundColor: 'var(--spacespot-white)',
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.05)',
  };

  const socialButtonStyle: React.CSSProperties = {
    width: '100%',
    height: '32px',
    borderRadius: '8px',
    border: '1px solid rgba(31, 41, 55, 0.45)',
    backgroundColor: 'var(--spacespot-white)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '10px',
    fontWeight: 600,
    color: 'var(--spacespot-navy-primary)',
    cursor: 'pointer',
  };

  const isTablet = viewportWidth < 980;
  const isMobile = viewportWidth < 560;
  const leftPanelPadding = isTablet ? '28px 26px 24px' : '28px 30px 22px';
  const headingSize = isTablet ? '40px' : '52px';
  const bodySize = isTablet ? '13px' : '17px';
  const statsValueSize = isTablet ? '22px' : '40px';
  const rightPanelPadding = isTablet ? '22px 16px' : '20px 20px';
  const cardPadding = isTablet ? '18px 16px 16px' : '18px 16px 14px';

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'minmax(300px, 0.95fr) minmax(320px, 1.05fr)' : 'minmax(0, 1.06fr) minmax(400px, 0.94fr)',
        background: 'linear-gradient(180deg, #f5f7fb 0%, #eef2f8 100%)',
        fontFamily: 'var(--spacespot-font-primary)',
        overflow: 'hidden',
      }}
    >
      <section
        style={{
          ...panelStyle,
          position: 'relative',
          justifyContent: 'space-between',
          padding: leftPanelPadding,
          background: 'linear-gradient(180deg, #1dcbc0 0%, #14d8cc 52%, #11c9bf 100%)',
          borderRight: isMobile ? 'none' : '1px solid rgba(31, 41, 55, 0.18)',
          overflow: 'hidden',
          minHeight: isMobile ? '48vh' : '100vh',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 70% 16%, rgba(255,255,255,0.18) 0, rgba(255,255,255,0.18) 2px, transparent 3px), radial-gradient(circle at 78% 26%, rgba(255,255,255,0.2) 0, rgba(255,255,255,0.2) 3px, transparent 4px), radial-gradient(circle at 12% 82%, rgba(255,255,255,0.18) 0, rgba(255,255,255,0.18) 2px, transparent 3px), radial-gradient(circle at 90% 82%, rgba(255,255,255,0.18) 0, rgba(255,255,255,0.18) 2px, transparent 3px)',
            opacity: 0.9,
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '18px' }}>
            <Logo size={isTablet ? 36 : 48} />

            {!isTablet && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
                  {['Features', 'Pricing', 'Contact'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      style={{
                        border: 'none',
                        background: 'transparent',
                        padding: 0,
                        color: 'rgba(31, 41, 55, 0.9)',
                        fontSize: '12px',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <button
                    type="button"
                    style={{
                      border: 'none',
                      background: 'transparent',
                      padding: 0,
                      color: 'rgba(31, 41, 55, 0.92)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    style={{
                      height: '36px',
                      padding: '0 16px',
                      border: 'none',
                      borderRadius: '8px',
                      background: 'var(--spacespot-gradient-primary)',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 8px 16px rgba(20, 216, 204, 0.28)',
                    }}
                    onClick={() => navigate('/signup')}
                  >
                    Create Account
                  </button>
                </div>
              </>
            )}
          </div>

          <div style={{ marginTop: isTablet ? '28px' : '50px', maxWidth: isTablet ? '300px' : '430px' }}>
            <h1
              style={{
                margin: 0,
                fontSize: headingSize,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                fontWeight: 700,
                color: 'var(--spacespot-navy-primary)',
                fontFamily: 'var(--spacespot-font-accent)',
              }}
            >
              Manage Your Spaces Effortlessly
            </h1>

            <p
              style={{
                margin: isTablet ? '18px 0 0' : '20px 0 0',
                maxWidth: isTablet ? '250px' : '430px',
                fontSize: bodySize,
                lineHeight: isTablet ? 1.45 : 1.55,
                color: 'rgba(31, 41, 55, 0.62)',
              }}
            >
              The all-in-one platform to track units, manage leases, and optimize occupancy.
            </p>

            <div style={{ marginTop: isTablet ? '16px' : '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                style={{
                  height: '38px',
                  padding: '0 18px',
                  border: 'none',
                  borderRadius: '8px',
                  background: 'var(--spacespot-gradient-primary)',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
                onClick={() => navigate('/signup')}
              >
                Get Started
              </button>

              <button
                type="button"
                style={{
                  height: '38px',
                  padding: '0 16px',
                  border: '1px solid rgba(31, 41, 55, 0.2)',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.82)',
                  color: 'var(--spacespot-navy-primary)',
                  fontSize: '12px',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  boxShadow: '0 8px 14px rgba(15, 23, 42, 0.08)',
                }}
              >
                Watch Demo <ArrowRight size={14} />
              </button>
            </div>

            <div style={{ marginTop: '10px', fontSize: '10px', color: 'rgba(31, 41, 55, 0.46)' }}>
              Free 14-day trial • No credit card required
            </div>
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: isTablet ? '10px' : '28px',
            maxWidth: isTablet ? '260px' : '560px',
            marginTop: isMobile ? '24px' : 0,
          }}
        >
          {[
            ['500+', 'Spaces Managed'],
            ['98%', 'Client Satisfaction'],
            ['24/7', 'Support Available'],
          ].map(([value, label]) => (
            <div key={label}>
              <div style={{ fontSize: statsValueSize, fontWeight: 700, color: 'var(--spacespot-white)', lineHeight: 1.1 }}>
                {value}
              </div>
              <div style={{ marginTop: '6px', fontSize: isTablet ? '9px' : '12px', color: 'rgba(255, 255, 255, 0.8)' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          ...panelStyle,
          justifyContent: 'center',
          alignItems: 'center',
          padding: rightPanelPadding,
          backgroundColor: 'rgba(255,255,255,0.86)',
          minHeight: isMobile ? '52vh' : '100vh',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: isTablet ? '330px' : '360px',
            backgroundColor: 'var(--spacespot-white)',
            borderRadius: '12px',
            border: '1px solid rgba(229, 231, 235, 0.95)',
            boxShadow: '0 14px 30px rgba(15, 23, 42, 0.14)',
            padding: cardPadding,
          }}
        >
          <div style={{ marginBottom: '12px' }}>
            <h2
              style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--spacespot-navy-primary)',
              }}
            >
              Welcome Back
            </h2>
            <p style={{ margin: '6px 0 0', fontSize: '10px', color: 'var(--spacespot-gray-500)' }}>
              Sign in to start managing your spaces
            </p>
          </div>

          {signupSuccessMessage && (
            <div
              style={{
                marginBottom: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(16, 185, 129, 0.42)',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                padding: '9px 10px',
                fontSize: '11px',
                color: 'var(--spacespot-navy-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
              }}
            >
              <span>{signupSuccessMessage}</span>
              <button
                type="button"
                onClick={() => setSignupSuccessMessage('')}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--spacespot-gray-600)',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Dismiss
              </button>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>
              <label style={labelStyle}>Email Address</label>
              <div style={inputWrapStyle}>
                <Mail size={16} color="var(--spacespot-gray-500)" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '10px',
                    color: 'var(--spacespot-navy-primary)',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <div style={inputWrapStyle}>
                <Lock size={16} color="var(--spacespot-gray-500)" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '10px',
                    color: 'var(--spacespot-navy-primary)',
                    fontFamily: 'inherit',
                  }}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label="Toggle password visibility"
                    style={{
                      border: 'none',
                      background: 'transparent',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    {showPassword ? (
                      <EyeOff size={15} color="var(--spacespot-gray-500)" />
                    ) : (
                      <Eye size={15} color="var(--spacespot-gray-500)" />
                    )}
                  </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--spacespot-gray-500)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: 'var(--spacespot-cyan-primary)' }}
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: 0,
                  color: 'var(--spacespot-cyan-primary)',
                  fontSize: '10px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              style={{
                marginTop: '6px',
                height: '38px',
                borderRadius: '8px',
                border: 'none',
                background: 'var(--spacespot-gradient-primary)',
                boxShadow: '0 10px 20px rgba(20, 216, 204, 0.25)',
                color: 'var(--spacespot-white)',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                width: '100%',
              }}
            >
              Sign In
            </button>
          </form>

          <div style={{ margin: '10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(229, 231, 235, 1)' }} />
            <span style={{ fontSize: '10px', color: 'var(--spacespot-gray-500)' }}>or</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(229, 231, 235, 1)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button type="button" style={socialButtonStyle}>
              <span style={{ fontSize: '14px', color: '#ea4335', lineHeight: 1 }}>G</span>
              Continue with Google
            </button>
            <button type="button" style={socialButtonStyle}>
              <span
                style={{
                  width: '12px',
                  height: '12px',
                  display: 'inline-grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1px',
                }}
              >
                <span style={{ backgroundColor: '#f35325' }} />
                <span style={{ backgroundColor: '#81bc06' }} />
                <span style={{ backgroundColor: '#05a6f0' }} />
                <span style={{ backgroundColor: '#ffba08' }} />
              </span>
              Continue with Microsoft
            </button>
          </div>

          <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '10px', color: 'var(--spacespot-gray-500)' }}>
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/signup')}
              style={{
                border: 'none',
                background: 'transparent',
                padding: 0,
                color: 'var(--spacespot-cyan-primary)',
                fontSize: '10px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Sign Up
            </button>
          </div>

          <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '10px', color: 'var(--spacespot-gray-500)' }}>
            By signing in, you agree to our{' '}
            <button type="button" style={{ border: 'none', background: 'transparent', padding: 0, color: 'var(--spacespot-cyan-primary)', fontSize: '10px', cursor: 'pointer' }}>
              Terms of Service
            </button>
            {' '}and{' '}
            <button type="button" style={{ border: 'none', background: 'transparent', padding: 0, color: 'var(--spacespot-cyan-primary)', fontSize: '10px', cursor: 'pointer' }}>
              Privacy Policy
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
