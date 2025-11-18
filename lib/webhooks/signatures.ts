/**
 * Webhook Signature Verification
 * HMAC-SHA256 signature verification for webhook security
 */

import crypto from 'crypto';

/**
 * Configuration for webhook signature
 */
interface SignatureConfig {
  secret: string;
  algorithm?: 'sha256' | 'sha512';
  encoding?: 'hex' | 'base64';
  timestampTolerance?: number; // in seconds
}

/**
 * Generate HMAC signature for webhook payload
 */
export function generateSignature(
  payload: string | Buffer,
  secret: string,
  timestamp: string,
  algorithm: 'sha256' | 'sha512' = 'sha256',
  encoding: 'hex' | 'base64' = 'hex'
): string {
  // Create the signed content by combining timestamp and payload
  const signedContent = `${timestamp}.${payload}`;

  // Generate HMAC
  const hmac = crypto.createHmac(algorithm, secret);
  hmac.update(signedContent);

  return hmac.digest(encoding);
}

/**
 * Verify webhook signature
 */
export function verifySignature(
  payload: string | Buffer,
  signature: string,
  timestamp: string,
  config: SignatureConfig
): { valid: boolean; error?: string } {
  const {
    secret,
    algorithm = 'sha256',
    encoding = 'hex',
    timestampTolerance = 300, // 5 minutes default
  } = config;

  // Check timestamp to prevent replay attacks
  const currentTime = Math.floor(Date.now() / 1000);
  const webhookTime = parseInt(timestamp, 10);

  if (isNaN(webhookTime)) {
    return {
      valid: false,
      error: 'Invalid timestamp format',
    };
  }

  const timeDiff = Math.abs(currentTime - webhookTime);

  if (timeDiff > timestampTolerance) {
    return {
      valid: false,
      error: `Timestamp tolerance exceeded. Difference: ${timeDiff}s, Tolerance: ${timestampTolerance}s`,
    };
  }

  // Generate expected signature
  const expectedSignature = generateSignature(
    payload,
    secret,
    timestamp,
    algorithm,
    encoding
  );

  // Constant-time comparison to prevent timing attacks
  const valid = timingSafeEqual(signature, expectedSignature);

  if (!valid) {
    return {
      valid: false,
      error: 'Signature mismatch',
    };
  }

  return { valid: true };
}

/**
 * Timing-safe string comparison
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  // Convert strings to buffers for comparison
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);

  return crypto.timingSafeEqual(bufferA, bufferB);
}

/**
 * Extract signature from webhook headers
 */
export function extractSignatureFromHeaders(
  headers: Record<string, string | string[] | undefined>,
  signatureHeaderName: string = 'x-webhook-signature'
): { signature?: string; timestamp?: string; error?: string } {
  const signatureHeader = headers[signatureHeaderName];
  const timestampHeader = headers['x-webhook-timestamp'];

  if (!signatureHeader) {
    return {
      error: `Missing signature header: ${signatureHeaderName}`,
    };
  }

  if (!timestampHeader) {
    return {
      error: 'Missing timestamp header: x-webhook-timestamp',
    };
  }

  const signature = Array.isArray(signatureHeader)
    ? signatureHeader[0]
    : signatureHeader;

  const timestamp = Array.isArray(timestampHeader)
    ? timestampHeader[0]
    : timestampHeader;

  return { signature, timestamp };
}

/**
 * Verify webhook request from n8n
 */
export async function verifyN8nWebhook(
  request: Request,
  secret: string
): Promise<{ valid: boolean; payload?: any; error?: string }> {
  try {
    // Get headers
    const signature = request.headers.get('x-webhook-signature');
    const timestamp = request.headers.get('x-webhook-timestamp');
    const eventType = request.headers.get('x-webhook-event');

    if (!signature || !timestamp) {
      return {
        valid: false,
        error: 'Missing required webhook headers',
      };
    }

    // Get raw body
    const rawBody = await request.text();

    // Verify signature
    const verificationResult = verifySignature(
      rawBody,
      signature,
      timestamp,
      { secret }
    );

    if (!verificationResult.valid) {
      return {
        valid: false,
        error: verificationResult.error,
      };
    }

    // Parse payload
    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch (error) {
      return {
        valid: false,
        error: 'Invalid JSON payload',
      };
    }

    return {
      valid: true,
      payload,
    };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown error during verification',
    };
  }
}

/**
 * Create webhook headers for outgoing requests
 */
export function createWebhookHeaders(
  payload: string | object,
  secret: string,
  eventType?: string
): Record<string, string> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const payloadString = typeof payload === 'string'
    ? payload
    : JSON.stringify(payload);

  const signature = generateSignature(
    payloadString,
    secret,
    timestamp
  );

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Webhook-Signature': signature,
    'X-Webhook-Timestamp': timestamp,
    'X-Webhook-Version': '1.0',
  };

  if (eventType) {
    headers['X-Webhook-Event'] = eventType;
  }

  return headers;
}

/**
 * Middleware to verify webhook signatures (for Express-style APIs)
 */
export function webhookSignatureMiddleware(
  secret: string,
  options: Partial<SignatureConfig> = {}
) {
  return async (req: any, res: any, next: any) => {
    const { signature, timestamp, error } = extractSignatureFromHeaders(req.headers);

    if (error || !signature || !timestamp) {
      return res.status(401).json({
        success: false,
        error: error || 'Missing webhook signature or timestamp',
      });
    }

    // Get raw body (assuming it's stored on req.rawBody by another middleware)
    const payload = req.rawBody || JSON.stringify(req.body);

    const verificationResult = verifySignature(
      payload,
      signature,
      timestamp,
      { secret, ...options }
    );

    if (!verificationResult.valid) {
      return res.status(401).json({
        success: false,
        error: verificationResult.error,
      });
    }

    // Attach webhook metadata to request
    req.webhook = {
      signature,
      timestamp,
      verified: true,
    };

    next();
  };
}

/**
 * Test signature generation (for debugging)
 */
export function testSignature(
  payload: object,
  secret: string
): {
  payload: string;
  timestamp: string;
  signature: string;
  headers: Record<string, string>;
} {
  const payloadString = JSON.stringify(payload);
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = generateSignature(payloadString, secret, timestamp);

  return {
    payload: payloadString,
    timestamp,
    signature,
    headers: {
      'X-Webhook-Signature': signature,
      'X-Webhook-Timestamp': timestamp,
      'Content-Type': 'application/json',
    },
  };
}