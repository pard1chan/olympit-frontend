import { IconEyeOff } from "@/shared/ui/Icons";

export const AUTH_CONFIGS = {
  login: {
    title: "Авторизация",
    fields: [
      {
        name: "email",
        type: "email",
        placeholder: "Email",
      },
      {
        name: "password",
        type: "password",
        icon: IconEyeOff,
        placeholder: "Пароль",
      },
    ],
    btns: [
      {
        submitText: "Войти",
      },
    ],
    links: [
      { to: "who-are-you", text: "Нет аккаунта", class: "h3" },
      { to: "forgot-password", text: "Забыли пароль?", class: "h6" },
    ],
    action: "login",
    redirect: "home",
  },

  register: {
    title: "Регистрация",
    fields: [
      {
        name: "nickname",
        type: "text",
        label: "Имя",
        placeholder: "Иван Иванов",
      },
      {
        name: "phone",
        type: "tel",
        mask: "+{7} (000) 000-00-00",
        mode: "numeric",
        placeholder: "Номер телефона",
      },
      {
        name: "email",
        type: "email",
        placeholder: "Email",
      },
      {
        name: "password",
        type: "password",
        placeholder: "Пароль",
      },
      {
        name: "password_confirmation",
        type: "password",
        placeholder: "Повторите пароль",
      },
    ],
    btns: [
      {
        submitText: "Зарегистрироваться",
      },
    ],
    links: [{ to: "login", text: "Уже есть аккаунт?", class: "h3" }],
    action: "register",
    redirect: "/login",
  },

  "forgot-password": {
    title: "Восстановление пароля",
    description: "Введите email для восстановления",
    fields: [
      {
        name: "email",
        type: "email",
        label: "Email",
        placeholder: "Email",
      },
    ],
    submitText: "Отправить ссылку",
    btns: [
      {
        submitText: "Отправить ссылку",
      },
    ],
    action: "forgotPassword",
    redirect: "/login",
  },

  "reset-password": {
    title: "Восстановление пароля",
    description: "Введите новый пароль",
    fields: [
      {
        name: "password",
        type: "password",
        placeholder: "Пароль",
      },
      {
        name: "password_confirmation",
        type: "password",
        placeholder: "Повторите пароль",
      },
    ],
    btns: [
      {
        submitText: "Сменить пароль",
      },
    ],
    links: [],
    action: "resetPassword",
    redirect: "/login",
  },
};
