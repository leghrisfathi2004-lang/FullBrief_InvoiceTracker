import API from "./configAPI";

export const getDashboard = () => {
  return API.get("/dashboard");
};
