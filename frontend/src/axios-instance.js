import axios from "axios";

const getAxiosClient = async () => {
  const token = localStorage.getItem("sb-access-token");

  const instance = axios.create({
    baseURL: "http://localhost:8080", // add baseURL if you want
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return instance;
};

export default getAxiosClient;
