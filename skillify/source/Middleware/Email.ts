import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { CouldNotSendEmail } from '../../library/Errors/Email';
import { Globals } from '../../library/Globals/Globals';

export class Email {
  public static async send(
    to: string,
    options: Mail.Options
  ): Promise<SMTPTransport.SentMessageInfo> {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: Globals.V_EMAIL,
          pass: Globals.V_PASSWORD
        }
      });

      const mailOptions: Mail.Options = {
        from: `Skillify <${Globals.V_EMAIL}>`,
        to,
        ...options
      };

      return await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Email sending error:', error);
      throw new CouldNotSendEmail(`Error sending email to ${to}`);
    }
  }

  public static async sendVerificationCode(
    to: string,
    subject: string,
    code: number
  ): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #ffffff;">
        <h2 style="color: #333333;">Your Verification Code</h2>
        <p style="font-size: 18px; color: #555555;">${code}</p>
        <p style="font-size: 14px; color: #777777;">This code is valid for your most recent verification request.</p>
      </div>
    `;

    const mailOptions: Mail.Options = { subject, html };

    await Email.send(to, mailOptions);
  }
}

/**
 * Sends an email notifying the user that their request has been accepted.
 * @param userName - The name of the user.
 * @param userEmail - The email address of the user.
 * @param requestTitle - The title of the accepted request.
 * @param requestDescription - The description of the accepted request.
 * @param acceptanceDate - The date the request was accepted (formatted string).
 */
export async function sendRequestAcceptedEmail(
  userName: string,
  userEmail: string,
  requestTitle: string,
  requestDescription: string,
  acceptanceDate: string
): Promise<void> {
  const subject = `Your Request "${requestTitle}" Has Been Accepted`;

  const html = `
  <html>
    <body style="background-color: #f7f8fa; margin: 0; padding: 20px; font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto;">
        <div style="background-color: #ffffff; padding: 40px; border-radius: 12px; border: 1px solid #ddd;">
          <h2 style="font-size: 24px; color: #4CAF50; margin-top: 0;">Good News, ${sanitize(userName)}!</h2>
          <p style="font-size: 16px; color: #333;">Your request titled "<strong>${sanitize(requestTitle)}</strong>" has been accepted.</p>
          <p style="font-size: 16px; color: #333;">${sanitize(requestDescription)}</p>
          <p style="font-size: 14px; color: #777; margin-top: 20px;">Accepted on ${sanitize(acceptanceDate)}</p>
          <p style="font-size: 12px; color: #999; margin-top: 30px;">If you have any questions, feel free to reply to this email.</p>
        </div>
      </div>
    </body>
  </html>
`;

  await Email.send(userEmail, { subject, html });
}

/**
 * Sends an email notifying the user that their request has been denied.
 * @param userName - The name of the user.
 * @param userEmail - The email address of the user.
 * @param requestTitle - The title of the denied request.
 * @param requestDescription - The description of the denied request.
 * @param denialDate - The date the request was denied (formatted string).
 * @param reason - Optional reason for denial.
 */
export async function sendRequestDeniedEmail(
  userName: string,
  userEmail: string,
  requestTitle: string,
  requestDescription: string,
  denialDate: string,
  reason?: string
): Promise<void> {
  const subject = `Your Request "${requestTitle}" Has Been Denied`;

  const reasonSection = reason
    ? `<p style="font-size: 16px; color: #333;">${sanitize(reason)}</p>`
    : '';

  const html = `
  <html>
    <body style="background-color: #f7f8fa; margin: 0; padding: 20px; font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto;">
        <div style="background-color: #ffffff; padding: 40px; border-radius: 12px; border: 1px solid #ddd;">
          <h2 style="font-size: 24px; color: #f44336; margin-top: 0;">We're Sorry, ${sanitize(userName)}</h2>
          <p style="font-size: 16px; color: #333;">Your request titled "<strong>${sanitize(requestTitle)}</strong>" has been denied.</p>
          ${reasonSection}
          <p style="font-size: 14px; color: #777; margin-top: 20px;">Denied on ${sanitize(denialDate)}</p>
          <p style="font-size: 12px; color: #999; margin-top: 30px;">If you have any questions, feel free to reply to this email.</p>
        </div>
      </div>
    </body>
  </html>
`;

  await Email.send(userEmail, { subject, html });
}

/**
 * Sends an email notifying the recipient that a new request has been created for them.
 * @param recipientName - The name of the recipient.
 * @param recipientEmail - The email address of the recipient.
 * @param requestTitle - The title of the new request.
 * @param requestDescription - The description of the new request.
 * @param createdByName - The name of the user who created the request.
 * @param creationDate - The date the request was created (formatted string).
 */
export async function sendNewRequestEmail(
  recipientName: string,
  recipientEmail: string,
  requestTitle: string,
  requestDescription: string,
  createdByName: string,
  creationDate: string
): Promise<void> {
  const subject = `New Request: "${requestTitle}"`;

  const html = `
  <html>
    <body style="background-color: #f7f8fa; margin: 0; padding: 20px; font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto;">
        <div style="background-color: #ffffff; padding: 40px; border-radius: 12px; border: 1px solid #ddd;">
          <h2 style="font-size: 24px; color: #1a73e8; margin-top: 0;">Hello ${sanitize(recipientName)},</h2>
          <p style="font-size: 16px; color: #333;">You have received a new request titled "<strong>${sanitize(requestTitle)}</strong>".</p>
          <p style="font-size: 16px; color: #333;">${sanitize(requestDescription)}</p>
          <p style="font-size: 14px; color: #777; margin-top: 20px;">Requested by ${sanitize(createdByName)} on ${sanitize(creationDate)}</p>
          <p style="font-size: 12px; color: #999; margin-top: 30px;">If you have any questions, feel free to reply to this email.</p>
        </div>
      </div>
    </body>
  </html>
`;

  await Email.send(recipientEmail, { subject, html });
}

/**
 * Sanitizes input to prevent HTML injection.
 * @param input - The input string to sanitize.
 * @returns The sanitized string.
 */
function sanitize(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
