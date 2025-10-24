// app/api/webhook/stripe/route.ts
import Stripe from 'stripe';

const stripe: Stripe | null = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' })
  : null;

export async function POST(req: Request) {
  // Stripe webhook 검증을 위해 raw body(텍스트)와 서명 헤더를 사용
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') ?? '';
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? '';

  // 1) Stripe 클라이언트가 없는 경우 안전하게 처리
  if (!stripe) {
    console.error('Stripe client is not configured (missing STRIPE_SECRET_KEY).');
    return new Response('Stripe client not configured', { status: 500 });
  }

  // 2) webhook 서명 검증
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('⚠️ Webhook signature verification failed.', err);
    return new Response('Webhook signature verification failed', { status: 400 });
  }

  // 3) 이벤트 처리 (예시)
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        // TODO: 결제 성공 처리 로직
        break;
      case 'invoice.payment_failed':
        // TODO: 실패 처리 로직
        break;
      // 필요한 이벤트 추가
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    return new Response('ok', { status: 200 });
  } catch (err) {
    console.error('Error handling webhook event', err);
    return new Response('internal error', { status: 500 });
  }
}
