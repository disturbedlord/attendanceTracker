import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";

export function getFirebaseAuthErrorMessage(error) {
  switch (error.code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";

    case "auth/user-not-found":
      return "No account found with this email.";

    case "auth/wrong-password":
      return "Incorrect password. Please try again.";

    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";

    case "auth/user-disabled":
      return "This account has been disabled.";

    case "auth/network-request-failed":
      return "Network error. Please check your connection.";

    default:
      return "Something went wrong. Please try again.";
  }
}

function Login() {
  const navigate = useNavigate();
  const [email, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();

    console.error("HandleSignIn Called");
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      console.error("UserCreds : ", userCredentials);
      const user = userCredentials.user;
      console.error("UID : ", user.uid);
      navigate("/dashboard");
    } catch (exp) {
      console.error(exp);
      setError(getFirebaseAuthErrorMessage(exp));
    }
  };

  return (
    <div>
      <form onSubmit={handleSignIn}>
        <label for="email" class="block text-sm/6 font-medium text-Black">
          Email
        </label>
        <input
          class="block border min-w-0 grow bg-gray py-1.5 pr-3 pl-1 text-base 
           placeholder:text-gray-400 focus:outline-none sm:text-sm/6 rounded"
          id="email"
          placeholder="avi@gmail.com"
          style={{ width: "100%", marginBottom: 10 }}
          onChange={(e) => {
            setEmailId(e.target.value);
          }}
        />
        <label for="email" class="block text-sm/6 font-medium text-Black">
          Password
        </label>
        <input
          class="block border min-w-0 grow bg-gray py-1.5 pr-3 pl-1 text-base 
         placeholder:text-gray-400 focus:outline-none sm:text-sm/6 rounded"
          type="password"
          placeholder="Password"
          style={{ width: "100%", marginBottom: 10 }}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
        {error && <p className="my-2 text-red-600 text-sm">{error}</p>}
      </form>
    </div>
  );
}

export default Login;
