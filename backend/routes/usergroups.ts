
import CreateUsergroup from '../controllers/usergroups/create';
import ShowAllUsergroups from '../controllers/usergroups/show';
import UpdateUsergroupById from '../controllers/usergroups/update';
import GetSingleUsergroupById from '../controllers/usergroups/single';
import DeleteSingleUsergroupById from '../controllers/usergroups/delete';
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import {Router} from "express";
const route = Router();

//List all Usergroups
route.get(``, UserAuthMiddleware, ShowAllUsergroups);
//Create a new Usergroup
route.post(``, AdminAuthMiddleware, CreateUsergroup);
//Show info about a specific Usergroup
route.get(`/:id`, UserAuthMiddleware, GetSingleUsergroupById);
//Update a particular Usergroup
route.put(`/:id`, AdminAuthMiddleware, UpdateUsergroupById);
//Delete a particular Usergroup
route.delete(`/:id`, AdminAuthMiddleware, DeleteSingleUsergroupById);
export default route;