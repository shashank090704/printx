// FILE: packages/shared/types.ts
// Shared TypeScript types — used by Next.js frontend, Express backend, and Electron desktop.
// This file must NEVER import from any app-specific package.

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "printing"
  | "completed"
  | "cancelled";

export type PaymentMode = "online" | "offline";

export interface PrintConfig {
  pages: number;
  copies: number;
  colour: boolean;
  duplex: boolean;
}

export interface Order {
  _id: string;
  orderId: string;          // Short human-readable ID e.g. "ABC123"
  fileName: string;
  cloudinaryUrl: string;
  pages: number;
  copies: number;
  colour: boolean;
  duplex: boolean;
  status: OrderStatus;
  paymentMode: PaymentMode;
  totalAmount: number;
  razorpayOrderId?: string; // Only for online payments
  razorpayPaymentId?: string;
  createdAt: string;
  updatedAt: string;
}