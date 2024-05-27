import { User } from "../models/user";
import { fetchData } from "./fetch_data";

export async function getLoggedInUser(): Promise<User> {
  const response = await fetchData("/api/users", { method: "GET" });
  return response.json();
}

export interface GetUserParams {
  profileUsername: string;
}

export async function getUser(params: GetUserParams): Promise<User> {
  const response = await fetchData(`/api/users/${params.profileUsername}`, {
    method: "GET",
  });
  return response.json();
}

export interface SignUpParams {
  username: string;
  email: string;
  password: string;
}

export async function signUp(params: SignUpParams): Promise<User> {
  const response = await fetchData("/api/users/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  return response.json();
}

export interface LoginParams {
  username: string;
  password: string;
}

export async function login(params: LoginParams): Promise<User> {
  const response = await fetchData("/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  return response.json();
}

export async function logout() {
  await fetchData("/api/users/logout", { method: "POST" });
}
