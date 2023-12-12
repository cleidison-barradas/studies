const sgMail = require("@sendgrid/mail");

interface EmailDTO {
  fromName?: string;
  subject: string;
  destination: string;
  content: any;
  isContentHtml: boolean;
}

export default async function sendEmail({
  fromName = 'noreply',
  subject,
  destination,
  content,
  isContentHtml = false,
}: EmailDTO) {
  const { SENDGRID_KEY, SENDGRID_USER } = process.env;

  if (SENDGRID_KEY.length === 0 || SENDGRID_USER.length === 0) {
    console.log(
      "Could not send email because sendgrid credentials were not found.",
      undefined,
      "warn"
    );
    return false;
  }
  sgMail.setApiKey(SENDGRID_KEY);

  let message = {};

  message = {
    to: destination,
    from: {
      email: SENDGRID_USER,
      name: fromName,
    },
    subject,
  };

  if (isContentHtml) {
    message = {
      ...message,
      html: content,
    };
  } else {
    message = {
      ...message,
      content,
    };
  }

  return sgMail.send(message);
}
