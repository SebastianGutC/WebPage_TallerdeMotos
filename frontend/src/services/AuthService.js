import API from './Api';

export const registerUser = (data) => {
  return API.post('/auth/usuarios/register', data);
};

export const loginUser = (data) => {
  return API.post('/auth/usuarios/login', data);
};

export const logoutUser = () => {
  return API.post('/auth/usuarios/logout');
};