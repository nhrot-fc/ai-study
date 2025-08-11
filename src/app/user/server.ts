"use server";

import {
  UserCreateDTO,
  UserUpdateDTO,
  UserReadDTO,
  createUser as dbCreateUser,
  getUserById as dbGetUserById,
  updateUser as dbUpdateUser,
  deleteUser as dbDeleteUser,
  simpleListUser as dbSimpleListUser,
  getUsers as dbGetUsers,
} from "@/lib/user";
import { PageParams, PageResult } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function createUser(data: UserCreateDTO): Promise<UserReadDTO> {
  const user = await dbCreateUser(data);
  revalidatePath("/user");
  return user;
}

export async function getUserById(id: string): Promise<UserReadDTO | null> {
  return dbGetUserById(id);
}

export async function updateUser(data: UserUpdateDTO): Promise<UserReadDTO> {
  const user = await dbUpdateUser(data);
  revalidatePath("/user");
  return user;
}

export async function deleteUser(id: string): Promise<UserReadDTO> {
  const user = await dbDeleteUser(id);
  revalidatePath("/user");
  return user;
}

export async function simpleListUser(
  query_string: string,
  limit: number
): Promise<UserReadDTO[]> {
  return dbSimpleListUser(query_string, limit);
}

export async function getUsers(
  params?: PageParams
): Promise<PageResult<UserReadDTO>> {
  return dbGetUsers(params);
}
