export const toNGN = (amount) => {
  const currency = new Intl.NumberFormat("en-Ng", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
  return currency;
};
