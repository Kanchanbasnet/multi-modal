export const layout = (content: string) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: Arial, sans-serif;">
    <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">

      <!-- Header -->
      <div style="background-color: #4F46E5; padding: 28px 40px; text-align: center;">
        <img
          src="https://vhowtunvdazbgjatkpho.supabase.co/storage/v1/object/sign/public-assets/12208150.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83ZTEyMjVkOS0zZTVjLTRjYTUtOWJhMS0zNzg5YjhjMjJiMWQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwdWJsaWMtYXNzZXRzLzEyMjA4MTUwLnBuZyIsImlhdCI6MTc3OTc2OTQwNCwiZXhwIjoxODExMzA1NDA0fQ.W0MgzN2BXd5zX8n7UQodl2qL2nQCXydsWcreAVe9tz4"
          alt="MultiModal"
          style="height: 48px; width: auto;"
        />
      </div>

      <!-- Content -->
      <div style="padding: 40px; color: #111827; font-size: 15px; line-height: 1.6;">
        ${content}
      </div>

      <!-- Footer -->
      <div style="background-color: #f9fafb; border-top: 1px solid #e5e7eb; padding: 24px 40px; text-align: center;">
        <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 13px;">
          Having trouble? Contact us at
          <a href="mailto:kanchanbasnet.dev@gmail.com" style="color: #4F46E5; text-decoration: none;">kanchanbasnet.dev@gmail.com</a>
        </p>
        <p style="margin: 0; color: #9ca3af; font-size: 12px;">
          © ${new Date().getFullYear()} MultiModal. All rights reserved.
        </p>
      </div>

    </div>
  </body>
</html>
`;
