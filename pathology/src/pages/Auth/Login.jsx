// import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8060/api/auth/login",
        formData,
      );

      console.log("Login Success:", res.data);

      console.log(res.data.token);
      localStorage.setItem("token", res.data.token);
      navigate("/home");
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Login Failed ❌");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://t3.ftcdn.net/jpg/17/54/72/32/360_F_1754723225_TdD6MUuikISBx6NweL012xOCpC3aTi3k.jpg')",
      }}
    >
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-10">
        <div className="mb-6">
  {/* Role Selection Buttons */}
  <div className="flex gap-3 mb-6">
    <button
      type="button"
      className="flex-1 py-3 rounded-xl border border-blue-600 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
    >
      Pathology
    </button>

    <button
      type="button"
      className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition"
    >
      Doctor
    </button>
  </div>

  {/* Heading */}
  <div className="text-left">
    <h2 className="text-3xl font-bold text-gray-900 mb-2">Log in</h2>
    <p className="text-gray-600">
      Use your email and password, or continue with Google.
    </p>
  </div>
</div>

        {/* ✅ Form connected */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 ml-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 ml-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 hover:cursor-pointer transition-all"
          >
            Log in
          </button>
        </form>

        <div className="flex items-center my-8">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="px-4 text-gray-400 text-xs font-bold tracking-widest">
            OR
          </span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

       

        {/* ✅ FIXED Link */}
        <p className="text-center text-gray-600 mt-8 text-sm">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-bold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
