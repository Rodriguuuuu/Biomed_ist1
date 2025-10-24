'use client';

export default function LangToggle() {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const html = document.documentElement;
    html.lang = html.lang === 'pt' ? 'en' : 'pt';
  };

  return (
    <a
      href="#"
      onClick={handleClick}
      className="btn"
      aria-label="Alternar idioma"
    >
      PT/EN
    </a>
  );
}
