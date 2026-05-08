import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import App from "./App";

import CourseList from "./pages/CourseList";
import CourseForm from "./pages/CourseForm";
import TeacherList from "./pages/TeacherList";
import TeacherForm from "./pages/TeacherForm";
import ClassroomList from "./pages/ClassroomList";
import StudentList from "./pages/StudentList";
import ScheduleGenerator from "./pages/ScheduleGenerator";
import StudentSchedule from "./pages/StudentSchedule";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <CourseList /> },
      { path: "/create-course", element: <CourseForm /> },
      { path: "/teachers", element: <TeacherList /> },
      { path: "/create-teacher", element: <TeacherForm /> },
      { path: "/classrooms", element: <ClassroomList /> },
      { path: "/students", element: <StudentList /> },
      { path: "/schedule", element: <ScheduleGenerator /> },
      { path: "/student-schedule", element: <StudentSchedule /> },
      { path: "/edit-teacher/:id", element: <TeacherForm /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);