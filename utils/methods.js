import { hash, verify, argon2id } from "argon2";

export const hashPassword = async (password) => {
  return await hash(password, {
    type: argon2id,
    timeCost: 2,
    memoryCost: 2 ** 15,
    parallelism: 1,
  });
};

export const verifyPassword = async (hashValue, plainPassword) => {
  return await verify(hashValue, plainPassword);
};
