import { Resend } from 'resend';

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your_resend_api_key_here'
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@pizzafalchi.com';
const FROM_NAME = process.env.EMAIL_FROM_NAME || 'Pizza Falchi';

export interface NewsletterWelcomeData {
  name?: string;
  email: string;
}

export interface NewsletterCampaignData {
  subject: string;
  preheader?: string;
  content: string;
}

export interface AbandonedCartEmailData {
  email: string;
  customerName?: string;
  items: Array<{
    productName: string;
    productImage?: string;
    quantity: number;
    price: number;
  }>;
  totalValue: number;
  cartUrl: string;
}

export interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    customizations?: {
      size?: string;
      toppings?: string[];
      notes?: string;
    };
  }>;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  deliveryType: 'pickup' | 'delivery';
  deliveryAddress?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  estimatedTime?: string;
  pickupTimeRange?: string;
  notes?: string;
}

export interface OrderStatusEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  status: 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  estimatedTime?: string;
  trackingUrl?: string;
}

/**
 * Send order confirmation email to customer
 */
export const sendOrderConfirmationEmail = async (
  data: OrderEmailData
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  try {
    // Check if Resend is configured
    if (!resend) {
      console.warn('Resend API key not configured. Email not sent.');
      return { success: false, error: 'Email service not configured' };
    }

    const htmlContent = generateOrderConfirmationHTML(data);
    const textContent = generateOrderConfirmationText(data);

    const result = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: data.customerEmail,
      subject: `Confirmation de commande #${data.orderId} - Pizza Falchi`,
      html: htmlContent,
      text: textContent,
    });

    if (result.error) {
      console.error('Resend error:', result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, error: String(error) };
  }
};

/**
 * Send order status update email to customer
 */
export const sendOrderStatusEmail = async (
  data: OrderStatusEmailData
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  try {
    // Check if Resend is configured
    if (!resend) {
      console.warn('Resend API key not configured. Email not sent.');
      return { success: false, error: 'Email service not configured' };
    }

    const htmlContent = generateOrderStatusHTML(data);
    const textContent = generateOrderStatusText(data);

    const subjectMap = {
      confirmed: 'Commande confirmée',
      preparing: 'Votre commande est en préparation',
      ready: 'Votre commande est prête',
      completed: 'Commande livrée',
      cancelled: 'Commande annulée',
    };

    const result = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: data.customerEmail,
      subject: `${subjectMap[data.status]} #${data.orderId} - Pizza Falchi`,
      html: htmlContent,
      text: textContent,
    });

    if (result.error) {
      console.error('Resend error:', result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('Error sending order status email:', error);
    return { success: false, error: String(error) };
  }
};

/**
 * Send notification email to admin/restaurant
 */
