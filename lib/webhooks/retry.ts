/**
 * Webhook Retry Mechanism
 * Implements exponential backoff and retry logic for failed webhook deliveries
 */

import { WebhookDeliveryStatus } from '@/types/webhooks';

/**
 * Retry configuration
 */
export interface RetryConfig {
  maxAttempts: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  jitterEnabled: boolean;
}

/**
 * Default retry configuration
 */
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 5,
  initialDelayMs: 1000, // 1 second
  maxDelayMs: 60000, // 1 minute
  backoffMultiplier: 2,
  jitterEnabled: true,
};

/**
 * Retry result
 */
export interface RetryResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
  attempts: number;
  lastAttemptAt: Date;
  totalDuration: number; // in ms
}

/**
 * Attempt record
 */
export interface AttemptRecord {
  attemptNumber: number;
  timestamp: Date;
  status: 'success' | 'failed' | 'timeout';
  statusCode?: number;
  duration: number; // in ms
  error?: string;
}

/**
 * Calculate delay for next retry using exponential backoff
 */
export function calculateBackoffDelay(
  attemptNumber: number,
  config: RetryConfig
): number {
  // Calculate base delay with exponential backoff
  const baseDelay = Math.min(
    config.initialDelayMs * Math.pow(config.backoffMultiplier, attemptNumber - 1),
    config.maxDelayMs
  );

  // Add jitter to prevent thundering herd
  if (config.jitterEnabled) {
    // Random jitter between 0% and 20% of base delay
    const jitter = Math.random() * 0.2 * baseDelay;
    return Math.floor(baseDelay + jitter);
  }

  return baseDelay;
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Execute function with retry logic
 */
export async function executeWithRetry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {},
  onAttempt?: (attempt: AttemptRecord) => void
): Promise<RetryResult<T>> {
  const finalConfig: RetryConfig = {
    ...DEFAULT_RETRY_CONFIG,
    ...config,
  };

  const attempts: AttemptRecord[] = [];
  const startTime = Date.now();
  let lastError: Error | undefined;

  for (let attemptNumber = 1; attemptNumber <= finalConfig.maxAttempts; attemptNumber++) {
    const attemptStartTime = Date.now();

    try {
      // Execute the function
      const data = await fn();

      // Success - record attempt and return
      const attemptRecord: AttemptRecord = {
        attemptNumber,
        timestamp: new Date(),
        status: 'success',
        duration: Date.now() - attemptStartTime,
      };

      attempts.push(attemptRecord);
      if (onAttempt) onAttempt(attemptRecord);

      return {
        success: true,
        data,
        attempts: attemptNumber,
        lastAttemptAt: new Date(),
        totalDuration: Date.now() - startTime,
      };
    } catch (error) {
      // Failure - record attempt
      lastError = error instanceof Error ? error : new Error(String(error));

      const attemptRecord: AttemptRecord = {
        attemptNumber,
        timestamp: new Date(),
        status: 'failed',
        duration: Date.now() - attemptStartTime,
        error: lastError.message,
        statusCode: (error as any)?.statusCode,
      };

      attempts.push(attemptRecord);
      if (onAttempt) onAttempt(attemptRecord);

      // Check if we should retry
      if (attemptNumber < finalConfig.maxAttempts) {
        // Check if error is retryable
        if (!isRetryableError(error)) {
          break; // Don't retry non-retryable errors
        }

        // Calculate delay and wait
        const delay = calculateBackoffDelay(attemptNumber, finalConfig);
        await sleep(delay);
      }
    }
  }

  // All attempts failed
  return {
    success: false,
    error: lastError,
    attempts: attempts.length,
    lastAttemptAt: new Date(),
    totalDuration: Date.now() - startTime,
  };
}

/**
 * Determine if an error is retryable
 */
export function isRetryableError(error: any): boolean {
  // Network errors are retryable
  if (error.code === 'ECONNREFUSED' ||
      error.code === 'ECONNRESET' ||
      error.code === 'ETIMEDOUT' ||
      error.code === 'ENOTFOUND' ||
      error.code === 'EHOSTUNREACH') {
    return true;
  }

  // HTTP status codes that are retryable
  const statusCode = error.statusCode || error.status;
  if (statusCode) {
    // 5xx errors are usually retryable (server errors)
    if (statusCode >= 500 && statusCode < 600) {
      return true;
    }
    // 429 Too Many Requests is retryable
    if (statusCode === 429) {
      return true;
    }
    // 408 Request Timeout is retryable
    if (statusCode === 408) {
      return true;
    }
  }

  // Default to not retrying
  return false;
}

/**
 * Webhook-specific retry function
 */
