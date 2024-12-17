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
    HStack,
    useToast,
} from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { app } from '../firebase';
import { useRouter } from "next/navigation"

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const toast = useToast();

    const router = useRouter()

    const provider = new GoogleAuthProvider()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const auth = getAuth(app)
            const userCredential = await signInWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            )

            const user = userCredential.user

            toast({
                title: "Signed in!",
                description: "You have successfully signed in!",
                status: "success",
                duration: 2000,
                isClosable: true
            })

            setTimeout(() => {
                router.push('/home')
            }, 2000)

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
                            Log In
                        </Heading>
                        <Text
                            fontSize="xl"
                            color="gray.600"
                            mt={2}
                            fontWeight="medium"
                        >
                            Welcome back to ClarityAI.
                        </Text>
                    </Box>

                    {/* Login Form */}
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

                                {/* Log In Button */}
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
                                    Log In
                                </Button>

                                {/* Additional Options */}
                                <HStack spacing={4} justify="center">
                                    <Link href="/sign-up">
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
                                            Don't have an account?
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
                                        onClick={handleGoogleLogin}
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

export default Login;
