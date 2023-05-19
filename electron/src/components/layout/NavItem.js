import React from "react";
import {
  Box,
  Flex,
  Icon,
  Link,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import * as Icons from "react-icons/fi";

const IconCustom = ({ name }) => {
  const Icond = Icons[name];
  if (!Icond) {
    const A = Icons["FiSlash"];
    return <A />;
  }
  return <Icond />;
};

const NavItem = ({ icon, url, children, ...rest }) => {
  return (
    <Link
      p="4"
      fontWeight="400"
      role="group"
      cursor="pointer"
      rounded="md"
      display="flex"
      {...rest}
      as={(props) => (
        <NavLink
          to={url}
          style={({ isActive }) => {
            return {
              fontWeight: isActive ? "bold" : "bold",
              color: isActive
                ? useColorModeValue("#3182ce", "#3182ce")
                : useColorModeValue("#333", "#fff"),
              backgroundColor: isActive
                ? useColorModeValue("#368be636", "#368be636")
                : useColorModeValue("white", "gray.700"),
            };
          }}
          {...props}
        />
      )}
    >
      {icon && (
        <Icon
          style={{
            width: "1.5rem",
            height: "1.5rem",
            marginRight: "1rem",
          }}
          name={icon}
          as={IconCustom}
        />
      )}
      {children}
    </Link>
  );
};
export default NavItem;
