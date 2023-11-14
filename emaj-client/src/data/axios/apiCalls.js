import { apiRequest } from "./requestMethods"

export const loginRequest = async (user) => {
  try {
    const res = apiRequest.post("/auth/login", user);
    return res
  } catch (err) {
    return false
  }
};

export const checkEmail = async (email) => {
  try {
    const res = await apiRequest.post("/auth/check-email", email);
    return res
  } catch (err) {
    return err.response
  }
};

export const codeEmail = async (code) => {
  try {
    await apiRequest.post("/email/send-code", code);
    return true
  } catch (err) {
    return false
  }
};

export const modifyPassword = async (content) => {
  try {
    const res = await apiRequest.post("/auth/modify-password", content);
    return res
  } catch (err) {
    return false
  }
};

export const updateUser = async (user) => {
  try {
    const res = apiRequest.get(`/users/update${user.id}`);
    return res
  } catch (err) {
    return false
  }
};

export const getAllUsers = async () => {
  try {
    const res = apiRequest.get("/users/find-all");
    return res
  } catch (err) {
    return false
  }
};

export const addNewUser = async () => {
  try {
    const res = apiRequest.post("/users/add", newUserInfo);
    return res
  } catch (err) {
    return false
  }
};

export const deleteUser = async (id) => {
  try {
    const res = await apiRequest.delete(`/users/delete/${id}`);
    return res
  } catch (err) {
    return false
  }
};