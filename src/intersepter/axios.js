import { refreshAccessToken } from "api/user";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const baseUrl = "http://127.0.0.1:8000";
const baseApiUrl = "http://127.0.0.1:8000/api/";

// without authentication axios
const axiosWithoutAuthentication = axios.create({
    baseURL: baseApiUrl,
});

// with authentication axios
const getAccessToken = () => localStorage.getItem("accessToken");

const token = getAccessToken();

const axiosWithAuthentication = axios.create({
    baseURL: baseApiUrl,
});

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
    refreshSubscribers.push(cb);
};

const processQueue = (token) => {
    refreshSubscribers.forEach((cb) => {
        if (token) {
            cb(token);
        }
    });

    isRefreshing = false;
    refreshSubscribers = [];
};

const checkTokenExpired = (accessToken) => {
    const decodedToken = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000;

    const addOnMinute = 2;
    const newTime = decodedToken.exp + addOnMinute;
    return newTime < currentTime;
};

axiosWithAuthentication.interceptors.request.use(
    async (config) => {
        const accessToken = getAccessToken();

        return new Promise((resolve, reject) => {
            if (!accessToken) reject({ response: { status: 401 } });

            if (isRefreshing) {
                subscribeTokenRefresh((token) => {
                    config.headers.Authorization = `Bearer ${token}`;
                    resolve(config);
                });
            } else {
                let updatedToken = "";

                if (checkTokenExpired(accessToken)) {
                    isRefreshing = true;
                    refreshAccessToken()
                        .then((response) => {
                            updatedToken = response.data.access;

                            localStorage.setItem("accessToken", updatedToken);
                            localStorage.setItem(
                                "refreshToken",
                                response.data.refresh
                            );

                            config.headers.Authorization = `Bearer ${updatedToken}`;

                            processQueue(updatedToken);

                            resolve(config);
                        })
                        .catch((error) => {
                            if (accessToken) {
                                localStorage.clear();
                                window.location.href = "#/user/login/";
                            }
                        });
                } else {
                    config.headers.Authorization = `Bearer ${
                        updatedToken ? updatedToken : accessToken
                    }`;
                    resolve(config);
                }
            }
        });
    },

    (error) => Promise.reject(error)
);

export {
    token,
    baseUrl,
    baseApiUrl,
    checkTokenExpired,
    axiosWithAuthentication,
    axiosWithoutAuthentication,
};
