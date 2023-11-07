import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/api",
});
instance.defaults.timeout = 3600;
// Thêm một bộ đón chặn request
instance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    // Làm gì đó với lỗi request
    return Promise.reject(error);
  }
);
instance.interceptors.response.use(
  function (response) {
    // Bất kì mã trạng thái nào nằm trong tầm 2xx đều khiến hàm này được trigger
    // Làm gì đó với dữ liệu response
    console.log("response: ", response);
    return response?.data;
  },
  async function (error) {
    // Bất kì mã trạng thái nào lọt ra ngoài tầm 2xx đều khiến hàm này được trigger\
    // Làm gì đó với lỗi response
    console.log("error: ", error);
    if (error?.code === "ECONNABORTED")
      return Promise.reject({
        code: 400,
        message: "Yêu cầu hết hạn, vui lòng thử lại",
      });
    if (error?.response?.data) return Promise.reject(error.response.data);
  }
);
export async function getDataServerSide(url, config) {
  return await instance.get(url, config);
}
