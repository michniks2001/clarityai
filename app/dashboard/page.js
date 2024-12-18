"use client";

import {
    Box,
    VStack,
    Heading,
    Text,
    Container,
    Avatar,
    Button,
    FormControl,
    FormLabel,
    Input,
    useToast,
    HStack,
} from "@chakra-ui/react";
import { getAuth, onAuthStateChanged, signOut, updateEmail, updatePassword } from "firebase/auth";
import { app } from "../firebase";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false);
    const router = useRouter();
    const toast = useToast();
    const db = getFirestore(app);

    useEffect(() => {
        const auth = getAuth(app);

        // Listen for auth state changes
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                checkSubscriptionStatus(currentUser.uid);
            } else {
                // Redirect to login if no user is logged in
                router.push("/login");
            }
        });
        const checkSubscriptionStatus = async (userId) => {
            const q = query(collection(db, 'subscribers'), where('userId', '==', userId));
            const querySnapshot = await getDocs(q);
            setIsSubscribed(!querySnapshot.empty);
        };

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [db, router]);



    const handleSignOut = async () => {
        try {
            const auth = getAuth(app);
            await signOut(auth);
            router.push("/login");
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    const handleUpdateEmail = async () => {
        try {
            const auth = getAuth(app);
            await updateEmail(auth.currentUser, newEmail);
            toast({
                title: "Email updated.",
                description: "Your email has been successfully updated.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error("Error updating email: ", error);
            toast({
                title: "Error updating email.",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleUpdatePassword = async () => {
        try {
            const auth = getAuth(app);
            await updatePassword(auth.currentUser, newPassword);
            toast({
                title: "Password updated.",
                description: "Your password has been successfully updated.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error("Error updating password: ", error);
            toast({
                title: "Error updating password.",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleEndSubscription = async () => {
        try {
            const q = query(collection(db, 'subscribers'), where('userId', '==', user.uid));
            const querySnapshot = await getDocs(q);
            const subscriptionId = querySnapshot.docs[0].get('subscriptionId')

            try {
                const response = await fetch('/api/cancel-subscription', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ subscriptionId })

                })

                const data = await response.json()
                if (data.success) {
                    setStatus("Subscription canceled successfully")
                } else {
                    setStatus("Failed to cancel subscription")
                }

            } catch (error) {
                console.error(error)
            }
            setIsSubscribed(false);
            toast({
                title: "Subscription ended.",
                description: "Your subscription has been successfully ended.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error("Error ending subscription: ", error);
            toast({
                title: "Error ending subscription.",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    if (!user) {
        return null; // or a loading spinner
    }

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
            py={10}
            fontFamily="'Inter', sans-serif"
        >
            <Container maxW="container.md">
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
                        >
                            Dashboard
                        </Heading>
                        <Text
                            fontSize="xl"
                            color="gray.600"
                            mt={2}
                            fontWeight="medium"
                        >
                            Manage your account and subscription
                        </Text>
                    </Box>

                    {/* User Information */}
                    <Box
                        bg="white"
                        borderRadius="2xl"
                        shadow="2xl"
                        p={10}
                        border="1px"
                        borderColor="gray.200"
                    >
                        <VStack spacing={6} align="stretch">
                            <HStack spacing={4} align="center">
                                <Avatar size="xl" name={user.email} src={user.photoURL || undefined} />
                                <VStack align="start">
                                    <Text fontWeight="bold" fontSize="lg">Email:</Text>
                                    <Text>{user.email}</Text>
                                    <Text fontWeight="bold" fontSize="lg">User ID:</Text>
                                    <Text>{user.uid}</Text>
                                    <Text fontWeight="bold" fontSize="lg">Account Created:</Text>
                                    <Text>{user.metadata.creationTime}</Text>
                                </VStack>
                            </HStack>

                            {/* Update Email */}
                            <FormControl id="newEmail">
                                <FormLabel fontWeight="bold" color="purple.600">New Email</FormLabel>
                                <Input
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="Enter new email"
                                    borderColor="purple.200"
                                    focusBorderColor="purple.500"
                                    _placeholder={{ color: "gray.400" }}
                                    size="lg"
                                    borderRadius="xl"
                                    _hover={{ transform: "scale(1.02)", transition: "all 0.2s ease" }}
                                    _active={{ transform: "scale(0.98)" }}
                                />
                                <Button mt={2} onClick={handleUpdateEmail} bgGradient="linear(to-r, #6a11cb 0%, #2575fc 100%)" color="white" size="lg" borderRadius="xl" _hover={{ bgGradient: "linear(to-r, #6a11cb 30%, #2575fc 100%)", transform: "scale(1.02)" }} transition="all 0.2s ease">
                                    Update Email
                                </Button>
                            </FormControl>

                            {/* Update Password */}
                            <FormControl id="newPassword">
                                <FormLabel fontWeight="bold" color="purple.600">New Password</FormLabel>
                                <Input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    borderColor="purple.200"
                                    focusBorderColor="purple.500"
                                    _placeholder={{ color: "gray.400" }}
                                    size="lg"
                                    borderRadius="xl"
                                    _hover={{ transform: "scale(1.02)", transition: "all 0.2s ease" }}
                                    _active={{ transform: "scale(0.98)" }}
                                />
                                <Button mt={2} onClick={handleUpdatePassword} bgGradient="linear(to-r, #6a11cb 0%, #2575fc 100%)" color="white" size="lg" borderRadius="xl" _hover={{ bgGradient: "linear(to-r, #6a11cb 30%, #2575fc 100%)", transform: "scale(1.02)" }} transition="all 0.2s ease">
                                    Update Password
                                </Button>
                            </FormControl>

                            {/* Subscription Status */}
                            <Box>
                                <Text fontWeight="bold" fontSize="lg" color="purple.600">Subscription Status:</Text>
                                <Text>{isSubscribed ? "Active" : "Inactive"}</Text>
                                {isSubscribed && (
                                    <Button mt={2} onClick={handleEndSubscription} colorScheme="red" size="lg" borderRadius="xl">
                                        End Subscription
                                    </Button>
                                )}
                            </Box>

                            {/* Sign Out Button */}
                            <Button onClick={handleSignOut} colorScheme="red" size="lg" borderRadius="xl" width="full">
                                Sign Out
                            </Button>
                        </VStack>
                    </Box>
                </VStack>
            </Container>
        </Box>
    );
};

export default Dashboard;
