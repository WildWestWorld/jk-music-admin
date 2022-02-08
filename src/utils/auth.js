
//需要安装依赖js-cookie
//目的：把token放在cookie里面，让他能持久使用
import Cookies from 'js-cookie';

const TokenKey = 'jk-token';
const UserKey = 'current-user';

const defaultUser = {
    username: null,
    nickname: null,
    roles: []
};

//获取token
export const getToken = () => {
    return Cookies.get(TokenKey);
};
//设置token
export const setToken = token => {
    return Cookies.set(TokenKey, token);
};

export const removeToken = () => {
    Cookies.remove(TokenKey);
};


//获得当前用户
export const setCurrentUser = currentUser => {
    return Cookies.set(UserKey, JSON.stringify(currentUser));
};

export const getCurrentUser = () => {
    const user = Cookies.get(UserKey);

    return user === undefined ? null : JSON.parse(user);
};

export const removeCurrentUser = () => {
    Cookies.remove(UserKey);
};