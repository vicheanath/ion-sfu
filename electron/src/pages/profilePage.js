import React from "react";
import {
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Badge,
  List,
  ListItem,
  ListIcon,
  Flex,
  Text,
  Container,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useTokenStore } from "../modules/auth/useTokenStore";
import { getFormatDateAndTime } from "../utils/getDateFn";

const ProfilePage = () => {
  const { t } = useTranslation();
  const { userData } = useTokenStore.getState();
  return (
    <Container>
      <Text
        fontSize="2xl"
        textAlign="center"
        marginBottom="15px"
        fontWeight="500"
      >
        User Profile
      </Text>
      <TableContainer>
        <Table variant="striped">
          <Tbody>
            <Tr>
              <Td>{t("user.username")}</Td>
              <Td>{userData.username}</Td>
            </Tr>
            <Tr>
              <Td>{t("f_name")}</Td>
              <Td>{userData.first_name}</Td>
            </Tr>
            <Tr>
              <Td>{t("l_name")}</Td>
              <Td>{userData.last_name}</Td>
            </Tr>
            <Tr>
              <Td>{t("user.code")}</Td>
              <Td>{userData.code}</Td>
            </Tr>
            <Tr>
              <Td>{t("group")}</Td>
              <Td>
                {userData.groupname.map((group) => {
                  return (
                    <Badge key={group} colorScheme="blue" mr="2">
                      {group}
                    </Badge>
                  );
                })}
              </Td>
            </Tr>
            <Tr>
              <Td>Site</Td>
              <Td>{userData.site}</Td>
            </Tr>
            <Tr>
              <Td>{t("email")}</Td>
              <Td>{userData.email}</Td>
            </Tr>
            <Tr>
              <Td>{t("user.phoneNumber")}</Td>
              <Td>{userData.phone_number}</Td>
            </Tr>
            <Tr>
              <Td>{t("user.createAt")}</Td>
              <Td>{getFormatDateAndTime(userData.date_joined)}</Td>
            </Tr>
            <Tr>
              <Td>{t("setting.update")}</Td>
              <Td>{getFormatDateAndTime(userData.updated_at)}</Td>
            </Tr>
            <Tr>
              <Td>{t("user.lastLogin")}</Td>
              <Td>{getFormatDateAndTime(userData.last_login)}</Td>
            </Tr>
            <Tr>
              <Td>{t("user.message.info")}</Td>
              <Td>{userData.info}</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ProfilePage;
