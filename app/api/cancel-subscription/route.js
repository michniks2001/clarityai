import Stripe from "stripe";
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { app } from "@/app/firebase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: "2024-11-20.acacia",
});

export async function POST(req) {
	const db = getFirestore(app);

	try {
		const body = await req.json();
		const { subscriptionId, userId } = body;

		if (!userId || !subscriptionId) {
			console.error("Invalid userId or subscriptionId");
			return new Response(
				JSON.stringify({ message: "Invalid userId or subscriptionId" }),
				{ status: 400, headers: { "Content-Type": "application/json" } }
			);
		}

		// Cancel the subscription in Stripe
		try {
			const canceledSubscription = await stripe.subscriptions.del(subscriptionId);

			// Check if the subscription was successfully canceled
			if (canceledSubscription.status === "canceled") {
				// Update Firestore to mark the subscription as canceled
				const subscribersRef = collection(db, "subscribers");
				const existingSubscriberQuery = query(
					subscribersRef,
					where("userId", "==", userId),
					where("status_", "==", "subscribed")
				);

				const existingSubscribers = await getDocs(existingSubscriberQuery);

				if (!existingSubscribers.empty) {
					// Update the status of the subscription in Firestore
					const subscriberDoc = existingSubscribers.docs[0];
					await updateDoc(doc(db, "subscribers", subscriberDoc.id), {
						status_: "canceled",
					});

					return new Response(
						JSON.stringify({ message: "Subscription canceled successfully" }),
						{ status: 200, headers: { "Content-Type": "application/json" } }
					);
				} else {
					console.error("No active subscription found in Firestore");
					return new Response(
						JSON.stringify({ message: "No active subscription found in Firestore" }),
						{ status: 404, headers: { "Content-Type": "application/json" } }
					);
				}
			} else {
				console.error("Failed to cancel subscription in Stripe");
				return new Response(
					JSON.stringify({ message: "Failed to cancel subscription in Stripe" }),
					{ status: 500, headers: { "Content-Type": "application/json" } }
				);
			}
		} catch (stripeError) {
			console.error("Stripe error:", stripeError.message);
			return new Response(
				JSON.stringify({ message: "Stripe error", error: stripeError.message }),
				{ status: 500, headers: { "Content-Type": "application/json" } }
			);
		}
	} catch (err) {
		console.error("Request error:", err);
		return new Response(
			JSON.stringify({
				message: "Error processing request",
				error: err instanceof Error ? err.message : "Unknown error",
			}),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		);
	}
}

