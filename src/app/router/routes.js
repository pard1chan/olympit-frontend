export default [
  {
    path: "/",
    redirect: (to) => {
      return { name: "auth", params: { type: "login" } };
    },
  },
  {
    path: "/:type(login|register|forgot-password|reset-password)",
    name: "auth",
    meta: {
      header: false,
      requiresAuth: false,
    },
    props: true,
    component: () => import("@/pages/Auth.vue"),
  },
  {
    path: "/who-are-you",
    name: "who-are-you",
    component: () => import("@/pages/WhoAreYouPage.vue"),
    meta: {
      header: false,
      requiresAuth: false,
    },
  },
  {
    path: "/phone-verification",
    name: "phone-verification",
    component: () => import("@/pages/PhoneVerification.vue"),
    meta: {
      header: false,
      requiresAuth: false,
    },
  },
  {
    path: "/home",
    meta: {
      header: true,
      requiresAuth: true,
    },
    name: "home",
    component: () => import("@/pages/Dashboard/Dashboard.vue"),
  },
  {
    path: "/profile/edit",
    meta: {
      header: true,
      requiresAuth: true,
    },
    name: "edit-profile",
    component: () => import("@/pages/EditProfile/EditProfile.vue"),
  },
  {
    path: "/student/courses",
    name: "student-subscribed-courses",
    meta: {
      header: true,
      requiresAuth: true,
    },
    component: () => import("@/pages/Student/Courses/StudentCourses.vue"),
  },
  {
    path: "/student/aviable-courses",
    name: "student-aviable-courses",
    meta: {
      header: true,
      requiresAuth: true,
    },
    component: () =>
      import("@/pages/Student/Courses/AviableCoursesForStudent.vue"),
  },
  {
    path: "/student/courses/:id",
    name: "course",
    meta: {
      header: true,
      requiresAuth: true,
    },
    component: () => import("@/pages/Student/Courses/Course.vue"),
  },
  {
    path: "/student/ai-assistant",
    name: "ai-assistant",
    meta: {
      header: true,
      requiresAuth: true,
    },
    component: () => import("@/pages/Student/AI-Assistant/AiAssistant.vue"),
  },
  {
    path: "/student/exam-simulation",
    name: "exam-simulation",
    meta: {
      header: true,
      requiresAuth: true,
    },
    component: () =>
      import("@/pages/Student/ExamSimulation/ExamSimulation.vue"),
  },
  {
    path: "/student/exam-simulation/:id",
    name: "exam-simulation-test",
    meta: {
      header: true,
      requiresAuth: true,
    },
    props: true,
    component: () =>
      import("@/pages/Student/ExamSimulation/ExamSimulationTestPassing.vue"),
  },
  {
    path: "/gamification",
    name: "gamification",
    meta: {
      header: true,
      requiresAuth: true,
    },
    component: () => import("@/pages/Student/Gamefication/ui/Gamification.vue"),
  },
  {
    path: "/gamification/battle/:id",
    name: "gamification-battle",
    meta: {
      header: true,
      requiresAuth: true,
    },
    component: () =>
      import("@/pages/Student/Gamefication/ui/Battle/Battle.vue"),
  },
  {
    path: "/forum",
    name: "forum",
    meta: {
      header: true,
      requiresAuth: true,
    },
    component: () => import("@/pages/Forum/Forum.vue"),
  },
  {
    path: "/forum/thread/:id",
    name: "thread",
    meta: {
      header: true,
      requiresAuth: true,
    },
    component: () => import("@/pages/Forum/Forum.vue"),
  },
  {
    path: "/notifications",
    name: "notifications",
    meta: {
      header: true,
      requiresAuth: true,
    },
    component: () =>
      import("@/pages/Teacher/Notifications/CreateNotifications.vue"),
  },

  {
    path: "/calendar/events",
    name: "calendar-events",
    meta: {
      header: true,
      requiresAuth: true,
    },
    component: () => import("@/pages/Teacher/Events/Events.vue"),
  },
  {
    path: "/calendar/events/create",
    name: "calendar-events-create",
    meta: {
      header: true,
      requiresAuth: true,
    },
    component: () => import("@/pages/Teacher/Events/Events.vue"),
  },
  {
    path: "/calendar/events/edit/:id",
    name: "calendar-events-edit",
    meta: {
      header: true,
      requiresAuth: true,
    },
    component: () => import("@/pages/Teacher/Events/EditEvent.vue"),
  },

  {
    path: "/courses/create",
    name: "courses-create",
    meta: {
      header: true,
      requiresAuth: true,
    },
    component: () => import("@/pages/Teacher/Courses/CreateCourse.vue"),
  },
  {
    path: "/courses",
    name: "teacher-courses",
    meta: {
      header: true,
      requiresAuth: true,
    },
    component: () => import("@/pages/Teacher/Courses/Courses.vue"),
  },
  {
    path: "/courses/statistics",
    name: "courses-stat",
    meta: {
      header: true,
      requiresAuth: true,
    },
    component: () => import("@/pages/Teacher/CourseStats/CourseStats.vue"),
  },
  {
    path: "/courses/update/:id",
    name: "courses-update",
    meta: {
      header: true,
      requiresAuth: true,
    },
    component: () =>
      import("@/pages/Teacher/Courses/UpdateCourses/UpdateCourses.vue"),
  },
  {
    path: "/courses/:id/tests/create",
    name: "test-create",
    meta: {
      header: true,
      requiresAuth: true,
    },
    component: () => import("@/pages/Teacher/Tests/CreateTest.vue"),
  },

  {
    path: "/test/:id",
    name: "test-pass",
    meta: {
      header: true,
      requiresAuth: true,
    },
    component: () => import("@/pages/Student/TestPassing/TestPassing.vue"),
  },

  {
    path: "/tests/test/:id",
    name: "test-update",
    meta: {
      header: true,
      requiresAuth: true,
    },
    component: () => import("@/pages/Teacher/Tests/UpdateTest.vue"),
  },
  {
    path: "/admin-panel",
    name: "admin-panel",
    meta: {
      header: true,
      requiresAuth: true,
    },
    component: () => import("@/pages/Admin/Admin.vue"),
  },
  {
    path: "/admin-panel/users",
    name: "admin-panel-users",
    meta: {
      header: true,
      requiresAuth: true,
    },
    component: () => import("@/pages/Admin/AdminUsersList.vue"),
  },
  {
    path: "/admin-panel/courses",
    name: "admin-panel-courses",
    meta: {
      header: true,
      requiresAuth: true,
    },
    component: () => import("@/pages/Admin/AdminCoursesList.vue"),
  },

  {
    path: "/:pathMatch(.*)*", // любой нераспознанный путь
    name: "not-found",
    meta: { header: false }, // на 404 хедер обычно не нужен
    component: () => import("@/pages/NotFound.vue"),
  },
];
