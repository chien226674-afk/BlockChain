import { useForm } from "react-hook-form";

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

  const onSubmit = (data: LoginFormData) => {
    console.log("Login data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
      {/* Email */}
      <div>
        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-xl px-4 py-3 text-black bg-slate-200"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email",
            },
          })}
        />
        {errors.email && (
          <p className="text-red-400 text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-xl px-4 py-3 text-black bg-slate-200"
          {...register("password", {
            required: "Password is required",
          })}
        />
        {errors.password && (
          <p className="text-red-400 text-sm">{errors.password.message}</p>
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

      <button className="w-full bg-purple-600 py-3 rounded-xl font-semibold hover:scale-95 transition-all duration-300">
        Login
      </button>
    </form>
  );
}
