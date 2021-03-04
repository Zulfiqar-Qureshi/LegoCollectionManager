import ShowAllColors from '../controllers/color/show';
import RefreshColors from '../controllers/color/refresh';
import GetSingleColorById from '../controllers/color/single';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import {Router} from "express";
const route = Router();

//List all Colors
route.get(``, UserAuthMiddleware, ShowAllColors);
//Show info about a Color
route.get(`/:id`, UserAuthMiddleware, GetSingleColorById);
//Refresh info of Colors
route.put(``, AdminAuthMiddleware, RefreshColors);

export default route;