export async function retryWebhookDelivery(
  url: string,
  payload: any,
  headers: Record<string, string>,
  config: Partial<RetryConfig> = {}
): Promise<RetryResult<Response>> {
  const deliver = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Check if response is successful
      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        (error as any).statusCode = response.status;
        (error as any).response = await response.text().catch(() => '');
        throw error;
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);

      // Handle abort error
      if (error instanceof Error && error.name === 'AbortError') {
        const timeoutError = new Error('Request timeout');
        (timeoutError as any).code = 'ETIMEDOUT';
        throw timeoutError;
      }

      throw error;
    }
  };

  return executeWithRetry(deliver, config);
}

/**
 * Create a retry queue for webhooks
 */
export class WebhookRetryQueue {
  private queue: Array<{
    id: string;
    url: string;
    payload: any;
    headers: Record<string, string>;
    config: Partial<RetryConfig>;
    attempts: number;
    nextRetryAt: Date;
  }> = [];

  private processing = false;
  private processInterval: NodeJS.Timeout | null = null;

  constructor(
    private onDelivery?: (id: string, result: RetryResult<Response>) => void,
    private processIntervalMs: number = 5000 // Check every 5 seconds
  ) {
    this.startProcessing();
  }

  /**
   * Add webhook to retry queue
   */
  add(
    id: string,
    url: string,
    payload: any,
    headers: Record<string, string>,
    config: Partial<RetryConfig> = {}
  ): void {
    const existingIndex = this.queue.findIndex(item => item.id === id);

    if (existingIndex >= 0) {
      // Update existing item
      this.queue[existingIndex].attempts++;
      this.queue[existingIndex].nextRetryAt = this.calculateNextRetryTime(
        this.queue[existingIndex].attempts,
        config
      );
    } else {
      // Add new item
      this.queue.push({
        id,
        url,
        payload,
        headers,
        config,
        attempts: 1,
        nextRetryAt: this.calculateNextRetryTime(1, config),
      });
    }
  }

  /**
   * Remove webhook from queue
   */
  remove(id: string): void {
    this.queue = this.queue.filter(item => item.id !== id);
  }

  /**
   * Get queue size
   */
  size(): number {
    return this.queue.length;
  }

  /**
   * Get queue status
   */
  getStatus(): {
    size: number;
    processing: boolean;
    nextProcessAt?: Date;
    items: Array<{ id: string; attempts: number; nextRetryAt: Date }>;
  } {
    return {
      size: this.queue.length,
      processing: this.processing,
      items: this.queue.map(item => ({
        id: item.id,
        attempts: item.attempts,
        nextRetryAt: item.nextRetryAt,
      })),
    };
  }

  /**
   * Start processing queue
   */
  private startProcessing(): void {
    if (this.processInterval) return;

    this.processInterval = setInterval(() => {
      this.processQueue();
    }, this.processIntervalMs);
  }

  /**
   * Stop processing queue
   */
  stopProcessing(): void {
    if (this.processInterval) {
      clearInterval(this.processInterval);
      this.processInterval = null;
    }
  }

  /**
   * Process queue
   */
  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;
    const now = new Date();

    // Find items ready for retry
    const readyItems = this.queue.filter(item => item.nextRetryAt <= now);

    // Process each ready item
    for (const item of readyItems) {
      try {
        const result = await retryWebhookDelivery(
          item.url,
          item.payload,
          item.headers,
          { ...DEFAULT_RETRY_CONFIG, ...item.config, maxAttempts: 1 }
        );

        if (result.success) {
          // Success - remove from queue
          this.remove(item.id);
        } else {
          // Failed - update retry time
          const totalConfig = { ...DEFAULT_RETRY_CONFIG, ...item.config };
          if (item.attempts >= totalConfig.maxAttempts) {
            // Max attempts reached - remove from queue
            this.remove(item.id);
          } else {
            // Schedule next retry
            item.attempts++;
            item.nextRetryAt = this.calculateNextRetryTime(item.attempts, item.config);
          }
        }

        // Notify callback
        if (this.onDelivery) {
          this.onDelivery(item.id, result);
        }
      } catch (error) {
        console.error(`Error processing webhook ${item.id}:`, error);
      }
    }

    this.processing = false;
  }

  /**
   * Calculate next retry time
   */
  private calculateNextRetryTime(
    attempts: number,
    config: Partial<RetryConfig>
  ): Date {
    const finalConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
    const delay = calculateBackoffDelay(attempts, finalConfig);
    return new Date(Date.now() + delay);
  }

  /**
   * Clear queue
   */
  clear(): void {
    this.queue = [];
  }

  /**
   * Destroy queue
   */
  destroy(): void {
    this.stopProcessing();
    this.clear();
  }
}