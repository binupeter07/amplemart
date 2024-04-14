import { useState } from 'react';
import styles from './ChangePassword.module.scss';
import Card from '../../components/card/Card';
import { toast } from 'react-toastify';
import { changePassword } from '../../redux/features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const changeUserPassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      return toast.error('All fields are required');
    }

    if (newPassword !== confirmPassword) {
      return toast.error('New password and confirm password do not match');
    }

    const userData = {
      oldPassword,
      password: newPassword,
    };
    try {
      await dispatch(changePassword(userData));
      navigate('/profile');
    } catch (error) {
      toast.error('Failed to change password. Please try again.');
    }
  };

  return (
    <section className={`container ${styles.auth}`}>
      <Card>
        <div className={styles.form}>
          <h2>Change Password</h2>

          <form onSubmit={changeUserPassword}>
            <input
              type="password"
              placeholder="Old Password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
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
              Change Password
            </button>
          </form>
        </div>
      </Card>
    </section>
  );
};

export default ChangePassword;
