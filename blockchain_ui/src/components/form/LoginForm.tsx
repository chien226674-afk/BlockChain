import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import { useState } from "react";
import toast from "react-hot-toast";

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const { data: responseData } = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      toast.success("Welcome back!");
      login(responseData.token, responseData.user);
      navigate("/");
    } catch (err: any) {
      toast.error(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
      {/* Email */}
      <div>
        <input
          type="email"
          placeholder="Email Address"
          className="w-full rounded-xl px-4 py-3 text-black bg-slate-200 outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email",
            },
          })}
        />
        {errors.email && (
          <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-xl px-4 py-3 text-black bg-slate-200 outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          {...register("password", {
            required: "Password is required",
          })}
        />
        {errors.password && (
          <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Forgot password */}
      <div className="text-right">
        <a
          href="#"
          className="text-sm text-purple-400 hover:underline"
        >
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full bg-purple-600 py-3 rounded-xl font-semibold hover:scale-[0.98] active:scale-95 transition-all duration-300 flex justify-center items-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isLoading ? (
          <>
            <i className="fa-solid fa-spinner animate-spin"></i>
            Logging in...
          </>
        ) : 'Login'}
      </button>
    </form>
  );
}
