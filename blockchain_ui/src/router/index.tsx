import { createBrowserRouter } from "react-router-dom"
import MainLayout from "@/layouts/MainLayout"
import Home from "@/pages/Home"
import Login from "@/pages/Login"
import NotFound from "@/pages/NotFound"
import Signup from "@/pages/SignUp"

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",  
        element:<Signup/>
      }
      ,
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
])

export default router
