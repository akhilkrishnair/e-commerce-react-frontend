import { refreshAccessToken } from "api/user";
import { checkTokenExpired } from "intersepter/axios";

let isRefreshingToken = false;

const checkToken = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken && checkTokenExpired(accessToken)) {
        isRefreshingToken = true;
        await refreshAccessToken()
            .then((response) => {
                localStorage.setItem("accessToken", response.data.access);
                localStorage.setItem("refreshToken", response.data.refresh);
                isRefreshingToken = false;
            })
            .catch((error) => {
                isRefreshingToken = false;
            });
    }
};

export { checkToken, isRefreshingToken };
