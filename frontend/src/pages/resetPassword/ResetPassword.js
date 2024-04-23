import { useEffect, useState } from "react";
import styles from "./resetPassword.module.scss";
import Card from "../../components/card/Card";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { resetpassword } from "../../redux/features/auth/authSlice";

const ResetPassword = () => {
  const location = useLocation();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, [location.search]);

  const changeUserPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      return toast.error(
        "New password and confirm password fields are required"
      );
    }

    if (newPassword !== confirmPassword) {
      return toast.error("New password and confirm password do not match");
    }

    try {
      const userResetPasswordData = {
        resetToken: token,
        userData: { password: newPassword },
      };
      let response = await dispatch(resetpassword(userResetPasswordData));
      toast.success("Password changed successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to change password. Please try again.");
    }
  };

  return (
    <section className={`container ${styles.auth}`}>
      <Card>
        <div className={styles.form}>
          <h2>Reset Password</h2>

          <form onSubmit={changeUserPassword}>
            <input
              type="password"
              placeholder="New Password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type="submit" className="--btn --btn-primary --btn-block">
              Reset Password
            </button>
          </form>
        </div>
      </Card>
    </section>
  );
};

export default ResetPassword;
