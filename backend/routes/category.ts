import ShowAllCategories from '../controllers/categories/show';
import RefreshCategories from '../controllers/categories/refresh';
import GetSingleCategoryById from '../controllers/categories/single';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import {Router} from "express";
const route = Router();

//List all Categories
route.get(``, UserAuthMiddleware, ShowAllCategories);
//Show info about a Category
route.get(`/:id`, UserAuthMiddleware, GetSingleCategoryById);
//Refresh info of Categories
route.put(``, AdminAuthMiddleware, RefreshCategories);

export default route;