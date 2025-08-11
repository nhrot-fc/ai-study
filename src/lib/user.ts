import prisma from "./db";
import crypto from "crypto";
import {
  buildPageInfo,
  DateFilter,
  getPaginationArgs,
  PageParams,
  PageResult,
  StringFilter,
  UuidFilter,
} from "./types";

export type UserCreateDTO = {
  nickname: string;
  email: string;
  password: string;
};

export type UserUpdateDTO = {
  id: string;
  nickname?: string;
  password?: string;
};

export type UserReadDTO = {
  id: string;
  nickname: string;
  email: string;
  created_at: Date;
  updated_at: Date;
};

export type UserFilters = {
  id?: UuidFilter;
  nickname?: StringFilter;
  email?: StringFilter;
  created_at?: DateFilter;
  updated_at?: DateFilter;
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

const getUserById = async (id: string): Promise<UserReadDTO | null> => {
  return prisma.user.findUnique({ where: { id } });
};

const updateUser = async (data: UserUpdateDTO): Promise<UserReadDTO> => {
  const updateData: Record<string, string | boolean> = {};

  if (data.nickname !== undefined) updateData.nickname = data.nickname;
  if (data.password !== undefined)
    updateData.password_hash = await hashPassword(data.password);

  const user = await prisma.user.update({
    where: { id: data.id },
    data: updateData,
  });

  return user;
};

const deleteUser = async (id: string): Promise<UserReadDTO> => {
  const user = await prisma.user.delete({
    where: { id },
  });

  return user;
};

const simpleListUser = async (
  query_string: string,
  limit: number
): Promise<UserReadDTO[]> => {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { nickname: { contains: query_string } },
        { email: { contains: query_string } },
      ],
    },
    take: limit,
  });
  return users;
};

const getUsers = async (
  params?: PageParams
): Promise<PageResult<UserReadDTO>> => {
  const paginationArgs = getPaginationArgs(params);
  const [items, total] = await prisma.$transaction([
    prisma.user.findMany({
      ...paginationArgs,
    }),
    prisma.user.count(),
  ]);

  return {
    items,
    pageInfo: buildPageInfo(params, total),
  };
};

// Exportación de las funciones
export {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  simpleListUser,
  getUsers,
};
