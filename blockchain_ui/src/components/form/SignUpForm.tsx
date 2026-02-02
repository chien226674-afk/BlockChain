import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import { useState } from "react";
import toast from "react-hot-toast";

type SignupFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignupFormData>();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const password = useWatch({
    control,
    name: "password",
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const { data: responseData } = await api.post("/auth/register", {
        username: data.username,
        email: data.email,
        password: data.password,
      });

      toast.success("Account created successfully!");
      login(responseData.token, responseData.user);
      navigate("/");
    } catch (err: any) {
      toast.error(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
      {/* Username */}
      <div>
        <input
          placeholder="Username"
          className="w-full rounded-xl px-4 py-3 text-black bg-slate-200 outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          {...register("username", {
            required: "Username is required",
            minLength: { value: 3, message: "Min 3 characters" },
            maxLength: { value: 20, message: "Max 20 characters" },
          })}
        />
        {errors.username && (
          <p className="text-red-400 text-sm mt-1">{errors.username.message}</p>
        )}
      </div>

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
            minLength: { value: 8, message: "Min 8 characters" },
          })}
        />
        {errors.password && (
          <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full rounded-xl px-4 py-3 text-black bg-slate-200 outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          {...register("confirmPassword", {
            required: "Confirm your password",
            validate: (value) =>
              value === password || "Passwords do not match",
          })}
        />
        {errors.confirmPassword && (
          <p className="text-red-400 text-sm mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full bg-purple-600 py-3 rounded-xl font-semibold hover:scale-[0.98] active:scale-95 transition-all duration-300 flex justify-center items-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isLoading ? (
          <>
            <i className="fa-solid fa-spinner animate-spin"></i>
            Creating Account...
          </>
        ) : 'Create Account'}
      </button>
    </form>
  );
}
