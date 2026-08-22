import { createBrowserRouter, Navigate } from "react-router-dom"

import App from "./App"
import LoginPage from "./components/LoginPage"
import RegisterPage from "./components/RegisterPage"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <Navigate
            to="/login"
            replace
          />
        ),
      },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      {
        path: "catalog",
        element: (
          <Navigate
            to="/login"
            replace
          />
        ),
      },
      {
        path: "shelf",
        element: (
          <Navigate
            to="/login"
            replace
          />
        ),
      },
      {
        path: "community",
        element: (
          <Navigate
            to="/login"
            replace
          />
        ),
      },
      {
        path: "*",
        element: (
          <Navigate
            to="/login"
            replace
          />
        ),
      },
    ],
  },
])
