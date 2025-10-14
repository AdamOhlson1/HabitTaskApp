import "../style/loginpage.css";
import CreateAcc from "../components/CreateAcc";
import { motion } from "framer-motion";

const CreateAccPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.3 }}
      className="login"
    >
      <CreateAcc />
    </motion.div>
  );
};

export default CreateAccPage;
