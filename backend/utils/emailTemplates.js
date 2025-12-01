const getEmailHTML = (title, body, buttonLink, buttonText) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body { font-family: 'Inter', -apple-system, sans-serif; line-height: 1.6; }
      .container { width: 90%; max-width: 600px; margin: 20px auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; }
      .header { background: linear-gradient(90deg, #4F65F1 0%, #764CF1 100%); padding: 30px 40px; }
      .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
      .content { padding: 40px; }
      .content p { font-size: 16px; color: #4a5568; margin-bottom: 24px; }
      .button { display: inline-block; background-color: #2a65f1; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 500; }
      .footer { background-color: #f7f9fc; padding: 30px 40px; text-align: center; color: #718096; font-size: 13px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>LegalEase</h1>
      </div>
      <div class="content">
        <h2 style="color: #1a202c; margin-top: 0;">${title}</h2>
        ${body}
        <a href="${buttonLink}" class="button" clicktracking=off>${buttonText}</a>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} LegalEase. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `;
};


const getResetPasswordHTML = (resetUrl) => {
  const title = 'Password Reset Request';
  const body = `
    <p>We received a request to reset the password for your LegalEase account.</p>
    <p>Please click the button below to set a new password. This link will expire in 10 minutes.</p>
  `;
  return getEmailHTML(title, body, resetUrl, 'Reset Your Password');
};

// Template 2: Case Accepted Notification
const getCaseAcceptedHTML = (caseTitle, lawyerName) => {
  const title = 'Great News! Your Case Has Been Accepted.';
  const body = `
    <p>Your case, <strong>"${caseTitle}"</strong>, has been accepted by <strong>Advocate ${lawyerName}</strong>.</p>
    <p>You can now communicate with them directly through the app's secure chat system. Please log in to your dashboard to get started.</p>
  `;
  const appUrl = 'http://localhost:3000/my-cases'; 
  return getEmailHTML(title, body, appUrl, 'Go to My Cases');
};

module.exports = { getResetPasswordHTML, getCaseAcceptedHTML };