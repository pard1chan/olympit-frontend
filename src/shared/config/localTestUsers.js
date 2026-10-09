export const LOCAL_TEST_USERS = [
  {
    id: "local-student",
    email: "student@olympit.test",
    password: "Student123!",
    role: "student",
    nickname: "Тестовый ученик",
    class: "10",
  },
  {
    id: "local-teacher",
    email: "teacher@olympit.test",
    password: "Teacher123!",
    role: "teacher",
    nickname: "Тестовый учитель",
    class: null,
  },
];

const LOCAL_TOKEN_PREFIX = "local-test:";

export const findLocalTestUser = ({ email, password }) => {
  if (!import.meta.env.DEV) return null;

  const normalizedEmail = email?.trim().toLowerCase();

  return (
    LOCAL_TEST_USERS.find(
      (user) =>
        user.email.toLowerCase() === normalizedEmail &&
        user.password === password,
    ) || null
  );
};

export const createLocalTestToken = (user) =>
  `${LOCAL_TOKEN_PREFIX}${user.id}`;

export const getLocalTestUserByToken = (token) => {
  if (!import.meta.env.DEV || !token?.startsWith(LOCAL_TOKEN_PREFIX)) {
    return null;
  }

  const id = token.slice(LOCAL_TOKEN_PREFIX.length);
  return LOCAL_TEST_USERS.find((user) => user.id === id) || null;
};

export const isLocalTestToken = (token) =>
  import.meta.env.DEV && token?.startsWith(LOCAL_TOKEN_PREFIX);

export const toLocalProfile = (user) => ({
  id: user.id,
  userId: user.id,
  nickname: user.nickname,
  email: user.email,
  role: user.role,
  class: user.class,
  avatarUrl: null,
});
