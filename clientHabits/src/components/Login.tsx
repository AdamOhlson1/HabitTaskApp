import "../style/loginpage.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const msg = await response.text();
        alert(msg || "Fel vid inloggning");
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("loginTime", Date.now().toString());
      sessionStorage.setItem("sessionActive", "true");

      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      alert("Något gick fel vid inloggning");
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleLogin}>
        <h3>Logga in</h3>

        <div className="input-box">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Email</label>
        </div>

        <div className="input-box">
          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>Lösenord</label>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <button type="button" onClick={() => navigate("/createaccount")}>
            Skapa konto här
          </button>
        </div>
        <div>
          <button type="submit">Logga in</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
