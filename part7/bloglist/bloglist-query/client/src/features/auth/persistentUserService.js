import blogService from "../blogs/blogService";

const LOGIN_LOCAL_STORAGE_KEY = "loggedBlogappUser";

const getUser = () => {
  const loggedUserJSON = window.localStorage.getItem(LOGIN_LOCAL_STORAGE_KEY);
  if (loggedUserJSON) {
    const currentUser = JSON.parse(loggedUserJSON);
    blogService.setToken(currentUser.token);
    delete currentUser.token;
    return currentUser;
  }
  return null;
};

const saveUser = (user) => {
  window.localStorage.setItem(LOGIN_LOCAL_STORAGE_KEY, JSON.stringify(user));
  blogService.setToken(user.token);
};

const removeUser = () => {
  window.localStorage.removeItem(LOGIN_LOCAL_STORAGE_KEY);
  blogService.setToken(null);
};

export default { getUser, saveUser, removeUser };
