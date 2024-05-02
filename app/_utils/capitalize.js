const capitalize = (string) => {
  return string.replace(/(^|\p{P}|\p{Z}+)(\p{Ll})/gu, (match) => match.toUpperCase());
};

export default capitalize;
