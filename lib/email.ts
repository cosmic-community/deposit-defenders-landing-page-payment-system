import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY environment variable');
}

const resend = new Resend(process.env.RESEND_API_KEY);

// Send welcome email for free tier
export async function sendWelcomeEmail(email: string, plan: string): Promise<void> {
  try {
    await resend.emails.send({
      from: 'Deposit Defenders <noreply@depositdefenders.com>',
      to: [email],
      subject: `Welcome to Deposit Defenders - ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #16a34a;">Welcome to Deposit Defenders!</h1>
          
          <p>Thank you for signing up for the ${plan.charAt(0).toUpperCase() + plan.slice(1)} plan. You're now protected against unfair deposit deductions!</p>
          
          ${plan === 'free' ? `
          <h2>Your Free Plan Includes:</h2>
          <ul>
            <li>Basic deposit tracking</li>
            <li>Up to 3 properties</li>
            <li>Email notifications</li>
            <li>Basic reporting</li>
            <li>Community support</li>
          </ul>
          
          <p>Ready to unlock more features? <a href="${process.env.NEXT_PUBLIC_SITE_URL}/upgrade" style="color: #16a34a;">Upgrade to Pro</a></p>
          ` : `
          <h2>Your Pro Plan Includes:</h2>
          <ul>
            <li>Unlimited properties</li>
            <li>Advanced deposit tracking</li>
            <li>Automated reminders</li>
            <li>Detailed analytics</li>
            <li>Legal document templates</li>
            <li>Priority support</li>
            <li>API access</li>
            <li>Custom branding</li>
          </ul>
          `}
          
          <div style="margin: 30px 0; padding: 20px; background-color: #f0fdf4; border-radius: 8px;">
            <h3 style="margin-top: 0;">Next Steps:</h3>
            <ol>
              <li>Log in to your account</li>
              <li>Add your first property</li>
              <li>Upload move-in documentation</li>
              <li>Set up automated reminders</li>
            </ol>
          </div>
          
          <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/login" style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Get Started Now</a></p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          
          <p style="color: #6b7280; font-size: 14px;">
            Need help? Reply to this email or contact our support team.<br>
            Deposit Defenders - Protecting Your Deposits
          </p>
        </div>
      `
    });
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    // Don't throw error - email failure shouldn't block signup
  }
}

// Send payment confirmation email
export async function sendPaymentConfirmationEmail(
  email: string, 
  amount: number, 
  plan: string
): Promise<void> {
  try {
    await resend.emails.send({
      from: 'Deposit Defenders <noreply@depositdefenders.com>',
      to: [email],
      subject: 'Payment Confirmed - Welcome to Deposit Defenders Pro!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #16a34a;">Payment Confirmed!</h1>
          
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0;">Payment Details</h2>
            <p><strong>Plan:</strong> ${plan.charAt(0).toUpperCase() + plan.slice(1)}</p>
            <p><strong>Amount:</strong> $${amount}/month</p>
            <p><strong>Status:</strong> Active</p>
            <p><strong>Next billing date:</strong> ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
          </div>
          
          <p>Your Pro subscription is now active! You have access to all premium features including:</p>
          
          <ul>
            <li>Unlimited properties</li>
            <li>Advanced deposit tracking</li>
            <li>Automated reminders</li>
            <li>Detailed analytics</li>
            <li>Legal document templates</li>
            <li>Priority support</li>
            <li>API access</li>
            <li>Custom branding</li>
          </ul>
          
          <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Access Your Dashboard</a></p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          
          <p style="color: #6b7280; font-size: 14px;">
            Questions about your subscription? Contact our support team.<br>
            Deposit Defenders - Protecting Your Deposits
          </p>
        </div>
      `
    });
  } catch (error) {
    console.error('Failed to send payment confirmation email:', error);
    // Don't throw error - email failure shouldn't block payment processing
  }
}

// Send password reset email
export async function sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
  const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${resetToken}`;
  
  try {
    await resend.emails.send({
      from: 'Deposit Defenders <noreply@depositdefenders.com>',
      to: [email],
      subject: 'Reset Your Deposit Defenders Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Reset Your Password</h1>
          
          <p>We received a request to reset your Deposit Defenders account password.</p>
          
          <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
          
          <p><a href="${resetUrl}" style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Reset Password</a></p>
          
          <p style="color: #6b7280;">If you didn't request this password reset, you can safely ignore this email.</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          
          <p style="color: #6b7280; font-size: 14px;">
            Deposit Defenders - Protecting Your Deposits
          </p>
        </div>
      `
    });
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
}