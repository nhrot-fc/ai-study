import prisma from "./db";
import crypto from "crypto";
// =======================
// User DTOs
// =======================
export type UserCreateDTO = {
  nickname: string;
  email: string;
  password: string;
};

export type UserUpdateDTO = {
  id: string;
  nickname?: string;
  email?: string;
  password?: string;
  email_verified?: boolean;
};

export type UserReadDTO = {
  id: string;
  nickname: string;
  email: string;
  created_at: Date;
  updated_at: Date;
};

const hashPassword = async (password: string): Promise<string> => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

const createUser = async (data: UserCreateDTO): Promise<UserReadDTO> => {
  const user = await prisma.user.create({
    data: {
      nickname: data.nickname,
      email: data.email,
      password_hash: await hashPassword(data.password),
    },
  });
  return user;
};
