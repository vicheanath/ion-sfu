import React from "react";
import {
  IconButton,
  Avatar,
  Box,
  Flex,
  HStack,
  VStack,
  useColorModeValue,
  Text,
  Menu,
  MenuButton,
  useColorMode,
  Button,
  Tooltip,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Select,
} from "@chakra-ui/react";

import { FiMenu, FiSun, FiMoon, FiArrowLeft, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

const MobileNav = ({ onOpen, ...rest }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const { isOpen, onOpen: alertOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const languages = [
    { value: "en", flag: "🇬🇧", label: "English" }, // English
    { value: "km", flag: "🇰🇭", label: "ខ្មែរ" }, // Khmer
  ].sort((a, b) => a.label.localeCompare(b.label));

  const { t } = useTranslation();
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />
      <Tooltip hasArrow label="Go Back">
        <IconButton
          display={{ base: "flex" }}
          variant="outline"
          onClick={() => {
            navigate(-1);
          }}
          icon={<FiArrowLeft />}
        />
      </Tooltip>

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize={{ base: "17px" }}
        fontWeight="bold"
      >
        Live Stream
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        <Select
          onChange={(e) => {
            i18next.changeLanguage(e.target.value);
          }}
          value={i18next.language}
          variant="filled"
          size="md"
          maxW="150px"
          colorScheme="teal"
          bg={useColorModeValue("white", "gray.900")}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          _hover={{
            bg: useColorModeValue("gray.100", "gray.700"),
          }}
          _focus={{
            bg: useColorModeValue("white", "gray.900"),
            borderColor: useColorModeValue("gray.200", "gray.700"),
          }}
        >
          {languages.map((language) => (
            <option key={language.value} value={language.value}>
              {language.flag} {language.label}
            </option>
          ))}
        </Select>

        <Tooltip
          hasArrow
          label={`Click here change color to ${
            colorMode == "light" ? "Dark" : "Light"
          }`}
        >
          <IconButton
            size="lg"
            variant="ghost"
            aria-label="open menu"
            onClick={toggleColorMode}
            icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
          />
        </Tooltip>
        <Tooltip hasArrow label="Logout">
          <IconButton
            onClick={() => alertOpen()}
            size="lg"
            variant="ghost"
            aria-label="open menu"
            icon={<FiLogOut />}
          />
        </Tooltip>
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <Avatar size={"sm"} name={"hello"} />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">Vichea</Text>
                </VStack>
              </HStack>
            </MenuButton>
            <AlertDialog
              motionPreset="slideInBottom"
              leastDestructiveRef={cancelRef}
              onClose={onClose}
              isOpen={isOpen}
              isCentered
            >
              <AlertDialogOverlay />
              <AlertDialogContent>
                <AlertDialogHeader>
                  {t("navbar.logout.message")}
                </AlertDialogHeader>
                <AlertDialogCloseButton />
                <AlertDialogBody>
                  {t("navbar.logout.messagedes")}
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose}>
                    {t("navbar.logout.cancel")}
                  </Button>
                  <Button
                    onClick={() => {
                      // logOut();
                      close();
                      navigate("/login");
                    }}
                    colorScheme="red"
                    ml={3}
                  >
                    {t("navbar.logout.logout")}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

export default MobileNav;
