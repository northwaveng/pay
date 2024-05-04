import { toast } from "react-toastify";

const copyToClipboard = (text, success) => {
  navigator.clipboard
    .writeText(text)
    .then(() => toast.dark(success))
    .catch((e) => {
      toast.dark(`Failed to copy: ${e}`, {
        className: "text-danger",
      });
    });
};

export default copyToClipboard;
