import React, { useState } from "react";
import {
  CloseButton,
  Flex,
  useColorModeValue,
  Text,
  Box,
} from "@chakra-ui/react";

import NavItem from "./NavItem";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import * as Icons from "react-icons/fi";

const SidebarContent = ({ onClose, ...rest }) => {
  const { t } = useTranslation();

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="Inter" fontWeight="bold">
          Live Stream
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
    </Box>
  );
};

export default SidebarContent;
