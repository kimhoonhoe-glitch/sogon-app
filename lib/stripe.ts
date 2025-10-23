1 import Stripe from 'stripe'
2 const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
3   apiVersion: '2023-10-16',
4 });
export const PREMIUM_PRICE = 5000
export const FREE_DAILY_LIMIT = 999999 // 사실상 무제한