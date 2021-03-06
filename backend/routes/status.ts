import CreateStatus from '../controllers/status/create';
import ShowAllStatus from '../controllers/status/show';
import UpdateStatusById from '../controllers/status/update';
import GetSingleStatusById from '../controllers/status/single';
import DeleteSingleStatusById from '../controllers/status/delete';
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import {Router} from "express";
const route = Router();

//List all Status
route.get(``, UserAuthMiddleware, ShowAllStatus);
//Create a new Status
route.post(``, AdminAuthMiddleware, CreateStatus);
//Show info about a specific Status
route.get(`/:id`, UserAuthMiddleware, GetSingleStatusById);
//Update a particular Status
route.put(`/:id`, AdminAuthMiddleware, UpdateStatusById);
//Delete a particular Status
route.delete(`/:id`, AdminAuthMiddleware, DeleteSingleStatusById);
export default route;