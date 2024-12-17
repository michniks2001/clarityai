"use client"

import React, { useState, useEffect } from 'react';
import {
    Box,
    Flex,
    HStack,
    Link,
    IconButton,
    Button,
    useDisclosure,
    useColorModeValue,
    Stack,
    Heading,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { app } from '../firebase'; // Adjust the import path as needed
import { useRouter } from 'next/navigation';

const Links = ['Home', 'Dashboard', 'Pricing', 'About'];

const NavLink = ({ children }) => (
    <Link
        px={2}
        py={1}
        rounded={'md'}
        _hover={{
            textDecoration: 'none',
            bg: useColorModeValue('gray.200', 'gray.700'),
        }}
        href={`/${children.toLowerCase()}`}>
        {children}
    </Link>
);

const Navbar = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [user, setUser] = useState(null);
    const auth = getAuth(app);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        // Cleanup subscription
        return () => unsubscribe();
    }, [auth]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push('/login');
        } catch (error) {
            console.error('Logout error', error);
        }
    };

    return (
        <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
            <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                <IconButton
                    size={'md'}
                    icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                    aria-label={'Open Menu'}
                    display={{ md: 'none' }}
                    onClick={isOpen ? onClose : onOpen}
                />
                <HStack spacing={8} alignItems={'center'}>
                    <Box>
                        <Heading
                            as="h1"
                            size="lg"
                            bgGradient="linear(to-r, #6a11cb 0%, #2575fc 100%)"
                            bgClip="text"
                            fontWeight="extrabold"
                            fontFamily="'Poppins', sans-serif"
                        >
                            ClarityAI
                        </Heading>
                    </Box>
                    <HStack
                        as={'nav'}
                        spacing={4}
                        display={{ base: 'none', md: 'flex' }}>
                        {Links.map((link) => (
                            <NavLink key={link}>{link}</NavLink>
                        ))}
                    </HStack>
                </HStack>
                <Flex alignItems={'center'}>
                    {user ? (
                        <Button
                            onClick={handleLogout}
                            bgGradient="linear(to-r, #6a11cb 0%, #2575fc 100%)"
                            color="white"
                            size="sm"
                            borderRadius="xl"
                            _hover={{
                                bgGradient: "linear(to-r, #6a11cb 30%, #2575fc 100%)",
                                transform: "scale(1.02)"
                            }}
                            transition="all 0.2s ease"
                        >
                            Log Out
                        </Button>
                    ) : (
                        <Button
                            as="a"
                            href="/login"
                            bgGradient="linear(to-r, #6a11cb 0%, #2575fc 100%)"
                            color="white"
                            size="sm"
                            borderRadius="xl"
                            _hover={{
                                bgGradient: "linear(to-r, #6a11cb 30%, #2575fc 100%)",
                                transform: "scale(1.02)"
                            }}
                            transition="all 0.2s ease"
                        >
                            Log In
                        </Button>
                    )}
                </Flex>
            </Flex>

            {isOpen ? (
                <Box pb={4} display={{ md: 'none' }}>
                    <Stack as={'nav'} spacing={4}>
                        {Links.map((link) => (
                            <NavLink key={link}>{link}</NavLink>
                        ))}
                    </Stack>
                </Box>
            ) : null}
        </Box>
    );
};

export { Navbar };
