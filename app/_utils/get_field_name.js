const getFieldName = (value, field) => {
  switch (field) {
    case "price":
      return value.price;
    case "name":
      return value.name;
    case "createdOn":
      return value.createdOn;
    default:
      return value.createdOn;
  }
};

export default getFieldName;
