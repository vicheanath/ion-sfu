import { Box, Heading, Text } from "@chakra-ui/react";
import { TbError404Off } from "react-icons/tb";
import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        width="100%"
        maxWidth="500px"
        backdropBlur={5}
        padding="20px"
        borderRadius="10px"
        boxShadow="0 0 10px 0 rgba(0,0,0,0.2)"
      >
        <TbError404Off size="100px" color="#333" />
        <Heading as="h1" size="xl" color="blue.400" textAlign="center" mt={4}>
          404 - Page not found
        </Heading>
        <Text fontSize="xl" fontWeight="bold" mt={4}>
          The page you are looking for might have been removed had its name
          changed or is temporarily unavailable.
        </Text>
        <Text
          color="blue.400"
          fontSize="xl"
          fontWeight="medium"
          mt={4}
          cursor="pointer"
          textDecoration={"underline"}
          onClick={() => navigate("/")}
        >
          Go to home page
        </Text>
      </Box>
    </Box>
  );
};
export default NotFoundPage;
