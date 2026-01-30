import SignupForm from "@/components/SignupForm";
import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      <div className="hidden md:flex md:flex-1">
        <img
          src="/Sign_Up.png"
          alt="Login"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-1 justify-center items-center text-white px-6">
        <div className="w-full max-w-md md:max-w-92.5">

          <h1 className="text-4xl md:text-5xl font-semibold">
            Create Account
          </h1>

          <h2 className="font-medium mt-3 text-sm md:text-base text-gray-300">
            Welcome! Enter your details and start creating, collecting and selling NFTs.
          </h2>

          <SignupForm />
          
          <p className="mt-4 text-center text-sm text-gray-300">
  Already have an account?{" "}
  <Link
    to="/login"
    className="text-purple-400 hover:text-purple-500 font-semibold"
  >
    Login
  </Link>
</p>
        </div>
      </div>

    </div>
  );
}
