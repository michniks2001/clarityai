"use client"

import React from 'react';
import {
  Box,
  Button,
  Text,
  Heading,
  Container,
  VStack,
  HStack,
  Image,
  Stack,
  useBreakpointValue,
} from '@chakra-ui/react';
import { motion } from "framer-motion";

const LandingPage = () => {
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
              ClarityAI
            </Heading>
            <Text
              fontSize="xl"
              color="gray.600"
              mt={2}
              fontWeight="medium"
            >
              Transform Chaos into Clarity
            </Text>
          </Box>

          {/* Hero Section */}
          <Stack
            direction={{ base: 'column', md: 'row' }}
            spacing={10}
            align="center"
            justify="center"
            textAlign={{ base: 'center', md: 'left' }}
          >
            <VStack spacing={6} align="start">
              <Heading
                as="h2"
                size="2xl"
                bgGradient="linear(to-r, #6a11cb 0%, #2575fc 100%)"
                bgClip="text"
                fontWeight="extrabold"
                fontFamily="'Poppins', sans-serif"
              >
                Your Personal Productivity Assistant
              </Heading>
              <Text fontSize="lg" color="gray.600">
                ClarityAI helps you manage your tasks efficiently, providing a structured, step-by-step plan to achieve your goals.
              </Text>
              <Button
                as="a"
                href="/login"
                bgGradient="linear(to-r, #6a11cb 0%, #2575fc 100%)"
                color="white"
                size="lg"
                borderRadius="xl"
                _hover={{
                  bgGradient: "linear(to-r, #6a11cb 30%, #2575fc 100%)",
                  transform: "scale(1.02)"
                }}
                transition="all 0.2s ease"
              >
                Get Started
              </Button>
            </VStack>
            <Box
              as={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src="/productivity.jpg"
                alt="Productivity Illustration"
                borderRadius="2xl"
                shadow="2xl"
              />
            </Box>
          </Stack>

          {/* Features Section */}
          <VStack spacing={8} align="stretch">
            <Heading
              as="h3"
              size="xl"
              textAlign="center"
              bgGradient="linear(to-r, #6a11cb 0%, #2575fc 100%)"
              bgClip="text"
              fontWeight="extrabold"
              fontFamily="'Poppins', sans-serif"
            >
              Features
            </Heading>
            <HStack spacing={10} align="start" justify="center" wrap="wrap">
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
                <Heading as="h4" size="md" mb={4} color="purple.600">
                  Task Management
                </Heading>
                <Text color="gray.600">
                  Organize and prioritize your tasks efficiently with ClarityAI's intuitive task management system.
                </Text>
              </Box>
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
                <Heading as="h4" size="md" mb={4} color="purple.600">
                  AI-Powered Insights
                </Heading>
                <Text color="gray.600">
                  Get personalized insights and recommendations to boost your productivity and achieve your goals.
                </Text>
              </Box>
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
                <Heading as="h4" size="md" mb={4} color="purple.600">
                  Structured Plans
                </Heading>
                <Text color="gray.600">
                  Receive structured, step-by-step plans to tackle your tasks and projects with ease.
                </Text>
              </Box>
            </HStack>
          </VStack>

          {/* Call to Action */}
          <Box textAlign="center" mt={10}>
            <Button
              as="a"
              href="/sign-up"
              bgGradient="linear(to-r, #6a11cb 0%, #2575fc 100%)"
              color="white"
              size="lg"
              borderRadius="xl"
              _hover={{
                bgGradient: "linear(to-r, #6a11cb 30%, #2575fc 100%)",
                transform: "scale(1.02)"
              }}
              transition="all 0.2s ease"
            >
              Start Your Journey with ClarityAI
            </Button>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default LandingPage;