import React from "react";
import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormHelperText,
  useBoolean,
  InputGroup,
  useToast,
  InputRightAddon,
  Text,
  Container,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useTokenStore } from "../modules/auth/useTokenStore";
import { useMutation } from "react-query";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { api } from "../libs/api";
import { useTranslation } from "react-i18next";

export default function ChangePassWordPage() {
  const { userData } = useTokenStore.getState();
  const [password, setPassword] = useBoolean();
  const toast = useToast();
  const { t } = useTranslation();
  const userSetPassword = useMutation(
    (data) => {
      return api.post("account/user/change_password/", data);
    },
    {
      onSuccess: ({ data }) => {
        toast({
          title: "Success",
          description: `User ${userData.username} has been set password successfully`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      },
      onError: (data) => {
        toast({
          title: "Error",
          description: data.response.data.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      },
    }
  );
  return (
    <Formik
      initialValues={{
        old_password: "",
        new_password: "",
        confirm_password: "",
      }}
      validationSchema={Yup.object({
        old_password: Yup.string().required(
          t("user.password.currentPassword") + " " + t("validation.required")
        ),
        new_password: Yup.string().required(
          t("user.password.newPassword") + " " + t("validation.required")
        ),
        confirm_password: Yup.string()
          .required(
            t("user.password.confirmPassword") + " " + t("validation.required")
          )
          .oneOf(
            [Yup.ref("new_password"), null],
            t("validation.passwordMatch")
          ),
      })}
      onSubmit={(values, { setSubmitting }) => {
        userSetPassword.mutate({ ...values });
        setSubmitting(false);
      }}
    >
      {({
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <Form onSubmit={handleSubmit}>
          <Text
            fontSize="2xl"
            textAlign="center"
            marginBottom="15px"
            fontWeight="500"
          >
            {t("user.password.title")}
          </Text>
          <Container>
            <FormControl id="old_password">
              <FormLabel>{t("user.password.currentPassword")}</FormLabel>
              <InputGroup>
                <Input
                  name="old_password"
                  type={password ? "text" : "password"}
                  placeholder={t("user.password.label")}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.old_password}
                  isInvalid={errors.old_password && touched.old_password}
                />
                <InputRightAddon
                  cursor="pointer"
                  onClick={setPassword.toggle}
                  children={password ? <FiEyeOff /> : <FiEye />}
                />
              </InputGroup>
              <FormHelperText color="red">
                {errors.old_password && touched.old_password
                  ? errors.old_password
                  : null}
              </FormHelperText>
            </FormControl>
            <FormControl id="new_password">
              <FormLabel>{t("user.password.newPassword")}</FormLabel>
              <InputGroup>
                <Input
                  name="new_password"
                  type={password ? "text" : "password"}
                  placeholder={t("user.password.label")}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.new_password}
                  isInvalid={errors.new_password && touched.new_password}
                />
                <InputRightAddon
                  cursor="pointer"
                  onClick={setPassword.toggle}
                  children={password ? <FiEyeOff /> : <FiEye />}
                />
              </InputGroup>
              <FormHelperText color="red">
                {errors.new_password && touched.new_password
                  ? errors.new_password
                  : null}
              </FormHelperText>
            </FormControl>
            <FormControl id="confirm_password" mb={4}>
              <FormLabel>{t("user.password.confirmPassword")}</FormLabel>
              <InputGroup>
                <Input
                  name="confirm_password"
                  type={password ? "text" : "password"}
                  placeholder={t("user.password.label")}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.confirm_password}
                  isInvalid={
                    errors.confirm_password && touched.confirm_password
                  }
                />
                <InputRightAddon
                  cursor="pointer"
                  onClick={setPassword.toggle}
                  children={password ? <FiEyeOff /> : <FiEye />}
                />
              </InputGroup>
              <FormHelperText color="red">
                {errors.confirm_password && touched.confirm_password
                  ? errors.confirm_password
                  : null}
              </FormHelperText>
            </FormControl>
            <Flex justifyContent="end">
              <Button
                bg={"blue.400"}
                color={"white"}
                type="submit"
                isLoading={isSubmitting}
                onClick={handleSubmit}
                _hover={{
                  bg: "blue.500",
                }}
              >
                {t("setting.update")}
              </Button>
            </Flex>
          </Container>
        </Form>
      )}
    </Formik>
  );
}
