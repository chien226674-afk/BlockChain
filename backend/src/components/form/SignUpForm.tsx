import { useForm, useWatch } from "react-hook-form";

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

  const password = useWatch({
    control,
    name: "password",
  });

  const onSubmit = (data: SignupFormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
      {/* Username */}
      <div>
        <input
          placeholder="Username"
          className="w-full rounded-xl px-4 py-3 text-black bg-slate-200"
          {...register("username", {
            required: "Username is required",
            minLength: { value: 3, message: "Min 3 characters" },
            maxLength: { value: 20, message: "Max 20 characters" },
            pattern: {
              value: /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/,
              message: "Invalid username",
            },
          })}
        />
        {errors.username && (
          <p className="text-red-400 text-sm">{errors.username.message}</p>
        )}
      </div>

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
            minLength: { value: 8, message: "Min 8 characters" },
            maxLength: { value: 32, message: "Max 32 characters" },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
              message: "Weak password",
            },
          })}
        />
        {errors.password && (
          <p className="text-red-400 text-sm">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full rounded-xl px-4 py-3 text-black bg-slate-200"
          {...register("confirmPassword", {
            required: "Confirm your password",
            validate: (value) =>
              value === password || "Passwords do not match",
          })}
        />
        {errors.confirmPassword && (
          <p className="text-red-400 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button className="w-full bg-purple-600 py-3 rounded-xl font-semibold hover:scale-95 transition-all duration-300">
        Create Account
      </button>
    </form>
  );
}