export const sendAdminNotificationEmail = async (
  data: OrderEmailData
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  try {
    // Check if Resend is configured
    if (!resend) {
      console.warn('Resend API key not configured. Email not sent.');
      return { success: false, error: 'Email service not configured' };
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@pizzafalchi.com';

    const htmlContent = generateAdminNotificationHTML(data);
    const textContent = `Nouvelle commande #${data.orderId} de ${data.customerName}.\n\nTotal: ${data.total}€\nType: ${data.deliveryType}\n\nVoir les détails dans le dashboard admin.`;

    const result = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: adminEmail,
      subject: `🍕 Nouvelle commande #${data.orderId}`,
      html: htmlContent,
      text: textContent,
    });

    if (result.error) {
      console.error('Resend error:', result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    return { success: false, error: String(error) };
  }
};

// HTML Template Generators

const generateOrderConfirmationHTML = (data: OrderEmailData): string => {
  const itemsHTML = data.items
    .map(
      (item) => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 15px 0;">
        <strong>${item.name}</strong>
        ${item.customizations?.size ? `<br /><span style="color: #666; font-size: 14px;">Taille: ${item.customizations.size}</span>` : ''}
        ${item.customizations?.toppings && item.customizations.toppings.length > 0 ? `<br /><span style="color: #666; font-size: 14px;">Suppléments: ${item.customizations.toppings.join(', ')}</span>` : ''}
        ${item.customizations?.notes ? `<br /><span style="color: #666; font-size: 14px; font-style: italic;">${item.customizations.notes}</span>` : ''}
      </td>
      <td style="padding: 15px 0; text-align: center;">${item.quantity}</td>
      <td style="padding: 15px 0; text-align: right;"><strong>${item.price.toFixed(2)}€</strong></td>
    </tr>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation de commande</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #E30613 0%, #C00510 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">🍕 Pizza Falchi</h1>
              <p style="color: #FFD200; margin: 10px 0 0 0; font-size: 16px;">Commande confirmée !</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #333; margin: 0 0 10px 0; font-size: 24px;">Bonjour ${data.customerName},</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Merci pour votre commande ! Nous avons bien reçu votre commande <strong>#${data.orderId}</strong> et nous commençons sa préparation.
              </p>

              <!-- Order Details -->
              <div style="background-color: #FFF9F0; border-left: 4px solid #FFD200; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
                <p style="margin: 0 0 10px 0; color: #333;"><strong>Type:</strong> ${data.deliveryType === 'delivery' ? '🚗 Livraison' : '🏪 À emporter'}</p>
                ${data.pickupTimeRange ? `<p style="margin: 0 0 10px 0; color: #333;"><strong>Heure de retrait:</strong> ${data.pickupTimeRange}</p>` : ''}
                ${data.estimatedTime ? `<p style="margin: 0 0 10px 0; color: #333;"><strong>Temps estimé:</strong> ${data.estimatedTime}</p>` : ''}
                ${data.deliveryAddress ? `<p style="margin: 0 0 10px 0; color: #333;"><strong>Adresse:</strong> ${data.deliveryAddress.street}, ${data.deliveryAddress.postalCode} ${data.deliveryAddress.city}</p>` : ''}
                <p style="margin: 0; color: #333;"><strong>Paiement:</strong> ${data.paymentMethod}</p>
              </div>

              <!-- Items Table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <thead>
                  <tr style="border-bottom: 2px solid #E30613;">
                    <th style="padding: 10px 0; text-align: left; color: #E30613; font-size: 14px; text-transform: uppercase;">Article</th>
                    <th style="padding: 10px 0; text-align: center; color: #E30613; font-size: 14px; text-transform: uppercase;">Qté</th>
                    <th style="padding: 10px 0; text-align: right; color: #E30613; font-size: 14px; text-transform: uppercase;">Prix</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHTML}
                </tbody>
              </table>

              <!-- Total -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="padding: 5px 0; color: #666;">Sous-total:</td>
                  <td style="padding: 5px 0; text-align: right; color: #666;">${data.subtotal.toFixed(2)}€</td>
                </tr>
                ${data.tax > 0 ? `<tr><td style="padding: 5px 0; color: #666;">TVA:</td><td style="padding: 5px 0; text-align: right; color: #666;">${data.tax.toFixed(2)}€</td></tr>` : ''}
                ${data.deliveryFee > 0 ? `<tr><td style="padding: 5px 0; color: #666;">Frais de livraison:</td><td style="padding: 5px 0; text-align: right; color: #666;">${data.deliveryFee.toFixed(2)}€</td></tr>` : ''}
                <tr style="border-top: 2px solid #E30613;">
                  <td style="padding: 15px 0; color: #E30613; font-size: 20px; font-weight: bold;">Total:</td>
                  <td style="padding: 15px 0; text-align: right; color: #E30613; font-size: 20px; font-weight: bold;">${data.total.toFixed(2)}€</td>
                </tr>
              </table>

              ${data.notes ? `<div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin-bottom: 20px;"><p style="margin: 0; color: #666; font-style: italic;"><strong>Note:</strong> ${data.notes}</p></div>` : ''}

              <!-- Contact Info -->
              <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #eee;">
                <p style="color: #666; margin: 0 0 10px 0;">Des questions ? Contactez-nous :</p>
                <p style="color: #E30613; margin: 0 0 5px 0; font-weight: bold;">📞 +33 4 42 92 03 08</p>
                <p style="color: #666; margin: 0;">📧 contact@pizzafalchi.com</p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; padding: 30px; text-align: center; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 14px; margin: 0 0 10px 0;">Merci de votre confiance !</p>
              <p style="color: #999; font-size: 12px; margin: 0;">© 2025 Pizza Falchi - Puyricard, France</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

const generateOrderConfirmationText = (data: OrderEmailData): string => {
  const itemsText = data.items
    .map(
      (item) =>
        `- ${item.name} x${item.quantity} - ${item.price.toFixed(2)}€${item.customizations?.size ? ` (${item.customizations.size})` : ''}${item.customizations?.toppings && item.customizations.toppings.length > 0 ? ` + ${item.customizations.toppings.join(', ')}` : ''}`
    )
    .join('\n');

  return `
PIZZA FALCHI - Confirmation de commande

Bonjour ${data.customerName},

Merci pour votre commande ! Nous avons bien reçu votre commande #${data.orderId}.

DÉTAILS DE LA COMMANDE:
Type: ${data.deliveryType === 'delivery' ? 'Livraison' : 'À emporter'}
${data.pickupTimeRange ? `Heure de retrait: ${data.pickupTimeRange}` : ''}
${data.estimatedTime ? `Temps estimé: ${data.estimatedTime}` : ''}
${data.deliveryAddress ? `Adresse: ${data.deliveryAddress.street}, ${data.deliveryAddress.postalCode} ${data.deliveryAddress.city}` : ''}
Paiement: ${data.paymentMethod}

ARTICLES:
${itemsText}

TOTAL:
Sous-total: ${data.subtotal.toFixed(2)}€
${data.tax > 0 ? `TVA: ${data.tax.toFixed(2)}€\n` : ''}${data.deliveryFee > 0 ? `Frais de livraison: ${data.deliveryFee.toFixed(2)}€\n` : ''}Total: ${data.total.toFixed(2)}€

${data.notes ? `Note: ${data.notes}\n` : ''}
CONTACT:
Téléphone: +33 4 42 92 03 08
Email: contact@pizzafalchi.com

Merci de votre confiance !

Pizza Falchi - Puyricard, France
  `;
};

const generateOrderStatusHTML = (data: OrderStatusEmailData): string => {
  const statusInfo = {
    confirmed: {
      title: 'Commande confirmée',
      emoji: '✅',
      message: 'Votre commande a été confirmée et nous commençons sa préparation.',
      color: '#10B981',
    },
    preparing: {
      title: 'En préparation',
      emoji: '👨‍🍳',
      message: 'Notre équipe prépare votre commande avec soin.',
      color: '#F59E0B',
    },
    ready: {
      title: 'Commande prête',
      emoji: '🍕',
      message: 'Votre commande est prête ! Vous pouvez venir la récupérer.',
      color: '#3B82F6',
    },
    completed: {
      title: 'Commande livrée',
      emoji: '🎉',
      message: 'Votre commande a été livrée. Bon appétit !',
      color: '#8B5CF6',
    },
    cancelled: {
      title: 'Commande annulée',
      emoji: '❌',
      message: 'Votre commande a été annulée. Contactez-nous pour plus d\'informations.',
      color: '#EF4444',
    },
  };

  const info = statusInfo[data.status];

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${info.title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: ${info.color}; padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 48px;">${info.emoji}</h1>
              <h2 style="color: #ffffff; margin: 15px 0 0 0; font-size: 24px; font-weight: bold;">${info.title}</h2>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h3 style="color: #333; margin: 0 0 10px 0; font-size: 22px;">Bonjour ${data.customerName},</h3>
              <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                ${info.message}
              </p>

              <div style="background-color: #f9f9f9; border-left: 4px solid ${info.color}; padding: 20px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; color: #333; font-size: 16px;"><strong>Numéro de commande:</strong> #${data.orderId}</p>
                ${data.estimatedTime ? `<p style="margin: 10px 0 0 0; color: #333; font-size: 16px;"><strong>Temps estimé:</strong> ${data.estimatedTime}</p>` : ''}
              </div>

              ${data.trackingUrl ? `<div style="text-align: center; margin: 30px 0;"><a href="${data.trackingUrl}" style="display: inline-block; background-color: ${info.color}; color: #ffffff; padding: 15px 40px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Suivre ma commande</a></div>` : ''}

              <!-- Contact Info -->
              <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #eee;">
                <p style="color: #666; margin: 0 0 10px 0;">Des questions ? Contactez-nous :</p>
                <p style="color: #E30613; margin: 0 0 5px 0; font-weight: bold;">📞 +33 4 42 92 03 08</p>
                <p style="color: #666; margin: 0;">📧 contact@pizzafalchi.com</p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; padding: 30px; text-align: center; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 14px; margin: 0 0 10px 0;">Merci de votre confiance !</p>
              <p style="color: #999; font-size: 12px; margin: 0;">© 2025 Pizza Falchi - Puyricard, France</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

const generateOrderStatusText = (data: OrderStatusEmailData): string => {
  const statusInfo = {
    confirmed: 'Votre commande a été confirmée et nous commençons sa préparation.',
    preparing: 'Notre équipe prépare votre commande avec soin.',
    ready: 'Votre commande est prête ! Vous pouvez venir la récupérer.',
    completed: 'Votre commande a été livrée. Bon appétit !',
    cancelled: 'Votre commande a été annulée. Contactez-nous pour plus d\'informations.',
  };

  return `
PIZZA FALCHI - Mise à jour de commande

Bonjour ${data.customerName},

${statusInfo[data.status]}

Numéro de commande: #${data.orderId}
${data.estimatedTime ? `Temps estimé: ${data.estimatedTime}\n` : ''}
${data.trackingUrl ? `Suivre votre commande: ${data.trackingUrl}\n` : ''}
CONTACT:
Téléphone: +33 4 42 92 03 08
Email: contact@pizzafalchi.com

Merci de votre confiance !

Pizza Falchi - Puyricard, France
  `;
};

const generateAdminNotificationHTML = (data: OrderEmailData): string => {
  const itemsHTML = data.items
    .map(
      (item) => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 10px 0;">
        <strong>${item.name}</strong>
        ${item.customizations?.size ? `<br /><small>Taille: ${item.customizations.size}</small>` : ''}
        ${item.customizations?.toppings && item.customizations.toppings.length > 0 ? `<br /><small>+ ${item.customizations.toppings.join(', ')}</small>` : ''}
      </td>
      <td style="padding: 10px 0; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px 0; text-align: right;"><strong>${item.price.toFixed(2)}€</strong></td>
    </tr>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Nouvelle commande</title>
</head>
<body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <h1 style="color: #E30613; margin: 0 0 20px 0;">🍕 Nouvelle Commande #${data.orderId}</h1>

    <div style="background-color: #FFF9F0; border-left: 4px solid #FFD200; padding: 15px; margin-bottom: 20px;">
      <p style="margin: 0 0 5px 0;"><strong>Client:</strong> ${data.customerName}</p>
      <p style="margin: 0 0 5px 0;"><strong>Téléphone:</strong> ${data.customerEmail}</p>
      <p style="margin: 0 0 5px 0;"><strong>Type:</strong> ${data.deliveryType === 'delivery' ? 'Livraison' : 'À emporter'}</p>
      ${data.pickupTimeRange ? `<p style="margin: 0 0 5px 0;"><strong>Heure:</strong> ${data.pickupTimeRange}</p>` : ''}
      <p style="margin: 0;"><strong>Paiement:</strong> ${data.paymentMethod}</p>
    </div>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <thead>
        <tr style="border-bottom: 2px solid #E30613;">
          <th style="text-align: left; padding: 10px 0;">Article</th>
          <th style="text-align: center; padding: 10px 0;">Qté</th>
          <th style="text-align: right; padding: 10px 0;">Prix</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHTML}
        <tr style="border-top: 2px solid #E30613;">
          <td colspan="2" style="padding: 15px 0; font-size: 18px; font-weight: bold;">Total:</td>
          <td style="padding: 15px 0; text-align: right; font-size: 18px; font-weight: bold; color: #E30613;">${data.total.toFixed(2)}€</td>
        </tr>
      </tbody>
    </table>

    ${data.deliveryAddress ? `<p><strong>Adresse de livraison:</strong><br />${data.deliveryAddress.street}, ${data.deliveryAddress.postalCode} ${data.deliveryAddress.city}</p>` : ''}
    ${data.notes ? `<div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px;"><p style="margin: 0;"><strong>Note:</strong> ${data.notes}</p></div>` : ''}
  </div>
</body>
</html>
  `;
};

/**
 * Send welcome email to new newsletter subscriber
 */
export const sendNewsletterWelcomeEmail = async (
  data: NewsletterWelcomeData
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  try {
    if (!resend) {
      console.warn('Resend API key not configured. Email not sent.');
      return { success: false, error: 'Email service not configured' };
    }

    const htmlContent = generateNewsletterWelcomeHTML(data);
    const textContent = generateNewsletterWelcomeText(data);

    const result = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: data.email,
      subject: '🍕 Bienvenue chez Pizza Falchi !',
      html: htmlContent,
      text: textContent,
    });

    if (result.error) {
      console.error('Resend error:', result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('Error sending newsletter welcome email:', error);
    return { success: false, error: String(error) };
  }
};

/**
 * Send newsletter campaign to subscribers
 */
export const sendNewsletterCampaign = async (
  subscribers: string[],
  data: NewsletterCampaignData
): Promise<{ sent: number; failed: number }> => {
  let sent = 0;
  let failed = 0;

  if (!resend) {
    console.warn('Resend API key not configured. Emails not sent.');
    return { sent: 0, failed: subscribers.length };
  }

  // Send in batches of 50 to avoid rate limits
  const batchSize = 50;
  for (let i = 0; i < subscribers.length; i += batchSize) {
    const batch = subscribers.slice(i, i + batchSize);

    const promises = batch.map(async (email) => {
      try {
        const result = await resend.emails.send({
          from: `${FROM_NAME} <${FROM_EMAIL}>`,
          to: email,
          subject: data.subject,
          html: data.content,
        });

        if (result.error) {
          console.error(`Failed to send to ${email}:`, result.error);
          return false;
        }

        return true;
      } catch (error) {
        console.error(`Error sending to ${email}:`, error);
        return false;
      }
    });

    const results = await Promise.allSettled(promises);

    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        sent++;
      } else {
        failed++;
      }
    });

    // Wait 1 second between batches to respect rate limits
    if (i + batchSize < subscribers.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return { sent, failed };
};

const generateNewsletterWelcomeHTML = (data: NewsletterWelcomeData): string => {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenue chez Pizza Falchi</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #E30613 0%, #C00510 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 36px; font-weight: bold;">🍕</h1>
              <h2 style="color: #FFD200; margin: 15px 0 0 0; font-size: 28px; font-weight: bold;">Bienvenue chez Pizza Falchi !</h2>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h3 style="color: #333; margin: 0 0 10px 0; font-size: 22px;">Bonjour${data.name ? ` ${data.name}` : ''} 👋</h3>
              <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Merci de vous être inscrit à notre newsletter ! Nous sommes ravis de vous compter parmi nos abonnés.
              </p>

              <div style="background-color: #FFF9F0; border-left: 4px solid #FFD200; padding: 20px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0 0 15px 0; color: #333; font-weight: bold;">Vous recevrez désormais :</p>
                <ul style="margin: 0; padding-left: 20px; color: #666;">
                  <li style="margin-bottom: 10px;">🍕 Nos promotions exclusives</li>
                  <li style="margin-bottom: 10px;">🆕 Nos nouvelles pizzas en avant-première</li>
                  <li style="margin-bottom: 10px;">📅 Nos événements spéciaux</li>
                  <li style="margin-bottom: 0;">🎁 Des offres réservées aux abonnés</li>
                </ul>
              </div>

              <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                Pour découvrir notre menu dès maintenant :
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://www.pizzafalchi.com/menu" style="display: inline-block; background: linear-gradient(135deg, #E30613, #F2828B); color: #ffffff; padding: 15px 40px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Voir notre menu</a>
              </div>

              <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
                À très bientôt ! 🍕
              </p>
              <p style="color: #E30613; font-size: 16px; font-weight: bold; margin: 5px 0 0 0;">
                L'équipe Pizza Falchi
              </p>

              <!-- Contact Info -->
              <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #eee;">
                <p style="color: #666; margin: 0 0 10px 0;">Des questions ? Contactez-nous :</p>
                <p style="color: #E30613; margin: 0 0 5px 0; font-weight: bold;">📞 +33 4 42 92 03 08</p>
                <p style="color: #666; margin: 0;">📧 pizzafalchipro@gmail.com</p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; padding: 30px; text-align: center; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px; margin: 0 0 5px 0;">Pizza Falchi - 615, av. de la Touloubre, 13540 Puyricard</p>
              <p style="color: #999; font-size: 12px; margin: 0;">
                <a href="https://www.pizzafalchi.com/newsletter/unsubscribe?email=${encodeURIComponent(data.email)}" style="color: #999; text-decoration: underline;">Se désinscrire</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

const generateNewsletterWelcomeText = (data: NewsletterWelcomeData): string => {
  return `
PIZZA FALCHI - Bienvenue !

Bonjour${data.name ? ` ${data.name}` : ''},

Merci de vous être inscrit à notre newsletter ! Nous sommes ravis de vous compter parmi nos abonnés.

Vous recevrez désormais :
- Nos promotions exclusives
- Nos nouvelles pizzas en avant-première
- Nos événements spéciaux
- Des offres réservées aux abonnés

Découvrez notre menu : https://www.pizzafalchi.com/menu

À très bientôt !
L'équipe Pizza Falchi

Pizza Falchi - 615, av. de la Touloubre, 13540 Puyricard
04 42 92 03 08 | pizzafalchipro@gmail.com

Se désinscrire : https://www.pizzafalchi.com/newsletter/unsubscribe?email=${encodeURIComponent(data.email)}
  `;
};

/**
 * Send abandoned cart reminder email
 */
export const sendAbandonedCartEmail = async (
  data: AbandonedCartEmailData
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  try {
    if (!resend) {
      console.warn('Resend API key not configured. Email not sent.');
      return { success: false, error: 'Email service not configured' };
    }

    const htmlContent = generateAbandonedCartHTML(data);
    const textContent = generateAbandonedCartText(data);

    const result = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: data.email,
      subject: '🍕 Vous avez oublié quelque chose dans votre panier !',
      html: htmlContent,
      text: textContent,
    });

    if (result.error) {
      console.error('Resend error:', result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('Error sending abandoned cart email:', error);
    return { success: false, error: String(error) };
  }
};

const generateAbandonedCartHTML = (data: AbandonedCartEmailData): string => {
  const itemsHTML = data.items
    .map(
      (item) => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 15px 0;">
        ${item.productImage ? `<img src="${item.productImage}" alt="${item.productName}" style="width: 60px; height: 60px; border-radius: 8px; object-fit: cover; margin-right: 15px;" />` : ''}
        <strong style="font-size: 16px;">${item.productName}</strong>
      </td>
      <td style="padding: 15px 0; text-align: center;">×${item.quantity}</td>
      <td style="padding: 15px 0; text-align: right;"><strong>${item.price.toFixed(2)}€</strong></td>
    </tr>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Votre panier vous attend</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #E30613 0%, #C00510 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 36px; font-weight: bold;">🛒</h1>
              <h2 style="color: #FFD200; margin: 15px 0 0 0; font-size: 28px; font-weight: bold;">Votre panier vous attend !</h2>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h3 style="color: #333; margin: 0 0 10px 0; font-size: 22px;">Bonjour${data.customerName ? ` ${data.customerName}` : ''} 👋</h3>
              <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Nous avons remarqué que vous avez laissé des articles dans votre panier. Ne les laissez pas s'échapper !
                Vos pizzas préférées vous attendent.
              </p>

              <div style="background-color: #FFF9F0; border-left: 4px solid #FFD200; padding: 20px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; color: #E30613; font-weight: bold; font-size: 18px;">
                  🎉 Offre spéciale : Complétez votre commande maintenant et profitez de nos pizzas fraîchement préparées !
                </p>
              </div>

              <!-- Cart Items -->}
              <h3 style="color: #333; margin: 30px 0 15px 0; font-size: 20px;">Votre panier :</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <thead>
                  <tr style="border-bottom: 2px solid #E30613;">
                    <th style="padding: 10px 0; text-align: left; color: #E30613; font-size: 14px; text-transform: uppercase;">Article</th>
                    <th style="padding: 10px 0; text-align: center; color: #E30613; font-size: 14px; text-transform: uppercase;">Qté</th>
                    <th style="padding: 10px 0; text-align: right; color: #E30613; font-size: 14px; text-transform: uppercase;">Prix</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHTML}
                  <tr style="border-top: 2px solid #E30613;">
                    <td colspan="2" style="padding: 15px 0; font-size: 18px; font-weight: bold;">Total:</td>
                    <td style="padding: 15px 0; text-align: right; font-size: 20px; font-weight: bold; color: #E30613;">${data.totalValue.toFixed(2)}€</td>
                  </tr>
                </tbody>
              </table>

              <!-- CTA Button -->}
              <div style="text-align: center; margin: 40px 0;">
                <a href="${data.cartUrl}" style="display: inline-block; background: linear-gradient(135deg, #E30613, #F2828B); color: #ffffff; padding: 18px 50px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 12px rgba(227, 6, 19, 0.3);">
                  Finaliser ma commande
                </a>
              </div>

              <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
                <strong>Pourquoi commander chez Pizza Falchi ?</strong><br />
                ✓ Pizzas au feu de bois<br />
                ✓ Ingrédients frais et de qualité<br />
                ✓ Livraison rapide ou à emporter<br />
                ✓ Service client à votre écoute
              </p>

              <!-- Contact Info -->
              <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #eee;">
                <p style="color: #666; margin: 0 0 10px 0;">Des questions ? Contactez-nous :</p>
                <p style="color: #E30613; margin: 0 0 5px 0; font-weight: bold;">📞 +33 4 42 92 03 08</p>
                <p style="color: #666; margin: 0;">📧 pizzafalchipro@gmail.com</p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; padding: 30px; text-align: center; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px; margin: 0 0 5px 0;">Pizza Falchi - 615, av. de la Touloubre, 13540 Puyricard</p>
              <p style="color: #999; font-size: 12px; margin: 0;">© 2025 Pizza Falchi - Tous droits réservés</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

const generateAbandonedCartText = (data: AbandonedCartEmailData): string => {
  const itemsText = data.items
    .map((item) => `- ${item.productName} x${item.quantity} - ${item.price.toFixed(2)}€`)
    .join('\n');

  return `
PIZZA FALCHI - Votre panier vous attend

Bonjour${data.customerName ? ` ${data.customerName}` : ''},

Nous avons remarqué que vous avez laissé des articles dans votre panier. Ne les laissez pas s'échapper ! Vos pizzas préférées vous attendent.

OFFRE SPÉCIALE : Complétez votre commande maintenant et profitez de nos pizzas fraîchement préparées !

VOTRE PANIER:
${itemsText}

Total: ${data.totalValue.toFixed(2)}€

Finalisez votre commande : ${data.cartUrl}

Pourquoi commander chez Pizza Falchi ?
✓ Pizzas au feu de bois
✓ Ingrédients frais et de qualité
✓ Livraison rapide ou à emporter
✓ Service client à votre écoute

CONTACT:
Téléphone: +33 4 42 92 03 08
Email: pizzafalchipro@gmail.com

Pizza Falchi - 615, av. de la Touloubre, 13540 Puyricard
© 2025 Pizza Falchi - Tous droits réservés
  `;
};
