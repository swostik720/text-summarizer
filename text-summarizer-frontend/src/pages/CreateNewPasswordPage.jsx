import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CreateNewPasswordPage = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state for the button

  const urlParams = new URLSearchParams(search);
  const email = urlParams.get("email");
  const token = localStorage.getItem("passwordResetToken"); // Retrieve the token from localStorage

  useEffect(() => {
    if (!token || !email) {
      setError("Invalid or expired link.");
      return;
    }
  }, [email, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true); // Set loading to true when the request starts

    try {
      const response = await fetch("http://127.0.0.1:8000/api/password/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setTimeout(() => navigate("/login"), 3000); // Redirect to login after successful reset
      } else {
        setError(data.message || "Password reset failed.");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false); // Set loading to false when the request finishes
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Create New Password</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {message && <p className="text-green-500 text-sm mb-4">{message}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">New Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700">Confirm Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            disabled={loading} // Disable the button while loading
          >
            {loading ? "Resetting..." : "Reset Password"} {/* Button text based on loading state */}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNewPasswordPage;
