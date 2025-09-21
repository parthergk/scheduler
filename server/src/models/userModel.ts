import { client } from "../database/connection";

interface User {
  id?: number;
  name: string;
  email: string;
  created_at?: Date;
  updated_at?: Date;
}

export const createUser = async (user: User): Promise<User> => {
  const [newUser] = await client("users").insert(user).returning("*");
  return newUser;
};

export const getUser = async (): Promise<User[]> => {
  const [user] = await client("users").select("*");
  return user;
};

export const getUserById = async (id: number): Promise<number | null> => {
  const [user] = await client("users").where({ id });
  return user || null;
};

export const updateUser = async (
  id: number,
  data: Partial<User>
): Promise<User | null> => {
  const [updatedUser] = await client("users")
    .where({ id })
    .update(data)
    .returning("*");
  return updatedUser || null;
};

export const deleteUser = async (id: number): Promise<void> => {
  await client("users").where({ id }).delete();
};
