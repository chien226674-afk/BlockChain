import React from "react"
import { WalletProvider } from "@/context/WalletContext"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import router from "@/router"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WalletProvider>
      <RouterProvider router={router} />
    </WalletProvider>
  </React.StrictMode>
)
