import bcryptjs from "bcryptjs";

const hashPassword = async (password) => {
  const newPassword = await bcryptjs.hash(password, 12);
  return newPassword;
};

const comparePassword = async (hashedpassword, password) => {
  const isCorrect = await bcryptjs.compare(password, hashedpassword);
  return isCorrect;
};

export { hashPassword, comparePassword };
