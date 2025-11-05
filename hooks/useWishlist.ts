import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

interface WishlistItem {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    description: string;
  };
  addedAt: string;
}

export function useWishlist() {
  const { data: session } = useSession();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [guestEmail, setGuestEmail] = useState<string>('');

  // Load guest email from localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem('guestEmail');
    if (savedEmail) {
      setGuestEmail(savedEmail);
    }
  }, []);

  // Fetch wishlist on mount and when session changes
  useEffect(() => {
    fetchWishlist();
  }, [session, guestEmail]);

  const fetchWishlist = async () => {
    try {
      const email = session?.user?.email || guestEmail;
      if (!email) {
        setIsLoading(false);
        return;
      }

      const response = await fetch(`/api/wishlist?email=${encodeURIComponent(email)}`);
      const data = await response.json();

      if (response.ok) {
        setItems(data.items || []);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToWishlist = async (productId: string, productName: string) => {
    try {
      let email = session?.user?.email || guestEmail;

      // If no email, prompt for it
      if (!email) {
        const userEmail = prompt(
          'Pour sauvegarder vos favoris, veuillez entrer votre email :'
        );
        if (!userEmail) return;

        email = userEmail;
        setGuestEmail(email);
        localStorage.setItem('guestEmail', email);
      }

      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur');
      }

      toast.success(`${productName} ajouté aux favoris`);
      fetchWishlist();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'ajout aux favoris');
    }
  };

  const removeFromWishlist = async (productId: string, productName: string) => {
    try {
      const email = session?.user?.email || guestEmail;
      if (!email) return;

      const response = await fetch(
        `/api/wishlist/${productId}?email=${encodeURIComponent(email)}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur');
      }

      toast.success(`${productName} retiré des favoris`);
      fetchWishlist();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors du retrait');
    }
  };

  const clearWishlist = async () => {
    try {
      const email = session?.user?.email || guestEmail;
      if (!email) return;

      const response = await fetch(`/api/wishlist?email=${encodeURIComponent(email)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur');
      }

      toast.success('Liste vidée');
      setItems([]);
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors du vidage');
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return items.some((item) => item.product._id === productId);
  };

  const getTotalItems = (): number => {
    return items.length;
  };

  return {
    items,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    getTotalItems,
    hasEmail: !!(session?.user?.email || guestEmail),
  };
}
