import { useEffect, useState } from "react";
import styles from "./Auth.module.scss";
import registerImg from "../../assets/register.png";
import Card from "../../components/card/Card";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { validateEmail } from "../../redux/features/auth/authService"; // Assuming you have this function
import { RESET_AUTH, register } from "../../redux/features/auth/authSlice";
import { sendOTP, verifyOTP } from "../../redux/features/auth/authSlice";

const initialState = {
  name: "",
  email: "",
  password: "",
  cPassword: "",
  otp: "", 
};

const Register = () => {
  const [formData, setFormData] = useState(initialState);
  const [isOtpSent, setIsOtpSent] = useState(false); 
  const { name, email, password, cPassword, otp } = formData;

  const { isLoading, isLoggedIn, isSuccess, message } = useSelector(
    (state) => state.auth
  );
  const { isOTPSending, isOTPVerifying, otpError, isOTPVerified, otpSuccess } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendOTPToUser = async () => {
    try {
      // Basic input validation
      if (!email) {
        return toast.error("Please enter your email");
      }

      await dispatch(sendOTP(email)); 

      if (otpSuccess) {
        setIsOtpSent(true);
        toast.success("OTP sent successfully"); 
      } else if (otpError) {
        toast.error(`Error sending OTP: ${otpError}`);
      }
    } catch (error) {
      console.error("Error sending OTP:", error); 
      toast.error("Error sending OTP. Please try again.");
    }
  };

  const verifyOTPFromUser = async () => {
    try {
      // Basic input validation 
      if (!email || !otp) {
        return toast.error("Please enter your email and OTP");
      }

      await dispatch(verifyOTP({ email, otp })); 

      if (otpError) {
        toast.error(`Invalid OTP: ${otpError}`);
      } else if (isOTPVerified) {
        toast.success("OTP verified!");
        registerUser(); 
      }
    } catch (error) {
      console.error("Error verifying OTP:", error); 
      toast.error("Error verifying OTP. Please try again.");
    }
  };

  const registerUser = async (e) => {
    e.preventDefault();

    // Validation
    if (!name || !email || !password || !cPassword) {
      return toast.error("All fields are required");
    }
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }
    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email");
    }
    if (password !== cPassword) {
      return toast.error("Passwords do not match");
    }

    const userData = {
      name,
      email,
      password,
    };

    dispatch(register(userData)); 
  };

  useEffect(() => {
    if (isSuccess && isLoggedIn) {
      navigate("/");
    }

    return () => {
      dispatch(RESET_AUTH());
    };
  }, [isLoggedIn, isSuccess, dispatch, navigate]);

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

              <button type="submit" className="--btn --btn-primary --btn-block" disabled={isOTPVerifying}>
                Register
              </button>
            </form>

            <span className={styles.register}>
              <p>Already an account?</p>
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
