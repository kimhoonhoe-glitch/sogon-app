import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-10-28.acacia',
})

export const PREMIUM_PRICE = 5000
export const FREE_DAILY_LIMIT = 3
