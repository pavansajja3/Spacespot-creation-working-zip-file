import LogoPng from './spacespot-logo.png';

export default function Logo({ size = 90 }: { size?: number }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--spacespot-logo-padding)',
        borderRadius: 'var(--spacespot-logo-radius)',
        background: 'var(--spacespot-logo-backdrop)',
        border: '1px solid var(--spacespot-logo-border)',
        boxShadow: 'var(--spacespot-logo-shadow)',
      }}
    >
      <img
        src={LogoPng}
        alt="SpaceSpot"
        className="spacespot-logo-glow"
        style={{
          width: `${size}px`,
          height: 'auto',
          display: 'inline-block',
          objectFit: 'contain',
          willChange: 'filter, transform',
        }}
      />
    </div>
  );
}

