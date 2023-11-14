import { apiRequest } from "./requestMethods"

export const loginRequest = async (user) => {
  try {
    const res = apiRequest.post("/auth/login", user);
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

export const getActivities = async (id) => {
  try {
    const res = await apiRequest.get(`/activity/find/${id}`);
    return res
  } catch (err) {
    return false
  }
}