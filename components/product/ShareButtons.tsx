'use client';

import { useState } from 'react';
import { Facebook, Twitter, MessageCircle, Link2, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { shareProduct } from '@/lib/gtag';

interface ShareButtonsProps {
  productId: string;
  productName: string;
  productDescription?: string;
  imageUrl?: string;
  variant?: 'horizontal' | 'vertical';
}

export default function ShareButtons({
  productId,
  productName,
  productDescription,
  imageUrl,
  variant = 'horizontal',
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  // Get the current page URL
  const pageUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/products/${productId}`
    : `https://www.pizzafalchi.com/products/${productId}`;

  const shareText = `Découvrez ${productName} chez Pizza Falchi !`;
  const fullShareText = productDescription
    ? `${productName} - ${productDescription}`
    : productName;

  const handleShare = (platform: string) => {
    // Track with Google Analytics
    shareProduct(productId, platform);

    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${pageUrl}`)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      toast.success('Lien copié dans le presse-papier !');
      shareProduct(productId, 'copy_link');

      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Impossible de copier le lien');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productName,
          text: fullShareText,
          url: pageUrl,
        });
        shareProduct(productId, 'native_share');
      } catch (error) {
        // User cancelled or error occurred
        console.error('Error sharing:', error);
      }
    }
  };

  const containerClass = variant === 'horizontal'
    ? 'flex items-center gap-2 flex-wrap'
    : 'flex flex-col gap-2';

  return (
    <div className={containerClass}>
      {/* Label */}
      <span className="text-sm font-semibold text-gray-700">Partager :</span>

      {/* Share Buttons */}
      <div className={variant === 'horizontal' ? 'flex gap-2' : 'flex flex-col gap-2'}>
        {/* Facebook */}
        <button
          onClick={() => handleShare('facebook')}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#1864D9] transition-colors duration-300"
          aria-label="Partager sur Facebook"
        >
          <Facebook className="w-4 h-4" />
          {variant === 'vertical' && <span className="text-sm">Facebook</span>}
        </button>

        {/* Twitter / X */}
        <button
          onClick={() => handleShare('twitter')}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1A91DA] transition-colors duration-300"
          aria-label="Partager sur Twitter"
        >
          <Twitter className="w-4 h-4" />
          {variant === 'vertical' && <span className="text-sm">Twitter</span>}
        </button>

        {/* WhatsApp */}
        <button
          onClick={() => handleShare('whatsapp')}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#20BD5B] transition-colors duration-300"
          aria-label="Partager sur WhatsApp"
        >
          <MessageCircle className="w-4 h-4" />
          {variant === 'vertical' && <span className="text-sm">WhatsApp</span>}
        </button>

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
            copied
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          aria-label="Copier le lien"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              {variant === 'vertical' && <span className="text-sm">Copié !</span>}
            </>
          ) : (
            <>
              <Link2 className="w-4 h-4" />
              {variant === 'vertical' && <span className="text-sm">Copier</span>}
            </>
          )}
        </button>
      </div>

      {/* Native Share Button (mobile only) */}
      {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
        <button
          onClick={handleNativeShare}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-red text-white rounded-lg hover:bg-primary-red/90 transition-colors duration-300 md:hidden"
          aria-label="Partager"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          <span className="text-sm font-semibold">Partager</span>
        </button>
      )}
    </div>
  );
}
