"use client";

import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Text,
    Heading,
    Container,
    VStack,
    Stack,
    useToast,
} from "@chakra-ui/react";
import { loadStripe } from "@stripe/stripe-js";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { app } from "../firebase.js";
import Link from "next/link.js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const PricingPage = () => {
    const auth = getAuth(app);
    const db = getFirestore(app);
    const toast = useToast();
    const [user, setUser] = useState(null)

    const [isLoading, setIsLoading] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        const auth = getAuth(app);

        // Listen for auth state changes
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []); // Empty dependency array to run only once


    const confirmSubscription = async () => {
        const q = query(collection(db, 'subscribers'), where('userId', '==', user.uid))

        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            if (doc.get('userId') == user.uid) {
                setIsSubscribed(true)
            }
        })
    }


    const handleCheckout = async () => {

        if (!user) {
            toast({
                title: "Please log in first",
                description: "You need to be logged in to purchase a subscription.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const stripe = await stripePromise;
        setIsLoading(true);

        try {
            const response = await fetch('/api/checkout-session', {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
                    userId: user.uid
                })
            });

            if (!response.ok) {
                throw new Error("Failed to create a checkout session");
            }

            const { sessionId } = await response.json();
            const result = await stripe.redirectToCheckout({ sessionId });

            if (result.error) {
                throw new Error(result.error.message);
            }
        } catch (error) {
            console.error("Error redirecting to checkout:", error);
            toast({
                title: "Checkout Error",
                description: "Something went wrong. Please try again.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            bg="linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
            bgSize="400% 400%"
            animation="gradient 15s ease infinite"
            css={{
                "@keyframes gradient": {
                    "0%": { backgroundPosition: "0% 50%" },
                    "50%": { backgroundPosition: "100% 50%" },
                    "100%": { backgroundPosition: "0% 50%" },
                },
            }}
            minHeight="100vh"
            py={10}
            fontFamily="'Inter', sans-serif"
        >
            <Container maxW="container.xl">
                <VStack spacing={10} align="stretch">
                    {/* Header */}
                    <Box textAlign="center" mb={6}>
                        <Heading
                            as="h1"
                            size="3xl"
                            bgGradient="linear(to-r, #6a11cb 0%, #2575fc 100%)"
                            bgClip="text"
                            fontWeight="extrabold"
                            fontFamily="'Poppins', sans-serif"
                            p={2}
                        >
                            ClarityAI Pricing
                        </Heading>
                        <Text
                            fontSize="xl"
                            color="gray.600"
                            mt={2}
                            fontWeight="medium"
                        >
                            Choose the plan that fits your needs
                        </Text>
                    </Box>

                    {/* Pricing Plans */}
                    <Stack
                        direction={{ base: "column", md: "row" }}
                        spacing={10}
                        align="center"
                        justify="center"
                        textAlign={{ base: "center", md: "left" }}
                    >
                        {/* Free Plan */}
                        <Box
                            bg="white"
                            borderRadius="2xl"
                            shadow="2xl"
                            p={6}
                            border="1px"
                            borderColor="gray.200"
                            maxW="sm"
                            textAlign="center"
                            _hover={{ transform: "scale(1.02)", transition: "all 0.2s ease" }}
                        >
                            <Heading as="h3" size="lg" mb={4} color="purple.600">
                                Free Plan
                            </Heading>
                            <Text fontSize="lg" color="gray.600" mb={4}>
                                Perfect for getting started
                            </Text>
                            <VStack spacing={3} align="stretch">
                                <Text color="gray.600">Add up to 3 tasks</Text>
                                <Text color="gray.600">Organize your tasks efficiently</Text>
                                <Text color="gray.600">No downloads available</Text>
                            </VStack>
                            {!user ? (
                                <Button
                                    as="a"
                                    href="/sign-up"
                                    bgGradient="linear(to-r, #6a11cb 0%, #2575fc 100%)"
                                    color="white"
                                    size="lg"
                                    borderRadius="xl"
                                    mt={6}
                                    _hover={{
                                        bgGradient: "linear(to-r, #6a11cb 30%, #2575fc 100%)",
                                        transform: "scale(1.02)",
                                    }}
                                    transition="all 0.2s ease"
                                >
                                    Sign Up for Free
                                </Button>
                            ) : (
                                <Button
                                    disabled={true}
                                    bgGradient="linear(to-r, #6a11cb 0%, #2575fc 100%)"
                                    color="white"
                                    size="lg"
                                    borderRadius="xl"
                                    mt={6}
                                    _hover={{
                                        bgGradient: "linear(to-r, #6a11cb 30%, #2575fc 100%)",
                                        transform: "scale(1.02)",
                                    }}
                                    transition="all 0.2s ease"
                                >
                                    Already Signed In
                                </Button>
                            )}
                        </Box>

                        {/* Premium Plan */}
                        <Box
                            bg="white"
                            borderRadius="2xl"
                            shadow="2xl"
                            p={6}
                            border="1px"
                            borderColor="gray.200"
                            maxW="sm"
                            textAlign="center"
                            _hover={{ transform: "scale(1.02)", transition: "all 0.2s ease" }}
                        >
                            <Heading as="h3" size="lg" mb={4} color="purple.600">
                                Premium Plan
                            </Heading>
                            <Text fontSize="lg" color="gray.600" mb={4}>
                                Unlock all features
                            </Text>
                            <VStack spacing={3} align="stretch">
                                <Text color="gray.600">Add unlimited tasks</Text>
                                <Text color="gray.600">Organize your tasks efficiently</Text>
                                <Text color="gray.600">
                                    Download your organized tasks in multiple formats
                                </Text>
                            </VStack>
                            <Text fontSize="2xl" color="purple.600" fontWeight="bold" mt={6}>
                                $3.99/month
                            </Text>
                            <Button
                                onClick={handleCheckout}
                                isDisabled={isSubscribed}
                                bgGradient="linear(to-r, #6a11cb 0%, #2575fc 100%)"
                                color="white"
                                size="lg"
                                borderRadius="xl"
                                mt={6}
                                _hover={{
                                    bgGradient: "linear(to-r, #6a11cb 30%, #2575fc 100%)",
                                    transform: "scale(1.02)",
                                }}
                                transition="all 0.2s ease"
                            >
                                {isSubscribed ? "Already Subscribed" : "Go Premium"}
                            </Button>
                        </Box>
                    </Stack>
                </VStack>
            </Container>
        </Box>
    );
};

export default PricingPage;
