1 import Stripe from 'stripe'
2 const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
3   apiVersion: '2023-10-16', // 쉼표가 여기에 있어야 합니다!
4 }); // 중괄호와 닫는 괄호로 마무리
export const PREMIUM_PRICE = 5000
export const FREE_DAILY_LIMIT = 999999 // 사실상 무제한