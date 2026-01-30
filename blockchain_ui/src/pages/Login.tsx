import LoginForm from "@/components/LoginForm";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Image */}
      <div className="hidden lg:flex flex-1">
        <img
          src="Sign_Up.png"
          alt="Login"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Form */}
      <div className="flex flex-1 justify-center items-center text-white px-6">
        <div className="w-full max-w-md">
          <h1 className="text-4xl md:text-5xl font-semibold">
            Login
          </h1>
          <h2 className="font-medium mt-2 text-gray-300">
            Welcome back! Please enter your details.
          </h2>

          <LoginForm />

          {/* Register link */}
          <p className="mt-4 text-sm text-gray-400">
            Don’t have an account?{" "}
           <Link
    to="/signup"
    className="text-purple-400 hover:text-purple-500 font-semibold"
  >
    Signup
  </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
