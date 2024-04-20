import React, { useState } from "react";
import "./Contact.scss";
import { sendContactMail } from "../../redux/features/auth/authService";
import { toast } from "react-toastify";

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        MessageData: ""
    });

    const [errors, setErrors] = useState({});
    const [sendingError, setSendingError] = useState("");

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const onInputChange = (e) => {
        const { name, value } = e.target;
        let error = "";

        if (name === "name" && !value.trim()) {
            error = "Name is required";
        } else if (name === "email" && !validateEmail(value)) {
            error = "Invalid email format";
        } else if (name === "MessageData" && !value.trim()) {
            error = "Message is required";
        }

        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: error });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!validateEmail(formData.email)) {
            newErrors.email = "Invalid email format";
        }
        if (!formData.MessageData.trim()) {
            newErrors.MessageData = "Message is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onFormSubmit = async (e) => {
        e.preventDefault();
        const isValid = validateForm();
        if (isValid) {
            // Simulating a sending error
            simulateSendingError(); // Remove this line once you integrate with real sending functionality
            return
        }
        try {
            const response = await sendContactMail(formData);
            setFormData({
                name: "",
                email: "",
                MessageData: ""
            })
            setSendingError("")
            setErrors({})
            toast.success(response)
        } catch (error) {
            toast.error("failed to send message")
        }
    };

    const simulateSendingError = () => {
        // Simulating a sending error
        setSendingError("Error occurred while sending. Please try again later.");
    };

    return (
        <>
            <div className="contact-containter-page">
                <h3>Contact Us</h3>
                <form className="contact-form-page" onSubmit={onFormSubmit}>
                    <div className="contact-form-error-containter">
                        {errors.name && <span className="error-message" style={{ color: "red" }}>{errors.name}</span>}
                        {errors.email && <span className="error-message" style={{ color: "red" }}>{errors.email}</span>}
                    </div>
                    <div className="contact-form-personal-details">

                        <input
                            type="text"
                            className="contact-form-data-input-box"
                            placeholder="Name"
                            name="name"
                            value={formData.name}
                            onChange={onInputChange}
                        />
                        <input
                            type="text"
                            className="contact-form-data-input-box"
                            placeholder="Email"
                            name="email"
                            value={formData.email}
                            onChange={onInputChange}
                        />
                    </div>
                    <textarea
                        name="MessageData"
                        className="contact-form-data-input-box"
                        placeholder="Type here ... "
                        rows="10"
                        value={formData.MessageData}
                        onChange={onInputChange}
                    ></textarea>
                    {errors.MessageData && <span className="error-message" style={{ color: "red" }}>{errors.MessageData}</span>}
                    {sendingError && <span className="error-message" style={{ color: "red" }}>{sendingError}</span>}
                    <button type="submit" className="contact-form-send-button">
                        send
                    </button>
                </form>
            </div>
        </>
    );
};

export default ContactPage;
