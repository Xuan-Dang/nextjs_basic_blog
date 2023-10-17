import axios from "axios";
const instance = axios.create({
  baseURL: "http://localhost:3000/api",
});
instance.defaults.timeout = 3600;
// Thêm một bộ đón chặn request
instance.interceptors.request.use(
  function (config) {
    // Làm gì đó trước khi request dược gửi đi
    return config;
  },
  function (error) {
    // Làm gì đó với lỗi request
    return Promise.reject(error);
  }
);

// Thêm một bộ đón chặn response
instance.interceptors.response.use(
  function (response) {
    // Bất kì mã trạng thái nào nằm trong tầm 2xx đều khiến hàm này được trigger
    // Làm gì đó với dữ liệu response
    return response.data;
  },
  function (error) {
    // Bất kì mã trạng thái nào lọt ra ngoài tầm 2xx đều khiến hàm này được trigger\
    // Làm gì đó với lỗi response
    return Promise.reject(error.response.data);
  }
);
export async function getData(url, config) {
  return await instance.get(url, config);
}
export async function postData(url, data, config) {
  return await instance.post(url, data, config);
}
export async function deleteData(url, config) {
  return await instance.delete(url, config);
}
export async function putData(url, data, config) {
  return await instance.put(url, data, config);
}
