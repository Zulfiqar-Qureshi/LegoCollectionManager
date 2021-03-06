import CreateSorter from '../controllers/sorters/create';
import ShowAllSorters from '../controllers/sorters/show';
import UpdateSorterById from '../controllers/sorters/update';
import GetSingleSorterById from '../controllers/sorters/single';
import DeleteSingleSorterById from '../controllers/sorters/delete';
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import {Router} from "express";
const route = Router();

//List all Sorter
route.get(``, UserAuthMiddleware, ShowAllSorters);
//Create a new Sorter
route.post(``, AdminAuthMiddleware, CreateSorter);
//Show info about a specific Sorter
route.get(`/:id`, UserAuthMiddleware, GetSingleSorterById);
//Update a particular Sorter
route.put(`/:id`, AdminAuthMiddleware, UpdateSorterById);
//Delete a particular Sorter
route.delete(`/:id`, AdminAuthMiddleware, DeleteSingleSorterById);
export default route;