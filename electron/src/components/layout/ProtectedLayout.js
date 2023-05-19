import React, { useEffect } from "react";
import { useOutlet, useNavigate, Navigate } from "react-router-dom";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, AddIcon } from "@chakra-ui/icons";

export default function ProtectedLayout({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const outlet = useOutlet();
  const navigate = useNavigate();

  useEffect(() => {}, []);

  const accessToken = "asdfasdf";

  return (
    <>
      {!!accessToken ? (
        <>
          <Box>{outlet}</Box>
        </>
      ) : (
        <Navigate to="/login" replace />
      )}
    </>
  );
}
