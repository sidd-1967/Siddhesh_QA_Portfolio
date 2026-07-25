export default function Loading() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <div className="spinner" />
      <div>
        <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem' }}>
          Loading portfolio…
        </p>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem', maxWidth: '360px' }}>
          The server is hosted on a free tier and may take up to a minute to wake up on the first visit.
        </p>
      </div>
    </div>
  );
}
