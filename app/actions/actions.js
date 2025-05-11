"use server";

const secretKey = process.env.PAYSTACK_TEST_SECRET_KEY;
const url = process.env.PAYSTACK_PAYMENT_URL;

const getCommonHeaders = () => ({
  Authorization: `Bearer ${secretKey}`,
  "Content-Type": "application/json",
});

export const paystackPay = async ({
  amount,
  email,
  currency,
  channels,
  subaccount,
  bearer,
  callback_url,
  metadata,
}) => {
  const options = {
    method: "POST",
    headers: getCommonHeaders(),
    body: JSON.stringify({
      email: email,
      amount: amount * 100,
      currency: currency,
      channels: channels,
      subaccount: subaccount,
      bearer: bearer,
      metadata: metadata,
      callback_url: callback_url,
    }),
  };

  try {
    const response = await fetch(`${url}/transaction/initialize`, options);
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const verifyPaystackTransaction = async ({ ref }) => {
  const options = {
    method: "GET",
    headers: getCommonHeaders(),
  };

  try {
    const response = await fetch(`${url}/transaction/verify/${ref}`, options);
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const getPaystackCustomer = async ({ email }) => {
  const options = {
    method: "GET",
    headers: getCommonHeaders(),
  };

  try {
    const response = await fetch(`${url}/customer/${email}`, options);
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const createPaystackCustomer = async ({
  email,
  firstName,
  lastName,
  phoneNumber,
}) => {
  const options = {
    method: "GET",
    headers: getCommonHeaders(),
    body: JSON.stringify({
      email: email,
      first_name: firstName,
      last_name: lastName,
      phone: phoneNumber,
    }),
  };

  try {
    const response = await fetch(`${url}/customer`, options);
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const createPaystackDva = async ({
  firstName,
  lastName,
  customerCode,
  preferredBank,
}) => {
  const options = {
    method: "POST",
    headers: getCommonHeaders(),
    body: JSON.stringify({
      first_name: firstName,
      last_name: lastName,
      customer: customerCode,
      preferred_bank: preferredBank,
    }),
  };

  try {
    const response = await fetch(`${url}/dedicated_account`, options);
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};
