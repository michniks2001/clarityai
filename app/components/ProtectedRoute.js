import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../firebase";
import {
    Box,
    Spinner,
    Text,
    VStack,
    Heading,
    Container,
} from '@chakra-ui/react';

export function ProtectedRoute({ children }) {
    const router = useRouter();
    const auth = getAuth(app);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoading(false);
            if (!user) {
                router.push('/login');
            }
        }, (error) => {
            console.error("Auth state change error:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [auth, router]);

    if (isLoading) {
        return (
            <Box
                bg="linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
                bgSize="400% 400%"
                animation="gradient 15s ease infinite"
                css={{
                    '@keyframes gradient': {
                        '0%': { backgroundPosition: '0% 50%' },
                        '50%': { backgroundPosition: '100% 50%' },
                        '100%': { backgroundPosition: '0% 50%' }
                    }
                }}
                minHeight="100vh"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontFamily="'Inter', sans-serif"
            >
                <Container maxW="md" textAlign="center">
                    <VStack spacing={6}>
                        <Heading
                            as="h1"
                            size="2xl"
                            bgGradient="linear(to-r, #6a11cb 0%, #2575fc 100%)"
                            bgClip="text"
                            fontWeight="extrabold"
                            fontFamily="'Poppins', sans-serif"
                        >
                            ClarityAI
                        </Heading>
                        <Text fontSize="lg" color="gray.600">
                            Loading your personalized experience...
                        </Text>
                        <Spinner
                            size="xl"
                            color="purple.500"
                            thickness="4px"
                            speed="0.65s"
                        />
                    </VStack>
                </Container>
            </Box>
        );
    }

    return children;
}
