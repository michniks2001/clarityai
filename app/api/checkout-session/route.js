import Stripe from "stripe";
import { getFirestore, addDoc, collection, Timestamp, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { app } from "@/app/firebase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-11-20.acacia",
});

export async function POST(req) {
    const db = getFirestore(app);

    try {
        const body = await req.json();
        const { priceId, userId } = body;

        if (!userId || !priceId) {
            console.error('Invalid userId or priceId');
            return new Response(
                JSON.stringify({ message: 'Invalid userId or priceId' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/pricing",
            metadata: { userId },
        });

        if (!session?.id) {
            console.error('Failed to create checkout session');
            return new Response(
                JSON.stringify({ message: 'Failed to create checkout session' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        try {
            // Check if the user already exists in the subscribers collection
            const subscribersRef = collection(db, 'subscribers');
            const existingSubscriberQuery = query(
                subscribersRef,
                where('userId', '==', userId),
                where('status_', '==', 'subscribed')
            );

            const existingSubscribers = await getDocs(existingSubscriberQuery);

            if (!existingSubscribers.empty) {
                // User is already subscribed
                return new Response(
                    JSON.stringify({ message: 'Already subscribed' }),
                    { status: 200, headers: { 'Content-Type': 'application/json' } }
                );
            }

            // If not already subscribed, add the new subscription and store the session ID and subscriptionId
            const docRef = await addDoc(subscribersRef, {
                userId,
                createdAt: Timestamp.fromDate(new Date()),
                status_: 'subscribed',
                checkoutSessionId: session.id,
                subscriptionId: '', // Placeholder for the subscriptionId
            });

            console.log('Document written with ID:', docRef.id);

            // Now that the user is successfully subscribed, retrieve the subscriptionId from Stripe and update the Firestore document
            const subscription = await stripe.subscriptions.retrieve(session.subscription);

            // Update the subscriber document with the Stripe subscriptionId
            await updateDoc(doc(db, 'subscribers', docRef.id), {
                subscriptionId: subscription.id,
            });

            return new Response(
                JSON.stringify({ message: 'Subscription successful', docId: docRef.id }),
                { status: 201, headers: { 'Content-Type': 'application/json' } }
            );

        } catch (err) {
            console.error('Firestore error:', err.message);
            return new Response(
                JSON.stringify({ message: 'Error saving to Firestore', error: err.message }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

    } catch (err) {
        console.error(err);
        return new Response(
            JSON.stringify({
                message: 'Error creating checkout session',
                error: err instanceof Error ? err.message : 'Unknown error',
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

