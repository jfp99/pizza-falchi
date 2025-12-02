# Pizza Falchi - n8n Workflows

This directory contains pre-built n8n workflow JSON files that can be imported directly into your n8n instance.

## Workflows Overview

| Workflow | Trigger | Description |
|----------|---------|-------------|
| `order-confirmation-workflow.json` | Webhook (order.created) | Sends email + WhatsApp confirmation, auto-confirms order |
| `order-ready-workflow.json` | Webhook (order.ready) | High-priority notification when order is ready |
| `order-status-change-workflow.json` | Webhook (status change) | Routes notifications based on status type |
| `daily-health-check-workflow.json` | Schedule (every 6 hours) | Monitors database health, sends alerts |
| `daily-summary-workflow.json` | Schedule (23:00 daily) | Sends daily business metrics report |

## Quick Start

### 1. Import Workflows into n8n

1. Open your n8n instance
2. Go to **Workflows** > **Import from File**
3. Select the JSON files from this directory
4. Save and activate each workflow

### 2. Configure Environment Variables

In n8n, go to **Settings** > **Variables** and add:

| Variable | Description | Example |
|----------|-------------|---------|
| `PIZZA_FALCHI_API_URL` | Your app's base URL | `https://pizzafalchi.com` |
| `N8N_WEBHOOK_SECRET` | Shared secret for webhook signing | `your-secret-key-here` |
| `ADMIN_EMAIL` | Admin email for alerts/reports | `admin@pizzafalchi.com` |
| `ADMIN_EMAIL_FROM` | Sender email (optional) | `noreply@pizzafalchi.com` |

### 3. Configure Your App

Add to your `.env.local`:

```env
# n8n Integration
N8N_ENABLED=true
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/pizza-falchi
N8N_WEBHOOK_SECRET=your-secret-key-here
```

### 4. Get Webhook URLs

After importing, n8n will generate webhook URLs. Update your dispatcher with:

- **Order Created**: `{n8n}/webhook/pizza-falchi/order-created`
- **Order Ready**: `{n8n}/webhook/pizza-falchi/order-ready`
- **Status Changed**: `{n8n}/webhook/pizza-falchi/order-status-changed`

## Workflow Details

### Order Confirmation Workflow

```
Webhook Trigger → Validate Event → Extract Data → [Parallel]
                                                    ├── Check Email → Send Email Confirmation
                                                    └── Check Phone → Send WhatsApp Confirmation
                                                                            ↓
                                                                    Auto-Confirm Order
```

**Features:**
- Validates incoming webhook signature
- Sends email confirmation (if email provided)
- Sends WhatsApp notification to restaurant
- Auto-confirms the order after notifications

### Order Ready Workflow

```
Webhook Trigger → Validate Ready Event → Extract Data → [Parallel]
                                                          ├── Send WhatsApp (Priority)
                                                          └── Send Email
```

**Features:**
- High-priority customer notification
- WhatsApp for immediate delivery
- Email as backup channel

### Order Status Change Workflow

```
Webhook Trigger → Extract Data → Route by Status → Notify
                                        ├── Confirmed → Email
                                        ├── Preparing → Email
                                        ├── Ready → Email + WhatsApp
                                        ├── Completed → Email
                                        └── Cancelled → Email + WhatsApp
```

**Features:**
- Routes based on new status
- Different channels for different statuses
- Ready/Cancelled get multi-channel notifications

### Daily Health Check Workflow

```
Schedule (6 hours) → Fetch Health Report → Check Status
                                               ├── Critical → Send Critical Alert
                                               ├── Warning → Send Warning Alert
                                               └── Healthy → Log (no action)
```

**Checks:**
- Product count and availability
- Missing product images
- Time slot availability
- Pending orders count
- Provides recommendations

### Daily Summary Workflow

```
Schedule (23:00) → Fetch Stats → Calculate Metrics → Send Summary Email
```

**Report Includes:**
- Total orders and completion rate
- Revenue (total and average)
- New vs returning customers
- Top 5 selling products

## API Endpoints Used

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/webhooks/n8n` | POST | Receives commands from n8n |
| `/api/health/database` | GET | Returns health report |
| `/api/health/database?stats=true` | GET | Returns daily statistics |

## Webhook Payload Format

### Sending to Pizza Falchi API

```json
{
  "action": "send_notification",
  "orderId": "507f1f77bcf86cd799439011",
  "data": {
    "notificationType": "order_confirmation",
    "channel": "email"
  },
  "metadata": {
    "source": "n8n",
    "workflowId": "order-confirmation"
  }
}
```

### Receiving from Pizza Falchi

```json
{
  "eventId": "evt_123",
  "eventType": "order.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "webhookVersion": "1.0",
  "data": {
    "orderId": "507f1f77bcf86cd799439011",
    "orderNumber": "ABC123",
    "customer": {
      "name": "Jean Dupont",
      "email": "jean@example.com",
      "phone": "+33612345678"
    },
    "items": [...],
    "totalAmount": 35.50,
    "deliveryType": "pickup"
  }
}
```

## Supported Actions

| Action | Description |
|--------|-------------|
| `update_order_status` | Update order status |
| `send_notification` | Send email/WhatsApp notification |
| `assign_driver` | Assign delivery driver |
| `update_kds` | Update Kitchen Display status |
| `update_delivery_status` | Update delivery tracking |
| `cancel_order` | Cancel an order |

## Troubleshooting

### Workflow not triggering

1. Check webhook URL is correctly configured
2. Verify n8n workflow is active (toggle on)
3. Check n8n execution logs for errors

### Signature validation failing

1. Ensure `N8N_WEBHOOK_SECRET` matches in both n8n and app
2. Check timestamp is within 5 minutes
3. Verify payload format matches schema

### Notifications not sending

1. Check email/WhatsApp credentials in app `.env`
2. Verify customer has email/phone in order
3. Check n8n execution logs for API errors

## Security Notes

- All webhook endpoints require HMAC signature verification
- Rate limiting is applied (100 requests/minute per IP)
- Secrets should never be committed to version control
- Use HTTPS for all webhook communications
