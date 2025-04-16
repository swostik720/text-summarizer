import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state for the button
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true); // Set loading to true when the request starts

    try {
      const response = await fetch("http://127.0.0.1:8000/api/password/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);

        // Store the password reset token in localStorage
        if (data.passwordResetToken) {
          localStorage.setItem("passwordResetToken", data.passwordResetToken);
        }

        setTimeout(() => navigate("/resetpassword"), 3000); // Redirect to reset page after success
      } else {
        setError(data.message || "Failed to send password reset link.");
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
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {message && <p className="text-green-500 text-sm mb-4">{message}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            disabled={loading} // Disable the button while loading
          >
            {loading ? "Sending..." : "Send Reset Link"} {/* Button text based on loading state */}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
