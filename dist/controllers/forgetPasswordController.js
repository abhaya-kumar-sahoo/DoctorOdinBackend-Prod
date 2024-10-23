"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.sendOtpForForgetPassword = void 0;
const User_1 = __importDefault(require("../schemas/User"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// forget password api start
const sendOtpForForgetPassword = async (req, res) => {
    const _otp = Math.floor(100000 + Math.random() * 900000);
    let user = await User_1.default.findOne({ email: req.body.email });
    if (!user) {
        return res.status(500).json({ success: false, message: "User not found" });
    }
    try {
        let transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });
        let info = await transporter.sendMail({
            from: process.env.EMAIL,
            to: req.body.email,
            subject: "OTP for Forget Password",
            text: String(_otp),
            html: `
        <html>
          <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
              <div style="text-align: center; margin-bottom: 20px;">
                <img src="https://cdn.shopify.com/s/files/1/0551/4929/7722/files/logo2.jpg?v=1665398280" alt="Logo" style="max-width: 100px;" />
              </div>
              <h1 style="color: #333;">Hello and welcome,</h1>
              <p style="color: #333; font-size: 16px;">Your OTP for resetting your password is:</p>
              <h2 style="color: #333; font-size: 24px;">${_otp}</h2>
              <p style="color: #333; font-size: 16px;">If you did not request this OTP, please ignore this email.</p>
            </div>
          </body>
        </html>
      `,
        });
        console.log("Message sent: %s", info.messageId);
        // Check if email was sent successfully
        if (info.messageId) {
            // Update user with OTP
            await User_1.default.updateOne({ email: req.body.email }, { otp: _otp });
            return res.status(200).json({ success: true, message: "OTP sent" });
        }
        else {
            // If email failed to send
            return res.status(500).json({ success: false, message: "Server error" });
        }
    }
    catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.sendOtpForForgetPassword = sendOtpForForgetPassword;
// forget password api end
// update Password By OTP START //
const updatePassword = async (req, res) => {
    try {
        console.log(req.body);
        if (!req.body.otp || !req.body.password) {
            return res
                .status(400)
                .send({ success: false, message: "Both Fields are required" });
        }
        const result = await User_1.default.findOne({ otp: req.body.otp });
        console.log(result);
        if (!result) {
            return res.status(404).send({ success: false, message: "OTP is Wrong" });
        }
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(req.body.password, salt);
        await User_1.default.updateOne({ email: result.email }, {
            $set: { password: hashedPassword },
            $unset: { otp: "" },
        });
        res.status(200).send({ success: true, message: "Password updated" });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .send({ success: false, message: error.message || "Server error" });
    }
};
exports.updatePassword = updatePassword;
//# sourceMappingURL=forgetPasswordController.js.map