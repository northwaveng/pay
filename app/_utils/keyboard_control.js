export const intFloatOnly = (e) => {
  const allowedChars = /^[0-9.]+$/;
  if (
    e.key === "Backspace" ||
    e.key === "Delete" ||
    (e.key === "a" && (e.metaKey || e.ctrlKey)) ||
    e.key.includes("Arrow")
  ) {
    return;
  }
  if (!allowedChars.test(e.key)) e.preventDefault();
};

export const intOnly = (e) => {
  const allowedChars = /^[0-9.]+$/;
  if (
    e.key === "Backspace" ||
    e.key === "Delete" ||
    (e.key === "a" && (e.metaKey || e.ctrlKey)) ||
    e.key.includes("Arrow")
  ) {
    return;
  }
  if (!allowedChars.test(e.key)) e.preventDefault();
  if (e.key === ".") e.preventDefault();
};
