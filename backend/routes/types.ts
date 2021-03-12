
import CreateType from '../controllers/types/create';
import ShowAllTypes from '../controllers/types/show';
import UpdateTypeById from '../controllers/types/update';
import GetSingleTypeById from '../controllers/types/single';
import DeleteSingleTypeById from '../controllers/types/delete';
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import {Router} from "express";
const route = Router();

//List all Types
route.get(``, UserAuthMiddleware, ShowAllTypes);
//Create a new Types
route.post(``, AdminAuthMiddleware, CreateType);
//Show info about a specific Type
route.get(`/:id`, UserAuthMiddleware, GetSingleTypeById);
//Update a particular Type
route.put(`/:id`, AdminAuthMiddleware, UpdateTypeById);
//Delete a particular Type
route.delete(`/:id`, AdminAuthMiddleware, DeleteSingleTypeById);
export default route;