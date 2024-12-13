"use client"

import React, { useState } from 'react';
import {
  Box,
  Button,
  Text,
  Spinner,
  Heading,
  Container,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  chakra,
} from '@chakra-ui/react';
import { motion } from "framer-motion"
import OpenAI from 'openai';
import ReactMarkdown from "react-markdown";

const Home = () => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    taskDescription: '',
    category: '',
    deadline: '',
    importance: '',
    timeEstimate: '',
    additionalNotes: ''
  });

  const { isOpen, onOpen, onClose } = useDisclosure()

  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const today = new Date();



  const getResponse = async () => {
    setLoading(true);

    // Format all tasks into a string for the prompt
    const formattedTasks = tasks
      .map(
        (task, index) => `
Task ${index + 1}:
- Task Description: ${task.taskDescription}
- Category: ${task.category}
- Deadline: ${task.deadline}
- Importance: ${task.importance}
- Time Estimate: ${task.timeEstimate} hours
- Additional Notes: ${task.additionalNotes || "None"}
`
      )
      .join("\n");

    const fullPrompt = `
You are a productivity assistant designed to help users manage their tasks efficiently. The user will provide you with a list of tasks and additional details.

Today's date is ${today.toISOString()}.

Here are the tasks provided by the user:
${formattedTasks}

Your goal is to create a structured, step-by-step plan for the user to follow. Follow these guidelines:

1. Grouping and Prioritization:
   - Organize tasks by category.
   - Within each category, list tasks in order of urgency and importance, considering deadlines and criticality.

2. Scheduling:
   - Suggest when to start and finish each task based on the deadline and time estimate.
   - Break up longer tasks into smaller, manageable segments, ensuring sensible breaks to avoid burnout.

3. Output Format:
   - Start with a motivational opening statement tailored to the user's likely stressed state.
   - Present the tasks as a structured list. Use the following format for each task:
     Task: [Task Description]
     Category: [Category Name]
     Priority: [Critical/Important/Optional]
     Deadline: [Deadline]
     Estimated Time: [Time Estimate]
     Notes: [Additional Notes, if provided]
     Action Plan: [Step-by-step breakdown, if needed]

4. Encouragement and Checkpoints:
   - Add motivational notes between tasks or categories, such as:
     "You're doing great! Remember to take breaks and celebrate small wins."
     "Stay focused—you got this!"

5. End with Support:
   - Conclude with a friendly reminder: "This is your plan—adjust it as needed to fit your schedule. Take it one step at a time, and trust that you're making progress."

Always ensure the output remains clear, structured, and supportive, no matter how varied the input from the user is.
`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: fullPrompt
          }
        ],
        temperature: 1,
        max_tokens: 2048,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      });
      setResponse(completion.choices[0].message.content);
      onOpen(); // Open the modal after getting the response
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setResponse("Error fetching AI response");
      onOpen();
    }
    setLoading(false);
  };

  const saveResponseAsFile = () => {
    const blob = new Blob([response], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a');
    link.download = `ClarityAI_Plan_${new Date().toISOString()}.txt`;
    link.href = url
    link.click()
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTasks([...tasks, formData]);
    setFormData({
      taskDescription: '',
      category: '',
      deadline: '',
      importance: '',
      timeEstimate: '',
      additionalNotes: ''
    });
  };

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

          {/* Task Input Form */}
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
                {/* Task Description */}
                <FormControl id="taskDescription" isRequired>
                  <FormLabel
                    fontWeight="bold"
                    color="purple.600"
                  >
                    Task Description
                  </FormLabel>
                  <Input
                    type="text"
                    name="taskDescription"
                    value={formData.taskDescription}
                    onChange={handleChange}
                    placeholder="E.g., Read chapters 5-6 for tomorrow's class"
                    borderColor="purple.200"
                    focusBorderColor="purple.500"
                    _placeholder={{ color: "gray.400" }}
                    size="lg"
                    borderRadius="xl"
                    _hover={{ transform: "scale(1.02)", transition: "all 0.2s ease" }}
                    _active={{ trnasform: "scale(0.98)" }}
                  />
                </FormControl>

                {/* Category */}
                <FormControl id="category" isRequired>
                  <FormLabel
                    fontWeight="bold"
                    color="purple.600"
                  >
                    Category
                  </FormLabel>
                  <Input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="E.g., School, Work"
                    borderColor="purple.200"
                    focusBorderColor="purple.500"
                    _placeholder={{ color: "gray.400" }}
                    size="lg"
                    borderRadius="xl"
                    _hover={{ transform: "scale(1.02)", transition: "all 0.2s ease" }}
                    _active={{ trnasform: "scale(0.98)" }}
                  />
                </FormControl>

                {/* Deadline */}
                <FormControl id="deadline" isRequired>
                  <FormLabel
                    fontWeight="bold"
                    color="purple.600"
                  >
                    Deadline
                  </FormLabel>
                  <Input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    borderColor="purple.200"
                    focusBorderColor="purple.500"
                    size="lg"
                    borderRadius="xl"
                    _hover={{ transform: "scale(1.02)", transition: "all 0.2s ease" }}
                    _active={{ trnasform: "scale(0.98)" }}
                  />
                </FormControl>

                {/* Importance */}
                <FormControl id="importance" isRequired>
                  <FormLabel
                    fontWeight="bold"
                    color="purple.600"
                  >
                    Importance
                  </FormLabel>
                  <Select
                    name="importance"
                    value={formData.importance}
                    onChange={handleChange}
                    placeholder="Select priority level"
                    borderColor="purple.200"
                    focusBorderColor="purple.500"
                    size="lg"
                    borderRadius="xl"
                    _hover={{ transform: "scale(1.02)", transition: "all 0.2s ease" }}
                    _active={{ trnasform: "scale(0.98)" }}
                  >
                    <option value="critical">Critical</option>
                    <option value="important">Important</option>
                    <option value="optional">Optional</option>
                  </Select>
                </FormControl>

                {/* Time Estimate */}
                <FormControl id="timeEstimate" isRequired>
                  <FormLabel
                    fontWeight="bold"
                    color="purple.600"
                  >
                    Time Estimate (hours)
                  </FormLabel>
                  <Input
                    type="number"
                    name="timeEstimate"
                    value={formData.timeEstimate}
                    onChange={handleChange}
                    placeholder="E.g., 2"
                    borderColor="purple.200"
                    focusBorderColor="purple.500"
                    _placeholder={{ color: "gray.400" }}
                    size="lg"
                    borderRadius="xl"
                    _hover={{ transform: "scale(1.02)", transition: "all 0.2s ease" }}
                    _active={{ trnasform: "scale(0.98)" }}
                  />
                </FormControl>

                {/* Additional Notes */}
                <FormControl id="additionalNotes">
                  <FormLabel
                    fontWeight="bold"
                    color="purple.600"
                  >
                    Additional Notes
                  </FormLabel>
                  <Textarea
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleChange}
                    placeholder="E.g., Research online for ideas, group discussion notes"
                    borderColor="purple.200"
                    focusBorderColor="purple.500"
                    _placeholder={{ color: "gray.400" }}
                    size="lg"
                    borderRadius="xl"
                    rows={4}
                    _hover={{ transform: "scale(1.02)", transition: "all 0.2s ease" }}
                    _active={{ trnasform: "scale(0.98)" }}
                  />
                </FormControl>

                {/* Add Task Button */}
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
                  Add Task
                </Button>
              </VStack>
            </form>
          </Box>

          {/* Get AI Response Button */}
          <Button
            onClick={getResponse}
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
            Generate Task Breakdown
          </Button>

          {tasks.length > 0 ? (
            <Box>
              <Heading
                as="h2"
                size="xl"
                textAlign="center"
                mb={6}
                color="purple.600"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Your Tasks
              </Heading>
              <VStack spacing={4} align="stretch">
                {tasks.map((task, index) => (
                  <Box
                    key={index}
                    bg="white"
                    borderRadius="xl"
                    shadow="md"
                    p={6}
                    position="relative"
                    borderWidth="1px"
                    borderColor="purple.100"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.1
                    }}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                    }}
                  >
                    <Button
                      position="absolute"
                      top={2}
                      right={2}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => {
                        const newTasks = tasks.filter((_, i) => i !== index);
                        setTasks(newTasks);
                      }}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      ✕
                    </Button>
                    <VStack align="start" spacing={2}>
                      <Text>
                        <strong>Task:</strong> {task.taskDescription}
                      </Text>
                      <Text>
                        <strong>Category:</strong> {task.category}
                      </Text>
                      <Text>
                        <strong>Deadline:</strong> {task.deadline}
                      </Text>
                      <Text>
                        <strong>Importance:</strong> {task.importance}
                      </Text>
                      <Text>
                        <strong>Time Estimate:</strong> {task.timeEstimate} hours
                      </Text>
                      {task.additionalNotes && (
                        <Text>
                          <strong>Notes:</strong> {task.additionalNotes}
                        </Text>
                      )}
                    </VStack>
                  </Box>
                ))}
              </VStack>
            </Box>
          ) : (
            <VStack
              spacing={4}
              p={10}
              bg="purple.50"
              borderRadius="xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: {
                  duration: 0.5
                }
              }}
            >
              <Text color="purple.600" fontSize="lg" textAlign="center">
                No tasks yet! Start by adding your first task above.
              </Text>
              <Box
                as="svg"
                xmlns="http://www.w3.org/2000/svg"
                width="100"
                height="100"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                color="purple.300"
                initial={{ rotate: 0 }}
                animate={{
                  rotate: [0, 10, -10, 0],
                  transition: {
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }
                }}
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="3" x2="9" y2="21"></line>
                <line x1="15" y1="3" x2="15" y2="21"></line>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="3" y1="15" x2="21" y2="15"></line>
              </Box>
            </VStack>
          )}

          {/* Loading Spinner */}
          {loading ? (
            <Box
              position="fixed"
              top="0"
              left="0"
              width="100%"
              height="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              zIndex="9999"
              bg="rgba(255, 255, 255, 0.8)"
            >
              <VStack
                bg="white"
                p={10}
                borderRadius="2xl"
                boxShadow="2xl"
                spacing={6}
                align="center"
                border="2px"
                borderColor="purple.100"
              >
                <Spinner
                  size="xl"
                  color="purple.500"
                  thickness="4px"
                  speed="0.65s"
                />
                <Text
                  color="purple.600"
                  fontWeight="bold"
                  fontSize="lg"
                >
                  Generating your productivity plan...
                </Text>
              </VStack>
            </Box>
          ) : null}
          <Modal isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalOverlay
              bg="blackAlpha.300"
              backdropFilter="blur(10px)"
            />
            {tasks.length !== 0 ? (
              <ModalContent
                borderRadius="2xl"
                bg="white"
                shadow="2xl"
              >
                <ModalHeader
                  bgGradient="linear(to-r, #6a11cb 0%, #2575fc 100%)"
                  bgClip="text"
                  fontWeight="bold"
                  fontSize="2xl"
                >
                  Your Productivity Plan
                </ModalHeader>
                <ModalCloseButton
                  color="purple.500"
                  _hover={{
                    color: "purple.700",
                    transform: "scale(1.2)"
                  }}
                />
                <ModalBody>
                  <Box
                    maxHeight="60vh"
                    overflowY="auto"
                    p={4}
                  >
                    <ReactMarkdown
                      components={{
                        h1: (props) => <Heading as="h1" size="lg" mb={4} color="purple.600" {...props} />,
                        h2: (props) => <Heading as="h2" size="md" mb={3} color="purple.500" {...props} />,
                        h3: (props) => <Heading as="h3" size="sm" mb={2} color="purple.400" {...props} />,
                        p: (props) => <Text mb={3} {...props} />,
                        ul: (props) => <Box as="ul" pl={6} mb={3} {...props} />,
                        li: (props) => <Box as="li" mb={1} {...props} />,
                        strong: (props) => <Text as="strong" fontWeight="bold" color="purple.600" {...props} />,
                      }}
                    >
                      {response}
                    </ReactMarkdown>
                  </Box>
                </ModalBody>
                <ModalFooter>
                  <HStack spacing={4}>
                    <Button
                      onClick={saveResponseAsFile}
                      colorScheme="purple"
                      variant="outline"
                      borderRadius="xl"
                    >
                      Save as Text File
                    </Button>
                    <Button
                      onClick={onClose}
                      bgGradient="linear(to-r, #6a11cb 0%, #2575fc 100%)"
                      color="white"
                      borderRadius="xl"
                      _hover={{
                        bgGradient: "linear(to-r, #6a11cb 30%, #2575fc 100%)",
                      }}
                    >
                      Close
                    </Button>
                  </HStack>
                </ModalFooter>
              </ModalContent>
            ) : (
              <ModalContent>
                <Heading>Please add tasks!</Heading>
              </ModalContent>
            )}
          </Modal>
        </VStack>
      </Container>
    </Box >
  );


};

export default Home;