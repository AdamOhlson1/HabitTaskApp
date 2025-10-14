import Login from "../components/Login";
import "../style/loginpage.css";
import { motion } from "framer-motion";

const LoginPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.3 }}
      className="login"
    >
      <Login />
    </motion.div>
  );
};

export default LoginPage;
