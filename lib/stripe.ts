import Stripe from 'stripe'

const stripeKey = process.env.STRIPE_SECRET_KEY

export const stripe = stripeKey 
  ? new Stripe(stripeKey, {
      apiVersion: '2025-09-30.clover',
    })
  : null

export const PREMIUM_PRICE = 5000
export const FREE_DAILY_LIMIT = 999999 // 사실상 무제한
