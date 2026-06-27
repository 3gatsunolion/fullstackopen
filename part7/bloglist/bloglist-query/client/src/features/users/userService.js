import axios from "axios";
const baseUrl = "/api/users";

const getAll = async () => {
  const request = await axios.get(baseUrl);
  return request.data;
};

const get = async (id) => {
  const request = await axios.get(`${baseUrl}/${id}`);
  return request.data;
};

export default { getAll, get };
