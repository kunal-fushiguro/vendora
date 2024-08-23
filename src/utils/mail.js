import { createTransport } from "nodemailer";
import { EMAIL_PASSWORD } from "./env";

const Auth = createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: "natwarlaluzumaki@gmail.com",
    pass: EMAIL_PASSWORD,
  },
});

const sendOtpEmailForVerification = async (otp, username, email) => {
  try {
    const mailOptions = {
      from: "natwarlaluzumaki@gmail.com",
      to: email,
      subject: "Verify Your Email - VendorA",
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <div style="text-align: center;">
        <img src="https://your-logo-url.com/logo.png" alt="VendorA" style="max-width: 150px; margin-bottom: 20px;">
      </div>
      <h2 style="color: #333;">Hello, ${username}!</h2>
      <p style="font-size: 16px; color: #555;">
        Thank you for registering with <strong>VendorA</strong>. Please use the OTP below to verify your email address:
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <span style="font-size: 22px; font-weight: bold; color: #e74c3c; background-color: #f9f9f9; padding: 10px 20px; border: 2px dashed #e74c3c; border-radius: 10px; display: inline-block;">
          ${otp}
        </span>
      </div>
      <p style="font-size: 16px; color: #555;">
        Email: <strong>${email}</strong>
      </p>
      <p style="font-size: 16px; color: #555;">
        If you did not request this email, please ignore it.
      </p>
      <p style="font-size: 16px; color: #555;">
        Best regards,<br>
        The VendorA Team
      </p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="font-size: 14px; color: #aaa; text-align: center;">
        &copy; ${new Date().getFullYear()} VendorA. All rights reserved.
      </p>
    </div>
  `,
    };

    await Auth.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const sendOtpEmailForResetPassword = async (otp, username, email) => {
  try {
    const mailOptions = {
      from: "natwarlaluzumaki@gmail.com",
      to: email,
      subject: "Password Reset Request - VendorA",
      html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center;">
              <img src="https://your-logo-url.com/logo.png" alt="VendorA" style="max-width: 150px; margin-bottom: 20px;">
            </div>
            <h2 style="color: #333;">Hello, ${username}!</h2>
            <p style="font-size: 16px; color: #555;">
              We received a request to reset your password for your <strong>VendorA</strong> account associated with this email:
            </p>
            <p style="font-size: 16px; color: #555;">
              Email: <strong>${email}</strong>
            </p>
            <p style="font-size: 16px; color: #555;">
              Reset Password OTP : <strong>${otp}</strong>
            </p>
            <p style="font-size: 16px; color: #555;">
              If you did not request a password reset, please ignore this email or contact our support if you have questions.
            </p>
            <p style="font-size: 16px; color: #555;">
              Best regards,<br>
              The VendorA Team
            </p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 14px; color: #aaa; text-align: center;">
              &copy; ${new Date().getFullYear()} VendorA. All rights reserved.
            </p>
          </div>
        `,
    };

    await Auth.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export { sendOtpEmailForResetPassword, sendOtpEmailForVerification };
