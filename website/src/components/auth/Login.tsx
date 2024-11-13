import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: any) => {
    e.preventDefault();
    console.log("Logging in with:", { email, password });
  };

  return (
    <div className="w-full flex items-center justify-center min-h-screen bg-white p-4">
      <div className="md:w-96 w-full py-8 px-2 shadow-slate-800 shadow-lg rounded-xl items-center justify-center flex flex-col">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
          Farmers Connect
        </h2>
        <form
          onSubmit={handleLogin}
          className="space-y-4 w-full flex flex-col px-8"
        >
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Forgot your password?{" "}
          <a
            href="/register"
            className="text-green-600 font-medium hover:underline"
          >
            Reset
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
