import { WebhookStatus } from "./webhookStatus";

export interface Webhook {

  connectedApp: string;
  webhookStatus: WebhookStatus;
}