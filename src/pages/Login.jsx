import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>School Attendance</h2>

      <input placeholder="Email" style={{ width: "100%", marginBottom: 10 }} />
      <input
        type="password"
        placeholder="Password"
        style={{ width: "100%", marginBottom: 10 }}
      />

      <button onClick={() => navigate("/dashboard")}>Login</button>
    </div>
  );
}

export default Login;
