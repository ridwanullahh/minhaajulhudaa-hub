import config from '../config';
import db from '../db';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlBody: string;
  textBody?: string;
  variables: string[];
}

export interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  cc?: string[];
  bcc?: string[];
  replyTo?: string;
  attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  filename: string;
  content: string;
  encoding?: string;
  contentType?: string;
}

export interface EmailLog {
  id: string;
  uid: string;
  to: string;
  subject: string;
  status: 'pending' | 'sent' | 'failed';
  provider: string;
  error?: string;
  sentAt?: string;
  createdAt: string;
}

class EmailService {
  private apiKey: string;
  private endpoint: string;
  private from: string;

  constructor() {
    this.apiKey = config.email.apiKey;
    this.endpoint = config.email.endpoint;
    this.from = config.email.from;
  }

  isConfigured(): boolean {
    return Boolean(this.endpoint || this.apiKey);
  }

  async send(payload: EmailPayload): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('Email service is not configured');
      return false;
    }

    const emailLog = await db.insert<EmailLog>('email_logs', {
      to: Array.isArray(payload.to) ? payload.to.join(', ') : payload.to,
      subject: payload.subject,
      status: 'pending',
      provider: 'smtp',
      createdAt: new Date().toISOString(),
    });

    try {
      if (config.app.debug) {
        console.log('📧 Email (Debug Mode):', {
          to: payload.to,
          subject: payload.subject,
          from: payload.from || this.from,
        });
        
        await db.update('email_logs', emailLog.uid, {
          status: 'sent',
          sentAt: new Date().toISOString(),
        });
        
        return true;
      }

      await db.update('email_logs', emailLog.uid, {
        status: 'sent',
        sentAt: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      await db.update('email_logs', emailLog.uid, {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      
      return false;
    }
  }

  async sendTemplate(
    templateName: string,
    to: string | string[],
    variables: Record<string, string>
  ): Promise<boolean> {
    const templates = await db.get<EmailTemplate>('email_templates');
    const template = templates.find(t => t.name === templateName);

    if (!template) {
      console.error(`Email template "${templateName}" not found`);
      return false;
    }

    let subject = template.subject;
    let html = template.htmlBody;
    let text = template.textBody || '';

    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      subject = subject.replace(placeholder, value);
      html = html.replace(placeholder, value);
      text = text.replace(placeholder, value);
    });

    return this.send({
      to,
      subject,
      html,
      text,
    });
  }

  async sendWelcomeEmail(name: string, email: string, platform: string): Promise<boolean> {
    return this.send({
      to: email,
      subject: `Welcome to ${platform} - Minhaajulhudaa`,
      html: `
        <h1>Welcome, ${name}!</h1>
        <p>Thank you for joining ${platform}. We're excited to have you as part of our community.</p>
        <p>Get started by exploring our platform and all the amazing features we offer.</p>
        <p>Best regards,<br>The Minhaajulhudaa Team</p>
      `,
    });
  }

  async sendOTPEmail(name: string, email: string, otp: string): Promise<boolean> {
    return this.send({
      to: email,
      subject: 'Verify Your Email - Minhaajulhudaa',
      html: `
        <h1>Email Verification</h1>
        <p>Hi ${name},</p>
        <p>Your verification code is: <strong style="font-size: 24px; color: #4F46E5;">${otp}</strong></p>
        <p>This code will expire in ${config.auth.otpExpiry} minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });
  }

  async sendPasswordResetEmail(name: string, email: string, otp: string): Promise<boolean> {
    return this.send({
      to: email,
      subject: 'Password Reset Request - Minhaajulhudaa',
      html: `
        <h1>Password Reset</h1>
        <p>Hi ${name},</p>
        <p>Your password reset code is: <strong style="font-size: 24px; color: #4F46E5;">${otp}</strong></p>
        <p>This code will expire in ${config.auth.otpExpiry} minutes.</p>
        <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
      `,
    });
  }

  async sendPaymentReceiptEmail(
    email: string,
    name: string,
    amount: number,
    currency: string,
    reference: string,
    platform: string
  ): Promise<boolean> {
    return this.send({
      to: email,
      subject: `Payment Receipt - ${reference}`,
      html: `
        <h1>Payment Successful</h1>
        <p>Hi ${name},</p>
        <p>Your payment has been processed successfully.</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Amount:</strong> ${currency} ${amount.toFixed(2)}</p>
          <p><strong>Reference:</strong> ${reference}</p>
          <p><strong>Platform:</strong> ${platform}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        </div>
        <p>Thank you for your payment!</p>
      `,
    });
  }

  async sendBookingConfirmationEmail(
    email: string,
    name: string,
    bookingDetails: any
  ): Promise<boolean> {
    return this.send({
      to: email,
      subject: `Booking Confirmation - ${bookingDetails.packageTitle}`,
      html: `
        <h1>Booking Confirmed!</h1>
        <p>Hi ${name},</p>
        <p>Your booking has been confirmed. Here are the details:</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Package:</strong> ${bookingDetails.packageTitle}</p>
          <p><strong>Travel Date:</strong> ${bookingDetails.travelDate}</p>
          <p><strong>Number of Travelers:</strong> ${bookingDetails.travelers}</p>
          <p><strong>Total Amount:</strong> ${bookingDetails.currency} ${bookingDetails.amount}</p>
          <p><strong>Booking Reference:</strong> ${bookingDetails.reference}</p>
        </div>
        <p>We'll send you more details closer to your travel date.</p>
      `,
    });
  }

  async sendDonationThankYouEmail(
    email: string,
    name: string,
    amount: number,
    currency: string,
    campaignName: string
  ): Promise<boolean> {
    return this.send({
      to: email,
      subject: `Thank You for Your Donation`,
      html: `
        <h1>Thank You!</h1>
        <p>Dear ${name},</p>
        <p>Thank you for your generous donation of ${currency} ${amount.toFixed(2)} to ${campaignName}.</p>
        <p>Your support makes a real difference in the lives of those we serve. May Allah reward you abundantly.</p>
        <p>Jazakallahu Khairan,<br>The Minhaajulhudaa Charity Team</p>
      `,
    });
  }

  async sendCourseEnrollmentEmail(
    email: string,
    name: string,
    courseName: string,
    courseUrl: string
  ): Promise<boolean> {
    return this.send({
      to: email,
      subject: `Course Enrollment Confirmation - ${courseName}`,
      html: `
        <h1>Welcome to ${courseName}!</h1>
        <p>Hi ${name},</p>
        <p>You've been successfully enrolled in ${courseName}.</p>
        <p><a href="${courseUrl}" style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 10px;">Access Your Course</a></p>
        <p>Happy learning!</p>
      `,
    });
  }

  async sendAssignmentDueReminderEmail(
    email: string,
    name: string,
    assignmentTitle: string,
    dueDate: string
  ): Promise<boolean> {
    return this.send({
      to: email,
      subject: `Assignment Due Reminder - ${assignmentTitle}`,
      html: `
        <h1>Assignment Due Soon</h1>
        <p>Hi ${name},</p>
        <p>This is a reminder that your assignment "<strong>${assignmentTitle}</strong>" is due on ${dueDate}.</p>
        <p>Make sure to submit it before the deadline to avoid late penalties.</p>
      `,
    });
  }

  async getEmailLogs(limit: number = 50): Promise<EmailLog[]> {
    const logs = await db.get<EmailLog>('email_logs');
    return logs.slice(0, limit);
  }
}

export const emailService = new EmailService();
export default emailService;
