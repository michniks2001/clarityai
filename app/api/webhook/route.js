import { buffer } from 'micro';
import Stripe from 'stripe';
import { getFirestore, doc, updateDoc, setDoc, Timestamp } from 'firebase/firestore';
import { app } from "@/app/firebase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: '2024-11-20.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const webhookHandler = async (req, res) => {
	const sig = req.headers['stripe-signature'];
	const buf = await buffer(req);

	let event;

	try {
		// Verify the webhook signature
		event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
	} catch (err) {
		console.error('Webhook signature verification failed:', err.message);
		return res.status(400).json({
			message: 'Webhook signature verification failed',
			error: err.message,
		});
	}

	try {
		const db = getFirestore(app);

		switch (event.type) {
			case 'checkout.session.completed':
				{
					const session = event.data.object;
					const subscriptionId = session.subscription;
					const userId = session.metadata.userId;

					// Find the user by userId in Firestore
					const userRef = doc(db, 'subscribers', userId);

					// Update the user document with subscription details
					await updateDoc(userRef, {
						subscriptionId,
						status_: 'subscribed',
						subscribedAt: Timestamp.fromDate(new Date()), // Optional: track when they subscribed
					});

					console.log(`Subscription successful for user: ${userId}`);
					return res.status(200).json({
						message: 'Subscription successful',
						userId,
						subscriptionId,
					});
				}

			case 'customer.subscription.deleted':
				{
					const subscription = event.data.object;
					const userId = subscription.metadata.userId;

					// Find the user by userId in Firestore
					const userRef = doc(db, 'subscribers', userId);

					// Update user document to reflect the cancellation
					await updateDoc(userRef, {
						status_: 'cancelled',
						cancelledAt: Timestamp.fromDate(new Date()), // Track cancellation time
					});

					console.log(`Subscription canceled for user: ${userId}`);
					return res.status(200).json({
						message: 'Subscription canceled',
						userId,
						subscriptionId: subscription.id,
					});
				}

			default:
				return res.status(400).json({
					message: `Unhandled event type: ${event.type}`,
				});
		}
	} catch (err) {
		console.error('Error processing webhook event:', err);
		return res.status(500).json({
			message: 'Error processing webhook event',
			error: err.message,
		});
	}
};

export default webhookHandler;
