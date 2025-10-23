import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});
export const PREMIUM_PRICE = 5000;
export const FREE_DAILY_LIMIT = 999999; // 사실상 무제한