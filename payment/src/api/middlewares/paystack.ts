import dotenv from "dotenv";

dotenv.config();

export const paystack = (request: any) => {
  const MySecretKey = `Bearer ${process.env.PAYSTACK_SECRET_KEY}`;
  // sk_test_xxxx to be replaced by your own secret key
  const initializePayment = (form: any, mycallback: any) => {
    const options = {
      url: "https://api.paystack.co/transaction/initialize",
      headers: {
        authorization: MySecretKey,
        "content-type": "application/json",
        "cache-control": "no-cache",
      },
      form,
    };
    const callback = (error: any, response: any, body: any) => {
      return mycallback(error, body);
    };
    request.post(options, callback);
  };

  const verifyPayment = (reference: any, mycallback: any) => {
    const options = {
      url:
        "https://api.paystack.co/transaction/verify/" +
        encodeURIComponent(reference),
      headers: {
        authorization: MySecretKey,
        "content-type": "application/json",
        "cache-control": "no-cache",
      },
    };
    const callback = (error: any, response: any, body: any) => {
      return mycallback(error, body);
    };
    request(options, callback);
  };
  return { initializePayment, verifyPayment };
};
