import { publicRequest, adminRequest } from "./requestMethods"

export const loginRequest = async (user) => {
  try {
    const res = publicRequest.post("/auth/login", user);
    return res
  } catch (err) {
    return false
  }
};

export const getAllUsers = async () => {
  try {
    const res = adminRequest.get("/users/find-all");
    return res
  } catch (err) {
    return false
  }
};