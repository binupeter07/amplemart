import { useEffect, useState } from "react";
import styles from "./Auth.module.scss";
import loginImg from "../../assets/login.png";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/card/Card";
import { toast } from "react-toastify";
import Loader from "../../components/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import {
  RESET_AUTH,
  login,
  forgotPassword,
} from "../../redux/features/auth/authSlice";
import { validateEmail } from "../../redux/features/auth/authService";
import { useSearchParams } from "react-router-dom";
import { getCartDB, saveCartDB } from "../../redux/features/product/cartSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoggedIn, isLoading, isSuccess } = useSelector(
    (state) => state.auth
  );
  const [urlParams] = useSearchParams();
  const redirect = urlParams.get("redirect");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("All fields are required");
    }

    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email");
    }
    const userData = {
      email,
      password,
    };
    await dispatch(login(userData));
  };

  const forgotPasswordHandler = async () => {
    if (!email) {
      return toast.error("Please enter your email to reset password");
    }

    try {
      await dispatch(forgotPassword({ email }));
      toast.success("Password reset email sent successfully");
    } catch (error) {
      toast.error(
        "Failed to send password reset email. Please try again later"
      );
    }
  };

  useEffect(() => {
    if (isLoggedIn && isSuccess) {
      if (redirect === "cart") {
        dispatch(
          saveCartDB({
            cartItems: JSON.parse(localStorage.getItem("cartItems")),
          })
        );
        return navigate("/cart");
      }
      dispatch(getCartDB());
    }

    dispatch(RESET_AUTH());
  }, [isSuccess, isLoggedIn, navigate, dispatch, redirect]);

  return (
    <>
      {isLoading && <Loader />}
      <section className={`container ${styles.auth}`}>
        <div className={styles.img}>
          <img src={loginImg} alt="Login" width="400" />
        </div>

        <Card>
          <div className={styles.form}>
            <h2>Login</h2>

            <form onSubmit={loginUser}>
              <input
                type="text"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit" className="--btn --btn-primary --btn-block">
                Login
              </button>
              <p
                style={{
                  textDecoration: "underline",
                  color: "--light-blue",
                  cursor: "pointer",
                }}
                onClick={forgotPasswordHandler}
              >
                Forgot Password
              </p>
            </form>

            <span className={styles.register}>
              <p>Don't have an account?</p>
              <Link to="/register">Register</Link>
            </span>
          </div>
        </Card>
      </section>
    </>
  );
};

export default Login;
