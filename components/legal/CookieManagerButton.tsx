'use client';

export default function CookieManagerButton() {
  const handleClick = () => {
    if (typeof window !== 'undefined' && (window as any).tarteaucitron) {
      (window as any).tarteaucitron.userInterface.openPanel();
    } else {
      alert('Le gestionnaire de cookies n\'est pas encore chargé. Veuillez actualiser la page.');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-primary-red hover:bg-primary-red-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors"
    >
      🍪 Gérer mes cookies
    </button>
  );
}
