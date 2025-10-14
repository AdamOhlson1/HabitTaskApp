import "../style/loginpage.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateAcc = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // --- Email-validering ---
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Ange en giltig emailadress");
      return;
    }

    if (password !== confirmPassword) {
      setError("Lösenorden matchar inte");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const msg = await response.text();
        setError(msg || "Något gick fel vid registrering");
        return;
      }

      navigate("/login");
    } catch (err) {
      console.error("Register error:", err);
      setError("Något gick fel, försök igen.");
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h3>Skapa konto</h3>

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

        <div className="input-box">
          <input
            type={showConfirmPassword ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <label>Bekräfta lösenord</label>
          <input
            type="checkbox"
            checked={showConfirmPassword}
            onChange={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Skapa konto</button>
      </form>
    </div>
  );
};

export default CreateAcc;
