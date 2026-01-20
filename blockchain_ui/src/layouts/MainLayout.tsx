import { Outlet } from "react-router-dom"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export default function MainLayout() {
  return (
    <div className="  min-h-screen bg-[#2B2B2B]">
      <Header/>

      <main className="mt-5">
        <Outlet />
      </main>

      <Footer/>
    </div>
  )
}
