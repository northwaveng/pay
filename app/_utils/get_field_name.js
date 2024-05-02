const getFieldName = (value, field) => {
  switch (field) {
    case "price":
      return value.price;
    case "name":
      return value.name;
    case "totalPrice":
      return value.totalPrice;
    case "createdOn":
      return value.createdOn;
    case "totalOrders":
      return value.totalOrders;
    case "totalSpent":
      return value.totalSpent;
    default:
      return value.createdOn;
  }
};

export default getFieldName;
