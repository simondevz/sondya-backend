const createWelcomeEmailTemplate = `
      <!DOCTYPE html>
  <html>
    <head>
      <title>Welcome to Our Application</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          text-align: center;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fff;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        h1 {
          color: #333;
        }
        p {
          color: #777;
        }
        .logo {
          max-width: 150px;
          margin: 0 auto;
          display: block;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <img
          class="logo"
          src="https://www.sondya.com/logo/logo-side.png"
          alt="Company Logo"
        />
        <h1>Welcome to Sondya</h1>
        <p>
          Thank you for joining our community. We're excited to have you on board!
        </p>
        <p>
          Feel free to explore our features and services. If you have any
          questions or need assistance, please don't hesitate to contact us.
        </p>
        <p>
          Best regards,<br />
          Sondya Support Team
        </p>
      </div>
    </body>
  </html>
      `;

export default createWelcomeEmailTemplate;
