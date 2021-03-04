import ShowAllCategories from '../controllers/category/show';
import RefreshCategories from '../controllers/category/refresh';
import GetSingleCategoryById from '../controllers/category/single';
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