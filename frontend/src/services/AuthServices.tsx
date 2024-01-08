import axios from "axios";
import { User} from "../models/User";
import { Login } from "../models/Login";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Cookies from 'universal-cookie';


export const RESP_API_BASE_URL = "http://localhost:8080/api/auth";
const LOGIN_EXPIRARY_TIME = 7*24*60*60;
const cookies = new Cookies(null, { path: '/' });

//Get Roles Api
export async function getAllRoles(){
  return await axios.get(`${RESP_API_BASE_URL}/roles`);
}

//Get Regular Users Api
export async function getAllRegularUsers(){
  return await axios.get(`${RESP_API_BASE_URL}/users`);
}


//Store and Get Login token
export const storeToken = (token: string) => cookies.set("token", token, {path: "/", maxAge: LOGIN_EXPIRARY_TIME});
export const getToken = () => cookies.get("token");


//Store User and Role
export const saveLoggedInUser = (username: string, role: string) => {
  cookies.set("authenticatedUser", username, {path: "/", maxAge: LOGIN_EXPIRARY_TIME});
  cookies.set("role", role, {path: "/", maxAge: LOGIN_EXPIRARY_TIME});
};


//Register Api
export async function registerUser( newUser: User){
    await axios.post(`${RESP_API_BASE_URL}/register`, newUser);
    const login: Login = {usernameOrEmail: newUser.username, password: newUser.password!};
    await loginUser(login);
}

//Login Api
export async function loginUser( login: Login){
  const recvToken =  await axios.post(`${RESP_API_BASE_URL}/login`, login);

  //Store JWT token, Role and user in cookies
  const token = 'Bearer ' + recvToken.data.accessToken;
  storeToken(token);
  saveLoggedInUser(login.usernameOrEmail, recvToken.data.role);
}


//Check,Authorize and Get Authentencated user
export const isUserLoggedIn = () => typeof cookies.get("token") !== "undefined";
export const isAdminUser = () =>  cookies.get("role") === "ROLE_ADMIN";
export const isRegUser = () =>  cookies.get("role") === "ROLE_USER";
export const getLoggedInUser = () => cookies.get("authenticatedUser");


//Logout Method
export const logoutUser = () => {
    cookies.remove("role");
    cookies.remove("authenticatedUser");
    cookies.remove("token");
}