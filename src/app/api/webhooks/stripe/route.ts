import Stripe from "stripe";
import stripe from "@/lib/stripe";
import {ConvexHttpClient} from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: Request) {
     const body = await request.text();
     const signature = request.headers.get("stripe-signature") as string ;

     
     let event: Stripe.Event;

     try{
      event = stripe.webhooks.constructEvent(body,signature,process.env.STRIPE_WEBHOOK_SECRET!);
     } catch(error){
        console.error("Error constructing event:", error);
        return new Response("Webhook verification failed", {status: 400});
     }
     try{
        switch(event.type){
            case "checkout.session.completed":
                await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
                break;
                default:
                    console.log(`Unhandled event type ${event.type}`); 
                break;
        }
     } catch(error){
        console.error("Error handling event:", error);
        return new Response("Error handling event", {status: 500});
     }
     return new Response("Webhook processed successfully", {status: 200});
}


async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session){
    // We set `customer` to the Stripe customer id and metadata.courseId in `convex/stripe.ts`
    const stripeCustomerId = session.customer as string;
    const courseId = session.metadata?.courseId as string;

    if (!stripeCustomerId || !courseId) {
        console.error("Missing required metadata or customer id", {
            stripeCustomerId,
            courseId,
            metadata: session.metadata,
        });
        return;
    }

    const user = await convex.query(api.users.getUserByStripeCustomerId, { stripeCustomerId });
    if (!user) {
        throw new Error("User not found for Stripe customer id");
    }

    await convex.mutation(api.purchases.recordPurchase, {
        userId: user._id,
        courseId: courseId as Id<"courses">,
        // Stripe amounts are in cents; store raw amount or divide by 100 if you prefer dollars
        amount: session.amount_total ?? 0,
        stripePurchaseId: session.id,
    });
}