import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Form = ({ type, onSubmit }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // State for loading
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true); // Set loading to true when request is initiated

        // If it's the register form, ensure passwords match
        if (type === "register" && password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false); // Set loading to false if passwords don't match
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/${type}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                const loginToken = data.loginToken; 
                localStorage.setItem("loginToken", loginToken); 
                
                alert(data.message);
                navigate(type === "register" ? "/login" : "/app"); // Redirect to login after successful registration or home after login
            } else {
                setError(data.message || "Request failed. Please try again.");
            }
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false); // Set loading to false when the request is done
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
            <h2 className="text-2xl font-bold mb-6 text-center">{type === "register" ? "Register" : "Login"}</h2>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <form onSubmit={handleSubmit}>
                {type === "register" && (
                    <div className="mb-4">
                        <label className="block text-gray-700">Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                )}

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

                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {type === "register" && (
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
                )}

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                    disabled={loading} // Disable the button when loading
                >
                    {loading ? (type === "register" ? "Registering..." : "Logging in...") : (type === "register" ? "Register" : "Login")}
                </button>
            </form>

            <p className="mt-4 text-center">
                {type === "register" ? (
                    <>
                        Already have an account?{" "}
                        <a href="/login" className="text-blue-600 hover:underline">
                            Login
                        </a>
                    </>
                ) : (
                    <>
                        Don&apos;t have an account?{" "}
                        <a href="/register" className="text-blue-600 hover:underline">
                            Register
                        </a>
                        <br />
                        <Link to="/resetpassword" className="text-blue-600 hover:underline">
                            Forgot Password?
                        </Link>
                    </>
                )}
            </p>
        </div>
    );
};

export default Form;
