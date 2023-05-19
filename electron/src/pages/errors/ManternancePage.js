import React, { useEffect, useState } from "react";
import { Box, Heading, Text } from "@chakra-ui/react";
import { GrHostMaintenance } from "react-icons/gr";
const ManternancePage = () => {
  // time coundown until the website is back
  const timeUntil = new Date("2022-11-01 00:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState({});
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = timeUntil - now;
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
      if (distance < 0) {
        setIsTimeUp(true);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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
        <GrHostMaintenance size="100px" color="#333" />
        <Heading as="h1" size="xl" color="blue.400" textAlign="center" mt={4}>
          Manternance
        </Heading>
        <Text fontSize="xl" fontWeight="bold" mt={4}>
          The website is under maintenance.
        </Text>
        <Text color="blue.400" fontSize="xl" fontWeight="medium" mt={4}>
          {isTimeUp
            ? "The website is back"
            : `${timeLeft.days} days ${timeLeft.hours} hours ${timeLeft.minutes} minutes ${timeLeft.seconds} seconds`}
        </Text>
      </Box>
    </Box>
  );
};

export default ManternancePage;
