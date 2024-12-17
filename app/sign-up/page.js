"use client"

import React, { useState } from 'react';
import {
    Box,
    Button,
    Text,
    Heading,
    Container,
    VStack,
    FormControl,
    FormLabel,
    Input,
    useToast,
    HStack,
} from '@chakra-ui/react';
import { FcGoogle } from "react-icons/fc"
import Link from 'next/link';
import { app } from "../firebase"
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { useRouter } from "next/navigation"

const SignUp = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const toast = useToast()

    const router = useRouter()



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast({
                title: "Password mismatch.",
                description: "Please make sure your passwords match.",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
            return;
        }

        try {
            const auth = getAuth(app)
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            )

            const user = userCredential.user

            toast({
                title: "Account created!",
                description: "Your account has been successfully created.",
                status: "success",
                duration: 2000,
                isClosable: true
            })

            setTimeout(() => {
                router.push('/home')
            }, 2000)

        } catch (error) {
            console.error("Signup Error:", error)

            switch (error.code) {
                case 'auth/network-request-failed':
                    toast({
                        title: "Network Error",
                        description: "Please check your connection and try again.",
                        status: "error",
                        duration: 9000,
                        isClosable: true
                    })
                    break;
                case 'auth/email-already-in-use':
                    toast({
                        title: "Email Already in Use",
                        description: "This email is already registered. Try logging in instead.",
                        status: "error",
                        duration: 9000,
                        isClosable: true
                    })
                    break;
                default:
                    toast({
                        title: "Error logging in",
                        description: error.message,
                        status: "error",
                        duration: 9000,
                        isClosable: true
                    })

            }
        }
    };

    const handleGoogleLogin = async (e) => {
        e.preventDefault()

        try {
            const auth = getAuth(app)

            signInWithPopup(auth, provider)
                .then((result) => {
                    const credential = GoogleAuthProvider.credentialFromResult(result)
                    const token = credential.accessToken
                    const user = result.user
                })
                .catch((error) => {
                    const errorCode = error.code
                    const errorMessage = error.message
                    const email = error.customData.email
                    const credential = GoogleAuthProvider.credentialFromError(error)
                })
        } catch (error) {
            console.error("Login Error:", error)

            toast({
                title: "Error signing up",
                description: error.message,
                status: "error",
                duration: 9000,
                isClosable: true
            })

        }
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
                            p={2}
                        >
                            Sign Up
                        </Heading>
                        <Text
                            fontSize="xl"
                            color="gray.600"
                            mt={2}
                            fontWeight="medium"
                        >
                            Join ClarityAI and transform chaos into clarity.
                        </Text>
                    </Box>

                    {/* Sign-Up Form */}
                    <Box
                        bg="white"
                        borderRadius="2xl"
                        shadow="2xl"
                        p={10}
                        border="1px"
                        borderColor="gray.200"
                    >
                        <form onSubmit={handleSubmit}>
                            <VStack spacing={6} align="stretch">
                                {/* Email */}
                                <FormControl id="email" isRequired>
                                    <FormLabel
                                        fontWeight="bold"
                                        color="purple.600"
                                        p={2}
                                    >
                                        Email
                                    </FormLabel>
                                    <Input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        borderColor="purple.200"
                                        focusBorderColor="purple.500"
                                        _placeholder={{ color: "gray.400" }}
                                        size="lg"
                                        borderRadius="xl"
                                        _hover={{ transform: "scale(1.02)", transition: "all 0.2s ease" }}
                                        _active={{ transform: "scale(0.98)" }}
                                    />
                                </FormControl>

                                {/* Password */}
                                <FormControl id="password" isRequired>
                                    <FormLabel
                                        fontWeight="bold"
                                        color="purple.600"
                                        p={2}
                                    >
                                        Password
                                    </FormLabel>
                                    <Input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        borderColor="purple.200"
                                        focusBorderColor="purple.500"
                                        _placeholder={{ color: "gray.400" }}
                                        size="lg"
                                        borderRadius="xl"
                                        _hover={{ transform: "scale(1.02)", transition: "all 0.2s ease" }}
                                        _active={{ transform: "scale(0.98)" }}
                                    />
                                </FormControl>

                                {/* Confirm Password */}
                                <FormControl id="confirmPassword" isRequired>
                                    <FormLabel
                                        fontWeight="bold"
                                        color="purple.600"
                                        p={2}
                                    >
                                        Confirm Password
                                    </FormLabel>
                                    <Input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm your password"
                                        borderColor="purple.200"
                                        focusBorderColor="purple.500"
                                        _placeholder={{ color: "gray.400" }}
                                        size="lg"
                                        borderRadius="xl"
                                        _hover={{ transform: "scale(1.02)", transition: "all 0.2s ease" }}
                                        _active={{ transform: "scale(0.98)" }}
                                    />
                                </FormControl>

                                {/* Sign Up Button */}
                                <Button
                                    type="submit"
                                    bgGradient="linear(to-r, #6a11cb 0%, #2575fc 100%)"
                                    color="white"
                                    size="lg"
                                    w="full"
                                    borderRadius="xl"
                                    _hover={{
                                        bgGradient: "linear(to-r, #6a11cb 30%, #2575fc 100%)",
                                        transform: "scale(1.02)"
                                    }}
                                    transition="all 0.2s ease"
                                >
                                    Sign Up
                                </Button>
                                <HStack>
                                    <Link href="/login">
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            w="full"
                                            borderRadius="xl"
                                            border="2px solid"
                                            borderColor="linear-gradient(to-r, #6a11cb 0%, #2575fc 100%)"
                                            color="#2575fc"
                                            _hover={{
                                                bg: "rgba(37, 117, 252, 0.1)",
                                                transform: "scale(1.02)"
                                            }}
                                            transition="all 0.2s ease"
                                        >
                                            Have an account?
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        w="full"
                                        borderRadius="xl"
                                        border="2px solid"
                                        borderColor="linear-gradient(to-r, #6a11cb 0%, #2575fc 100%)"
                                        color="#2575fc"
                                        _hover={{
                                            bg: "rgba(37, 117, 252, 0.1)",
                                            transform: "scale(1.02)"
                                        }}
                                        transition="all 0.2s ease"
                                        rightIcon={<FcGoogle />}
                                    >
                                        Log in with Google
                                    </Button>
                                </HStack>
                            </VStack>
                        </form>
                    </Box>
                </VStack>
            </Container>
        </Box>
    );
};

export default SignUp;
