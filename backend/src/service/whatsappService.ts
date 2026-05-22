import axios from "axios";

const FONNTE_TOKEN = process.env.FONNTE_TOKEN;

export const sendWhatsApp = async (target: string, message: string) => {
  try {
    const response = await axios.post(
      "https://api.fonnte.com/send",
      {
        target,
        message,
      },
      {
        headers: {
          Authorization: FONNTE_TOKEN,
        },
      }
    );

    console.log("FONNTE RESPONSE:", response.data);

    return response.data;
  } catch (error) {
    console.error("WA Error:", error);
    throw error;
  }
};