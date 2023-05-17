import bcrypt from "bcrypt";

export const hashPassword = async (password: string) => {
  const saltRounds = 5;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const validatePassword = async (password: string, hash: string) =>
  await bcrypt.compare(password, hash);
