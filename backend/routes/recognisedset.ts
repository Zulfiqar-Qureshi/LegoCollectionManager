import CreateSet from '../controllers/recognisedset/create';
import ShowAllSets from '../controllers/recognisedset/show';
import ShowAllSetsByCollectionId from '../controllers/recognisedset/showByCollectionId';
import UpdateSetById from '../controllers/recognisedset/update';
import GetSingleSetById from '../controllers/recognisedset/single';
import DeleteSingleSetById from '../controllers/recognisedset/delete';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import {Router} from "express";
const route = Router();

//List all sets
route.get(``, UserAuthMiddleware, ShowAllSets);
route.get(`/collectionid/:collectionid`, UserAuthMiddleware, ShowAllSetsByCollectionId);
//Create a new set
route.post(``, AdminAuthMiddleware, CreateSet);
//Show info about a set
route.get(`/:id`, UserAuthMiddleware, GetSingleSetById);
//Update a particular set
route.put(`/:id`, AdminAuthMiddleware, UpdateSetById);
//Delete a particular set
route.delete(`/:id`, AdminAuthMiddleware, DeleteSingleSetById);

export default route;