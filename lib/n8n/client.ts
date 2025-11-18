/**
 * n8n API Client
 * Client for interacting with n8n workflows and executions
 */

import { createWebhookHeaders } from '@/lib/webhooks/signatures';

/**
 * n8n client configuration
 */
export interface N8nClientConfig {
  baseUrl: string;
  apiKey?: string;
  webhookUrl?: string;
  webhookSecret?: string;
  timeout?: number;
}

/**
 * n8n workflow execution request
 */
export interface WorkflowExecutionRequest {
  workflowId?: string;
  webhookPath?: string;
  data: Record<string, any>;
  waitForCompletion?: boolean;
}

/**
 * n8n workflow execution response
 */
export interface WorkflowExecutionResponse {
  success: boolean;
  executionId?: string;
  data?: any;
  error?: string;
}

/**
 * n8n Client Class
 */
export class N8nClient {
  private config: N8nClientConfig;

  constructor(config?: Partial<N8nClientConfig>) {
    this.config = {
      baseUrl: process.env.N8N_BASE_URL || 'http://localhost:5678',
      apiKey: process.env.N8N_API_KEY,
      webhookUrl: process.env.N8N_WEBHOOK_URL,
      webhookSecret: process.env.N8N_WEBHOOK_SECRET,
      timeout: 30000,
      ...config,
    };
  }

  /**
   * Trigger n8n workflow via webhook
   */
  async triggerWorkflow(
    request: WorkflowExecutionRequest
  ): Promise<WorkflowExecutionResponse> {
    try {
      const url = request.webhookPath
        ? `${this.config.baseUrl}/webhook/${request.webhookPath}`
        : this.config.webhookUrl;

      if (!url) {
        throw new Error('No webhook URL configured');
      }

      // Create headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Add API key if configured
      if (this.config.apiKey) {
        headers['X-N8N-API-KEY'] = this.config.apiKey;
      }

      // Add webhook signature if secret is configured
      if (this.config.webhookSecret) {
        const signatureHeaders = createWebhookHeaders(
          request.data,
          this.config.webhookSecret
        );
        Object.assign(headers, signatureHeaders);
      }

      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        this.config.timeout || 30000
      );

      // Make request
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(request.data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Parse response
      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        return {
          success: false,
          error: responseData?.message || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return {
        success: true,
        executionId: responseData?.executionId,
        data: responseData,
      };
    } catch (error) {
      console.error('n8n workflow trigger error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get workflow execution status (if n8n API is configured)
   */
  async getExecutionStatus(executionId: string): Promise<any> {
    if (!this.config.apiKey) {
      throw new Error('n8n API key not configured');
    }

    const url = `${this.config.baseUrl}/api/v1/executions/${executionId}`;

    const response = await fetch(url, {
      headers: {
        'X-N8N-API-KEY': this.config.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get execution status: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * List recent workflow executions
   */
  async listExecutions(limit: number = 10): Promise<any> {
    if (!this.config.apiKey) {
      throw new Error('n8n API key not configured');
    }

    const url = `${this.config.baseUrl}/api/v1/executions?limit=${limit}`;

    const response = await fetch(url, {
      headers: {
        'X-N8N-API-KEY': this.config.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to list executions: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Trigger order confirmation workflow
   */
  async triggerOrderConfirmation(orderData: any): Promise<WorkflowExecutionResponse> {
    return this.triggerWorkflow({
      webhookPath: 'order-confirmation',
      data: {
        event: 'order.created',
        order: orderData,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Trigger delivery assignment workflow
   */
  async triggerDeliveryAssignment(
    orderId: string,
    deliveryData: any
  ): Promise<WorkflowExecutionResponse> {
    return this.triggerWorkflow({
      webhookPath: 'delivery-assignment',
      data: {
        event: 'delivery.assign',
        orderId,
        delivery: deliveryData,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Trigger kitchen display update
   */
  async triggerKitchenDisplay(
    orderId: string,
    status: string,
    items: any[]
  ): Promise<WorkflowExecutionResponse> {
    return this.triggerWorkflow({
      webhookPath: 'kitchen-display',
      data: {
        event: 'kds.update',
        orderId,
        status,
        items,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Send custom notification
   */
  async sendNotification(
    channel: 'whatsapp' | 'email' | 'sms',
    recipient: string,
    message: string,
    metadata?: any
  ): Promise<WorkflowExecutionResponse> {
    return this.triggerWorkflow({
      webhookPath: 'send-notification',
      data: {
        event: 'notification.send',
        channel,
        recipient,
        message,
        metadata,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/healthz`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Create singleton instance
let client: N8nClient | null = null;

/**
 * Get or create n8n client instance
 */
export function getN8nClient(config?: Partial<N8nClientConfig>): N8nClient {
  if (!client) {
    client = new N8nClient(config);
  }
  return client;
}

/**
 * Quick helper functions
 */
export const n8n = {
  /**
   * Trigger workflow
   */
  trigger: async (webhookPath: string, data: any) => {
    const client = getN8nClient();
    return client.triggerWorkflow({ webhookPath, data });
  },

  /**
   * Send order confirmation
   */
  confirmOrder: async (orderData: any) => {
    const client = getN8nClient();
    return client.triggerOrderConfirmation(orderData);
  },

  /**
   * Assign delivery
   */
  assignDelivery: async (orderId: string, deliveryData: any) => {
    const client = getN8nClient();
    return client.triggerDeliveryAssignment(orderId, deliveryData);
  },

  /**
   * Update kitchen display
   */
  updateKitchen: async (orderId: string, status: string, items: any[]) => {
    const client = getN8nClient();
    return client.triggerKitchenDisplay(orderId, status, items);
  },

  /**
   * Send notification
   */
  notify: async (
    channel: 'whatsapp' | 'email' | 'sms',
    recipient: string,
    message: string
  ) => {
    const client = getN8nClient();
    return client.sendNotification(channel, recipient, message);
  },

  /**
   * Check health
   */
  isHealthy: async () => {
    const client = getN8nClient();
    return client.healthCheck();
  },
};