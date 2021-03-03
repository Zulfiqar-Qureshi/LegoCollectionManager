import Login from '../controllers/users/login';
import CreateUser from '../controllers/users/create';
import ShowAllUsers from '../controllers/users/show';
import UpdateUsersById from '../controllers/users/update';
import GetSingleUserById from '../controllers/users/single';
import DeleteSingleUserById from '../controllers/users/delete';
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import {Router} from "express";
const route = Router();

//Login
route.post(`/login`, Login);
//List all Users
route.get(``, UserAuthMiddleware, ShowAllUsers);
//Create a new User
route.post(``, AdminAuthMiddleware, CreateUser);
//Show info about a specific User
route.get(`/:id`, UserAuthMiddleware, GetSingleUserById);
//Update a particular User
route.put(`/:id`, AdminAuthMiddleware, UpdateUsersById);
//Delete a particular User
route.delete(`/:id`, AdminAuthMiddleware, DeleteSingleUserById);
export default route;