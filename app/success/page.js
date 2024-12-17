"use client";

import React from "react";
import {
    Box,
    Button,
    Text,
    Heading,
    Container,
    VStack,
    HStack,
    Image,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

const SubscriptionSuccessPage = () => {
    return (
        <Box
            bg="linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
            bgSize="400% 400%"
            animation="gradient 15s ease infinite"
            css={{
                '@keyframes gradient': {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                },
            }}
            minHeight="100vh"
            py={10}
            fontFamily="'Inter', sans-serif"
            textAlign="center"
        >
            <Container maxW="container.md">
                {/* Success Header */}
                <VStack spacing={6} align="center">
                    <Heading
                        as="h1"
                        size="2xl"
                        bgGradient="linear(to-r, #6a11cb 0%, #2575fc 100%)"
                        bgClip="text"
                        fontWeight="extrabold"
                        fontFamily="'Poppins', sans-serif"
                        p={4}
                    >
                        Thank You for Subscribing!
                    </Heading>
                    <Text fontSize="lg" color="gray.600">
                        Your subscription to ClarityAI is now active. Transforming chaos into
                        clarity starts here.
                    </Text>
                </VStack>

                {/* Illustration */}
                <Box
                    as={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    mt={10}
                >
                    <Image
                        src="/success-illustration.jpg"
                        alt="Success Illustration"
                        maxW="sm"
                        mx="auto"
                    />
                </Box>

                {/* Confirmation Details */}
                <VStack spacing={4} mt={10}>
                    <Text fontSize="lg" color="gray.700">
                        We’ve sent a confirmation email to your inbox with all the details
                        about your subscription.
                    </Text>
                    <Text fontSize="lg" color="gray.700">
                        If you have any questions, feel free to reach out to our support
                        team.
                    </Text>
                </VStack>

                {/* Action Buttons */}
                <HStack spacing={6} mt={10} justify="center">
                    <Button
                        as="a"
                        href="/dashboard"
                        bgGradient="linear(to-r, #6a11cb 0%, #2575fc 100%)"
                        color="white"
                        size="lg"
                        borderRadius="xl"
                        _hover={{
                            bgGradient: "linear(to-r, #6a11cb 30%, #2575fc 100%)",
                            transform: "scale(1.02)",
                        }}
                        transition="all 0.2s ease"
                    >
                        Go to Dashboard
                    </Button>
                    <Button
                        as="a"
                        href="/support"
                        variant="outline"
                        borderColor="purple.600"
                        color="purple.600"
                        size="lg"
                        borderRadius="xl"
                        _hover={{
                            bg: "purple.100",
                            transform: "scale(1.02)",
                        }}
                        transition="all 0.2s ease"
                    >
                        Contact Support
                    </Button>
                </HStack>
            </Container>
        </Box>
    );
};

export default SubscriptionSuccessPage;
