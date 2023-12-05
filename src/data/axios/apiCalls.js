import { apiRequest } from "./requestMethods"

export const loginRequest = async (user) => {
  try {
    const res = await apiRequest.post("/auth/login", user);
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

export const updateUser = async (id, content) => {
  try {
    console.log(id, content)
    const res = await apiRequest.put(`/users/update/${id}`, content);
    return res
  } catch (err) {
    return false
  }
};

export const getAllUsers = async () => {
  try {
    const res = await apiRequest.get("/users/find-all");
    return res
  } catch (err) {
    return false
  }
};

export const getUser = async (id) => {
  try {
    const res = await apiRequest.get(`/users/find/${id}`);
    return res
  } catch (err) {
    return false
  }
}

export const getUpdatedUser = async (id) => {
  try {
    const res = await apiRequest.get(`/users/find-updated/${id}`);
    return res
  } catch (err) {
    return false
  }
}

export const addUser = async (newUser) => {
  try {
    const res = await apiRequest.post("/users/add-user", newUser);
    return res
  } catch (err) {
    return false
  }
};

export const deactivateUser = async (id) => {
  try {
    const res = await apiRequest.put(`/users/deactivate/${id}`);
    return res
  } catch (err) {
    return false
  }
};

export const activateUser = async (id) => {
  try {
    const res = await apiRequest.put(`/users/activate/${id}`);
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

export const updateUserImage = async (id, data) => {
  try {
    console.log(data)
    const res = await apiRequest.put(`/upload/user-image/${id}`, data);
    return res
  } catch (err) {
    return false
  }
};

export const deleteUserImage = async (id) => {
  try {
    const res = await apiRequest.delete(`/upload/user-image/${id}`);
    return res
  } catch (err) {
    return false
  }
};

export const addNewClient = async (newClient) => {
  try {
    const res = await apiRequest.post("/clients/add-client", newClient);
    return res
  } catch (err) {
    return false
  }
};

export const getAllClients = async () => {
  try {
    const res = await apiRequest.get("/clients/find-all");
    return res
  } catch (err) {
    return false
  }
};

export const deactivateClient = async (id) => {
  try {
    const res = await apiRequest.put(`/clients/deactivate/${id}`);
    return res
  } catch (err) {
    return false
  }
};

export const activateClient = async (id) => {
  try {
    const res = await apiRequest.put(`/clients/activate/${id}`);
    return res
  } catch (err) {
    return false
  }
};

export const deleteClient = async (id) => {
  try {
    const res = await apiRequest.delete(`/clients/delete/${id}`);
    return res
  } catch (err) {
    return false
  }
};

export const getClient = async (id) => {
  try {
    const res = await apiRequest.get(`/clients/find/${id}`);
    return res
  } catch (err) {
    return false
  }
}

export const updateClient = async (id, updateType, content) => {
  try {
    const res = await apiRequest.put(`/clients/update/${id}/${updateType}`, content);
    return res
  } catch (err) {
    return false
  }
};

export const getUpdatedClient = async (id) => {
  try {
    const res = await apiRequest.get(`/clients/find-updated/${id}`);
    return res
  } catch (err) {
    return false
  }
};

export const addDemand = async (content) => {
  try {
    const res = await apiRequest.post('/demands/add-demand', content);
    return res
  } catch (err) {
    return err
  }
};

export const updateDemand = async (id, content) => {
  try {
    console.log(content)
    const res = await apiRequest.put(`/demands/update/${id}`, content);
    return res
  } catch (err) {
    return false
  }
};

export const deleteDemand = async (id) => {
  try {
    const res = await apiRequest.delete(`/demands/delete/${id}`);
    return res
  } catch (err) {
    return false
  }
};

export const activateDemand = async (id) => {
  try {
    const res = await apiRequest.put(`/demands/delete/${id}`);
    return res
  } catch (err) {
    return false
  }
};

export const deactivateDemand = async (id) => {
  try {
    const res = await apiRequest.put(`/demands/delete/${id}`);
    return res
  } catch (err) {
    return false
  }
};

export const getAllDemands = async () => {
  try {
    const res = await apiRequest.get('/demands/find-all');
    return res
  } catch (err) {
    return false
  }
};

export const getOneDemand = async (id) => {
  try {
    const res = await apiRequest.get(`/demands/find/${id}`);
    return res
  } catch (err) {
    return false
  }
};

export const addDemandDocument = async (id, file) => {
  try {
    const res = await apiRequest.post(`/upload/demand-document/${id}`, file);
    return res
  } catch (err) {
    return false
  }
};

export const deleteDemandDocument = async (file) => {
  try {
    const res = await apiRequest.put('/upload/demand-document', file);
    return res
  } catch (err) {
    return false
  }
};


export const addUserOnDemand = async (content) => {
  try {
    const res = await apiRequest.post('/demands/add-user', content);
    return res
  } catch (err) {
    return false
  }
};

export const removeUserOnDemand = async (content) => {
  try {
    const res = await apiRequest.put('/demands/remove-user', content);
    return res
  } catch (err) {
    return false
  }
};

export const addClientOnDemand = async (content) => {
  try {
    const res = await apiRequest.post('/demands/add-client', content);
    return res
  } catch (err) {
    return false
  }
};

export const removeClientOnDemand = async (content) => {
  try {
    const res = await apiRequest.put('/demands/remove-client', content);
    return res
  } catch (err) {
    return false
  }
};