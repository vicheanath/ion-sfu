// 1. import `extendTheme` function
import {
  extendTheme,
  withDefaultColorScheme,
  withDefaultSize,
} from "@chakra-ui/react";

const config = {
  initialColorMode: "light",
  useSystemColorMode: true,
  fonts: {
    heading: `"Inter",Battambang`,
    body: `"Inter",Battambang`,
  },
};
const theme = extendTheme(
  { config },
  withDefaultSize({
    size: "sm",
    components: [
      "Button",
      "Input",
      "Select",
      "Table",
      "TableCaption",
      "Td",
      "Th",
      "Tr",
      "Tbody",
      "Tfoot",
      "Thead",
      "TableContainer",
      "Flex",
      "Box",
      "Center",
      "Skeleton",
      "Tooltip",
      "Paginator",
      "Container",
      "Previous",
      "Next",
      "PageGroup",
    ],
  })
);

export default theme;
