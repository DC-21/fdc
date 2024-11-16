const axios = require("axios");
const { StatusCodes } = require("http-status-codes");

class PaymentError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

const baseUrl = process.env.baseUrl;
const apiKey = process.env.apiKey;
const apiSecret = process.env.apiSecret;

async function getAuthToken() {
  try {
    const response = await axios.post(
      `${baseUrl}/api/token`,
      {},
      {
        headers: {
          apiKey: apiKey,
          apiSecret: apiSecret,
        },
      }
    );
    const { token } = response.data;
    return token;
  } catch (error) {
    console.error("Error getting auth token:", error);
    throw new Error("Failed to get auth token");
  }
}

async function createPayment(paymentData) {
  try {
    const authToken = await getAuthToken();
    const response = await axios.post(
      `${baseUrl}/api/v1/payment`,
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw new Error("Failed to create payment");
  }
}

async function confirmStatus(paymentId) {
  const maxRetries = 5;
  const delayBetweenRetries = 30000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const authToken = await getAuthToken();
      const response = await axios.get(
        `${baseUrl}/api/v1/payment/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      console.log("This is response:", response);

      if (response.data.payment.status === "success") {
        return response.data;
      }

      if (response.data.payment.status === "failed" && attempt === maxRetries) {
        throw new PaymentError(
          response.data.payment.message,
          StatusCodes.BAD_REQUEST
        );
      }

      console.warn(
        `Attempt ${attempt} failed with message: ${
          response.data.payment.message
        }, retrying in ${delayBetweenRetries / 1000} seconds...`
      );
      await new Promise((resolve) => setTimeout(resolve, delayBetweenRetries));
    } catch (error) {
      if (attempt === maxRetries) {
        console.error(
          "Error getting payment status after multiple attempts:",
          error
        );
        if (error instanceof PaymentError) {
          throw error;
        } else {
          throw new PaymentError(
            "Failed to get payment status",
            StatusCodes.INTERNAL_SERVER_ERROR
          );
        }
      }
      console.warn(
        `Attempt ${attempt} failed, retrying in ${
          delayBetweenRetries / 1000
        } seconds...`
      );
      await new Promise((resolve) => setTimeout(resolve, delayBetweenRetries));
    }
  }
  throw new PaymentError(
    "Failed to get payment status",
    StatusCodes.INTERNAL_SERVER_ERROR
  );
}

module.exports = {
  getAuthToken,
  createPayment,
  confirmStatus,
  PaymentError,
};
