import { createBrowserRouter } from "react-router-dom"
import MainLayout from "@/layouts/MainLayout"
import Home from "@/pages/Home"
import Login from "@/pages/Login"
import NotFound from "@/pages/NotFound"
import Signup from "@/pages/Signup"
import Rankings from "@/pages/Rankings"
import ConnectWallet from "@/pages/ConnectWallet"
import NFTDetailPage from "@/pages/NFTDetailPage"
import Artist from "@/pages/Artist"

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
      },
      {
        path: "/rankings-desktop",
        element:<Rankings/>
      },
      {
        path: "/connect-wallet",
        element:<ConnectWallet/>
      },
       {
        path: "/nft-detail",
        element:<NFTDetailPage/>
      },
      {
        path: "/artist",
        element:<Artist/>
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
