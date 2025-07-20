import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import supabase from "../client";

export default function Login() {
  // 1. State to manage alert messages
  const [alert, showAlert] = useState({
    message: "",
    show: false,
  });

  // 2. Hook to navigate programmatically
  const navigate = useNavigate();

  // 3. Setup react-hook-form
  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 4. Login function called on form submit
  const loginUser = async (values) => {
    const { error } = await supabase.auth.signInWithPassword(values);

    if (error) {
      showAlert({
        show: true,
        message: error.message,
      });
    } else {
      navigate("/todos");
    }
  };

  // 5. Alert component for showing errors
  function LoginAlert() {
    return (
      <>
        {alert.show && (
          <div className="alert alert-error mb-4">
            <div className="inline-flex justify-between items-center">
              <span>{alert.message}</span>
              <button
                onClick={() => showAlert({ message: "", show: false })}
                className="btn btn-ghost btn-circle"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // 6. LoginForm component with react-hook-form integration
  function LoginForm() {
    return (
      <form className="space-y-4" onSubmit={handleSubmit(loginUser)}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="input input-bordered w-full"
            {...register("email")}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="input input-bordered w-full"
            {...register("password")}
          />
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Login
        </button>
      </form>
    );
  }

  // 7. Render everything
  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {/* Show alert if there is one */}
        <LoginAlert />

        {/* Show login form */}
        <LoginForm />

        <p className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

