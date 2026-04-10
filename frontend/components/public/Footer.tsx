export default function Footer({ name }: { name: string }) {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p className="footer-text">
          © {year} <span className="gradient-text">{name}</span>. Built with Next.js & Express.
        </p>
        <p className="footer-sub">QA Engineer Portfolio</p>
      </div>
      <style>{`
        .footer {
          border-top: 1px solid var(--color-border);
          padding: 2rem 0;
          text-align: center;
          background: var(--color-bg-2);
        }
        .footer-inner { display: flex; flex-direction: column; gap: 0.35rem; align-items: center; }
        .footer-text { font-size: 0.9rem; color: var(--color-text-secondary); }
        .footer-sub { font-size: 0.78rem; color: var(--color-text-muted); }
      `}</style>
    </footer>
  );
}
