import axios from "axios";
import mem from "mem";

const instance = axios.create({
  baseURL: "http://localhost:3000/api",
});

const refreshTokenFn = async () => {
  const refreshToken = JSON.parse(localStorage.getItem("rf_token"));

  try {
    const response = await instance.post("/auth/refresh-token", {
      refreshToken: refreshToken ? refreshToken : null,
    });

    const { user } = response;

    if (!user.accessToken) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("rf_token");
      localStorage.removeItem("is_login");
    }
    return user;
  } catch (error) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("rf_token");
    localStorage.removeItem("is_login");
  }
};

const memoizedRefreshToken = mem(refreshTokenFn, {
  maxAge: 10000,
});

instance.defaults.timeout = 3600;
// Thêm một bộ đón chặn request
instance.interceptors.request.use(
  function (config) {
    const accessToken = JSON.parse(localStorage?.getItem("access_token"));
    if (accessToken)
      config.headers = { ...config.headers, Authorization: accessToken };
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
  async function (error) {
    // Bất kì mã trạng thái nào lọt ra ngoài tầm 2xx đều khiến hàm này được trigger\
    // Làm gì đó với lỗi response
    const config = error.config;
    if (error?.response?.data?.message === "jwt expired" && !config?.sent) {
      config.sent = true;

      const result = await memoizedRefreshToken();

      if (result?.accessToken) {
        localStorage.setItem(
          "access_token",
          JSON.stringify(result?.accessToken)
        );
        config.headers = {
          ...config.headers,
          authorization: `${result?.accessToken}`,
        };
      }

      return axios(config);
    }
    if (error?.response?.data?.message === "rf_token expired") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("rf_token");
      localStorage.removeItem("is_login");
      return Promise.reject({
        code: 400,
        message: "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại",
      });
    }
    if (error?.code === "ECONNABORTED")
      return Promise.reject({
        code: 400,
        message: "Yêu cầu hết hạn, vui lòng thử lại",
      });
    if (error?.response?.data) return Promise.reject(error.response.data);
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
export async function patchData(url, data, config) {
  return await instance.patch(url, data, config);
}
