import axios from "axios";

const FONNTE_TOKEN = process.env.FONNTE_TOKEN;

const sleep = (ms: number) =>
  new Promise((r) => setTimeout(r, ms));

export const sendWhatsApp = async (target: string, message: string, retry = 3) => {
  for (let attempt = 1; attempt <= retry; attempt++) {
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
            "Content-Type": "application/json",

          },
          timeout: 15000,

          httpAgent: false,
          httpsAgent: false,
        }
      );

      console.log("FONNTE RESPONSE:", response.data);


      if (!response.data?.status) {
        throw new Error(
          response.data?.detail ?? "Fonnte gagal"
        );
      }
      return response.data;
    } catch (err: any) {
      console.error(`WA Retry ${attempt}/${retry}`,
        err.code
      );

      if (attempt === retry || ![
        "ECONNRESET",
        "ETIMEDOUT",
        "ECONNABORTED",
      ].includes(err.code)) {
        throw err;
      }
      await sleep(3000);
    }
  }
};