import React, { useEffect } from "react";
import { Box, Drawer, DrawerContent, useDisclosure } from "@chakra-ui/react";
import SidebarContent from "./SidebarContent";
import MobileNav from "./MobileNav";
import { useOutlet, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "react-query";
// import { useTokenStore } from "../../modules/auth/useTokenStore";
import { useTranslation } from "react-i18next";
// import { useUserStore } from "../../modules/users/useUserStore";

const AdminLayout = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const outlet = useOutlet();
  // const { userData } = useTokenStore.getState();

  useEffect(() => {}, []);
  return (
    <Box minH="100vh">
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {outlet}
      </Box>
    </Box>
  );
};

export default AdminLayout;
