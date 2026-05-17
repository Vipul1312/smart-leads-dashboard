import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { registerApi } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";
import type { UserRole } from "../types";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    setError("");
    try {
      const res = await registerApi(data.name, data.email, data.password, data.role);
      login(res.token, res.user);
      navigate("/");
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        {error && <p className="bg-red-100 text-red-700 p-2 rounded mb-3">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Name"
            {...register("name", { required: "Name required" })}
            error={errors.name?.message}
          />
          <Input
            label="Email"
            type="email"
            {...register("email", { required: "Email required" })}
            error={errors.email?.message}
          />
          <Input
            label="Password"
            type="password"
            {...register("password", {
              required: "Password required",
              minLength: { value: 6, message: "Min 6 chars" },
            })}
            error={errors.password?.message}
          />
          <Select
            label="Role"
            {...register("role")}
            options={[
              { value: "sales", label: "Sales User" },
              { value: "admin", label: "Admin" },
            ]}
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating..." : "Register"}
          </Button>
        </form>
        <p className="mt-4 text-sm text-center">
          Have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
