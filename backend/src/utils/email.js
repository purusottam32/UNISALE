import nodemailer from "nodemailer";
import AppError from "./apiError.js";

const createTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new AppError("SMTP credentials are missing. Check environment variables.", 500);
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `"UniSale" <noreply@unisale.in>`,
    to,
    subject,
    html,
  });
};

export const sendOTPEmail = async ({ to, otp, name }) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>UniSale - Verify Your Email</title>
    </head>
    <body style="margin:0;padding:0;background-color:#0f0f13;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
        <tr>
          <td align="center">
            <table width="480" cellpadding="0" cellspacing="0" style="background:#18181f;border-radius:16px;border:1px solid #2a2a3a;overflow:hidden;">
              <tr>
                <td style="padding:32px 40px 24px;border-bottom:1px solid #2a2a3a;">
                  <h1 style="margin:0;font-size:24px;font-weight:800;color:#ffffff;">
                    Uni<span style="color:#7c6af7;">Sale</span>
                  </h1>
                  <p style="margin:8px 0 0;color:#8b8b9e;font-size:13px;">Campus Marketplace</p>
                </td>
              </tr>
              <tr>
                <td style="padding:40px;">
                  <p style="margin:0 0 8px;color:#8b8b9e;font-size:14px;">Hey ${name || "there"},</p>
                  <h2 style="margin:0 0 24px;font-size:22px;font-weight:700;color:#ffffff;">Verify your email address</h2>
                  <p style="margin:0 0 32px;color:#a0a0b3;font-size:15px;line-height:1.6;">
                    Use the code below to verify your college email and join your campus marketplace.
                    This code expires in <strong style="color:#ffffff;">10 minutes</strong>.
                  </p>
                  <div style="background:#0f0f13;border:1px solid #7c6af7;border-radius:12px;padding:24px;text-align:center;margin-bottom:32px;">
                    <span style="font-size:40px;font-weight:800;letter-spacing:12px;color:#7c6af7;font-family:monospace;">${otp}</span>
                  </div>
                  <p style="margin:0;color:#5a5a6e;font-size:13px;line-height:1.6;">
                    If you didn't create a UniSale account, you can safely ignore this email.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:24px 40px;border-top:1px solid #2a2a3a;">
                  <p style="margin:0;color:#5a5a6e;font-size:12px;">
                    © 2026 UniSale · Campus-exclusive marketplace
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await sendEmail({ to, subject: `${otp} is your UniSale verification code`, html });
};
