import CreateCollection from '../controllers/collection/create';
import ShowAllCollections from '../controllers/collection/show';
import UpdateCollectionById from '../controllers/collection/update';
import GetSingleCollectionById from '../controllers/collection/single';
import DeleteSingleCollectionById from '../controllers/collection/delete';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import {Router} from "express";
const route = Router();

//List all Collections
route.get(``, UserAuthMiddleware, ShowAllCollections);
//Create a new Collection
route.post(``, AdminAuthMiddleware, CreateCollection);
//Show info about a specific collection
route.get(`/:id`, UserAuthMiddleware, GetSingleCollectionById);
//Update a particular collection
route.put(`/:id`, AdminAuthMiddleware, UpdateCollectionById);
//Delete a particular collection
route.delete(`/:id`, AdminAuthMiddleware, DeleteSingleCollectionById);

export default route;