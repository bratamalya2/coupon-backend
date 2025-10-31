import config from "../../config/config.js";

const sendSendgridEmail = async (toMail, toName, subject, text, tid) => {
  const mailData = {
    toMail,
    toName,
    sender: {
      email: config.email.from,
      name: config.email.fromName,
    },
    subject,
    templateId: tid,
    text,
  };
  await sendSGEmail(mailData);
};

const sendSGEmail = async (mailData) => {
  const myHeaders = new Headers();
  myHeaders.append("api-key", config.email.brevo.brevoApiKey);
  myHeaders.append("accept", "application/json");
  myHeaders.append("content-type", "application/json");

  const raw = JSON.stringify({
    sender: mailData.sender,
    to: [
      {
        email: mailData.toMail,
        name: mailData.toName,
      },
    ],
    subject: mailData.subject,
    htmlContent: `<html><head></head><body><p>${mailData.text}</p><body></html>`,
  });

  console.log("Headers -> ");
  console.log(myHeaders);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const x = await fetch("https://api.brevo.com/v3/smtp/email", requestOptions);
  const y = await x.text();
  console.log(y);
};

export default {
  sendSendgridEmail,
};
