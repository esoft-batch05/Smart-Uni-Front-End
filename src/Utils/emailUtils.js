import EmailServices from "../Services/EmailService";

export const sendEmail = async (data) => {
  try {
    await EmailServices.sendEmail(data);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};