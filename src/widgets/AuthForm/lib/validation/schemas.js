import * as yup from "yup";
import { toTypedSchema } from "@vee-validate/yup";
import { MESSAGES } from "./messages";

const passwordRegx =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

const phoneSchema = yup
  .string()
  .required(MESSAGES.required)
  .transform((value) => value?.replace(/\s/g, ""))
  .test("phone", MESSAGES.phone, (value) => {
    if (!value) return true;
    const ruPhoneRegex = /^(\+?7|8)?9\d{9}$/;
    const cleanValue = value.replace(/[\s\-()]/g, "");
    return ruPhoneRegex.test(cleanValue);
  })
  .min(11, 'Минимум 11 символов'); 

export const ph = yup.object({
  phone: phoneSchema
});

export const schemas = {
  login: toTypedSchema(
    yup.object({
      email: yup.string().required(MESSAGES.required).email(MESSAGES.email),
      password: yup
        .string()
        .required(MESSAGES.required)
        // .min(6, MESSAGES.minPasswordLength)
        // .max(30, MESSAGES.maxPasswordLength),
    }),
  ),

  register: toTypedSchema(
    yup.object({
      nickname: yup
        .string()
        .required(MESSAGES.required)
        .min(3, MESSAGES.minNameLength)
        .max(30, MESSAGES.maxNameLength),
      phone: phoneSchema,
      email: yup.string().required(MESSAGES.required).email(MESSAGES.email),
      password: yup
        .string()
        .required(MESSAGES.required)
        .min(6, MESSAGES.minPasswordLength)
        .max(30, MESSAGES.maxPasswordLength)
        .matches(passwordRegx, MESSAGES.passwordStrength),
      password_confirmation: yup
        .string()
        .required(MESSAGES.repeatPassword)
        .oneOf([yup.ref("password")], MESSAGES.passwordMatch),
    }),
  ),
};
