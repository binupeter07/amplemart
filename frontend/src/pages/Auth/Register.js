import { useEffect, useState } from "react";
import styles from "./Auth.module.scss";
import registerImg from "../../assets/register.png";
import Card from "../../components/card/Card";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { validateEmail } from "../../redux/features/auth/authService"; 
import { RESET_AUTH, register, sendOTP, verifyOTP } from "../../redux/features/auth/authSlice";

const initialState = {
  name: "",
  email: "",
  password: "",
  cPassword: "",
  otp: "",
};

const Register = () => {
  const [formData, setFormData] = useState(initialState);
    const { name, email, password, cPassword, otp } = formData;

    const {
      isLoading,
      isLoggedIn,
      isSuccess,
      isOTPSending,
      isOTPVerifying,
      isOTPVerified,
    } = useSelector((state) => state.auth);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const sendOTPToUser = async () => {
      if (!email || !validateEmail(email)) {
        toast.error("Please enter a valid email");
        return;
      }

      try {
        await dispatch(sendOTP(email));
        setIsOtpSent(true);
        toast.success("OTP sent successfully");
      } catch (error) {
        toast.error(`Error sending OTP: ${error.message || "Unknown error"}`);
      }
    };

    const verifyOTPFromUser = async () => {
      if (!email || !otp) {
        toast.error("Please enter your email and OTP");
        return;
      }

      try {
        dispatch(verifyOTP({ email, otp })).then((res) => {
          if (res.error) {
            toast.error(res.payload.message)
          } else {
            toast.success("OTP verified!");
            registerUser();
          }
          console.log(res)
        })
      } catch (error) {
        toast.error(`Invalid OTP: ${error.message || "Unknown error"}`);
      }
    };

    const registerUser = async () => {
      if (!name || !email || !password || !cPassword) {
        toast.error("All fields are required");
        return;
      }
      if (password !== cPassword) {
        toast.error("Passwords do not match");
        return;
      }
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters long");
        return;
      }
      if ( !isOTPVerified) {
        toast.error("OTP NOT VERIFIED");
        return null
      }

      const userData = { name, email, password };
      dispatch(register(userData));
    };

    useEffect(() => {
      if (isSuccess && isLoggedIn) {
        navigate("/");
      }
      return () => {
        dispatch(RESET_AUTH());
      };
    }, [isLoggedIn, isSuccess, navigate, dispatch]);

  return (
    <>
      {isLoading && <Loader />}
      <section className={`container ${styles.auth}`}>
        <Card>
          <div className={styles.form}>
            <h2>Register</h2>
            <form onSubmit={registerUser}>
              <input
                type="text"
                placeholder="Name"
                required
                name="name"
                value={name}
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Email"
                required
                name="email"
                value={email}
                onChange={handleInputChange}
              />
              <input
                type="password"
                placeholder="Password"
                required
                name="password"
                value={password}
                onChange={handleInputChange}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                required
                name="cPassword"
                value={cPassword}
                onChange={handleInputChange}
              />

              {isOtpSent ? (
                <>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    required
                    name="otp"
                    value={otp}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className="--btn --btn-primary --btn-block"
                    onClick={verifyOTPFromUser}
                    disabled={isOTPVerifying}
                  >
                    {isOTPVerifying ? "Verifying OTP..." : "Verify OTP"}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="--btn --btn-primary --btn-block"
                  onClick={sendOTPToUser}
                  disabled={isOTPSending}
                >
                  {isOTPSending ? "Sending OTP..." : "Send OTP"}
                </button>
              )}

              {isOTPVerified && <button
                type="submit"
                className="--btn --btn-primary --btn-block"
                disabled={isOTPVerifying || !isOTPVerified}
              >
                Register
              </button>}
            </form>

            <span className={styles.register}>
              <p>Already have an account?</p>
              <Link to="/login">Login</Link>
            </span>
          </div>
        </Card>
        <div className={styles.img}>
          <img src={registerImg} alt="Register" width="400" />
        </div>
      </section>
    </>
  );
};

export default Register;


