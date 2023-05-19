import React, { useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Text,
  useColorModeValue,
  FormHelperText,
  useToast,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { apiBaseUrl } from "../libs/constants";
import {
  accessTokenKey,
  refreshTokenKey,
  userData,
} from "../modules/auth/useTokenStore";
import { FiKey, FiUser } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
const LoginPage = () => {
  const navigate = useNavigate();
  const languages = [
    { value: "en", flag: "🇬🇧", label: "English" }, // English
    { value: "km", flag: "🇰🇭", label: "ខ្មែរ" }, // Khmer
  ].sort((a, b) => a.label.localeCompare(b.label));
  const { t } = useTranslation();
  const [remUser, setRemuser] = useState("");
  const toast = useToast();
  const accessToken = localStorage.getItem("token") || "";
  useEffect(() => {
    const remUser = localStorage.getItem("remUser");
    if (remUser) {
      setRemuser(remUser);
    }
  }, []);

  return (
    <>
      {!!accessToken ? (
        <Navigate to="/" replace />
      ) : (
        <Flex align={"center"} justify={"center"}>
          <Stack mx={"auto"} maxW={"lg"} mt={12}>
            <Stack align={"center"}>
              <Text fontSize="3xl" as="b">
                {t("login_title")}
              </Text>
            </Stack>
            <Box
              rounded={"lg"}
              bg={useColorModeValue("white", "gray.700")}
              boxShadow={"lg"}
              p={8}
            >
              <Formik
                initialValues={{
                  email: "" || remUser,
                  password: "",
                  rememberMe: false,
                }}
                validationSchema={Yup.object({
                  email: Yup.string()
                    .email("Invalid email address")
                    .required("email" + " " + t("validation.required")),
                  password: Yup.string().required(
                    "password" + " " + t("validation.required")
                  ),
                  rememberMe: Yup.boolean(),
                })}
                onSubmit={(values, { setSubmitting }) => {
                  fetch(`${apiBaseUrl}account/login/`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      email: values.email,
                      password: values.password,
                    }),
                  }).then((res) => {
                    setSubmitting(false);
                    if (res.status === 200) {
                      res.json().then((data) => {
                        console.log(data);
                        localStorage.setItem(accessTokenKey, data.access);
                        localStorage.setItem(refreshTokenKey, data.refresh);
                        localStorage.setItem(
                          userData,
                          JSON.stringify(data.user) || {}
                        );
                        if (values.rememberMe) {
                          localStorage.setItem("name", values.username);
                        }
                        window.location.href = "/";
                      });
                    } else {
                      res.json().then(() => {
                        toast({
                          title: "Authentication Failed",
                          description: "Invalid username or password",
                          status: "error",
                          duration: 2000,
                          isClosable: true,
                        });
                      });
                    }
                  });
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                  /* and other goodies */
                }) => (
                  <Form onSubmit={handleSubmit}>
                    <Stack spacing={4}>
                      <FormControl id="email">
                        <FormLabel>{t("email")}</FormLabel>
                        <InputGroup>
                          <InputLeftAddon children={<FiUser />} />
                          <Input
                            type="email"
                            name="email"
                            onChange={handleChange}
                            value={values.email}
                            placeholder={`${t("user.enter")} ${t("email")}`}
                            onBlur={handleBlur}
                            error={errors.email && touched.email}
                            isInvalid={errors.email && touched.email}
                          />
                        </InputGroup>

                        <FormHelperText>
                          {errors.email && touched.email ? errors.email : null}
                        </FormHelperText>
                      </FormControl>
                      <FormControl id="password">
                        <FormLabel>{t("user.password.label")}</FormLabel>
                        <InputGroup>
                          <InputLeftAddon children={<FiKey />} />
                          <Input
                            type="password"
                            name="password"
                            onChange={handleChange}
                            value={values.password}
                            placeholder={`${t("user.enter")} ${t(
                              "user.password.label"
                            )}`}
                            onBlur={handleBlur}
                            error={errors.password && touched.password}
                            isInvalid={errors.password && touched.password}
                          />
                        </InputGroup>
                        <FormHelperText>
                          {errors.password && touched.password
                            ? errors.password
                            : null}
                        </FormHelperText>
                      </FormControl>
                      <Stack spacing={10}>
                        <Stack
                          direction={{ base: "column", sm: "row" }}
                          align={"start"}
                          justify={"space-between"}
                        >
                          <Checkbox>{t("user.rememberMe")}</Checkbox>
                          <Link color={"blue.500"}>
                            {t("user.forgot") + " " + t("user.action.password")}
                            ?
                          </Link>
                        </Stack>
                        <Button
                          bg={"blue.500"}
                          color={"white"}
                          type="submit"
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          isLoading={isSubmitting}
                          _hover={{
                            bg: "blue.400",
                          }}
                        >
                          {t("user.signin")}
                        </Button>
                      </Stack>
                    </Stack>
                  </Form>
                )}
              </Formik>
              <Flex gap={5} mt={5} justifyContent="center">
                {languages.map((language) => (
                  <Button
                    key={language.value}
                    onClick={(e) => {
                      i18next.changeLanguage(language.value);
                    }}
                  >
                    {language.flag} {language.label}
                  </Button>
                ))}
              </Flex>
              <Flex
                align={"center"}
                justify={"center"}
                flexDirection={"column"}
                alignItems={"center"}
                mt={4}
              ></Flex>
            </Box>
          </Stack>
        </Flex>
      )}
    </>
  );
};

export default LoginPage;
