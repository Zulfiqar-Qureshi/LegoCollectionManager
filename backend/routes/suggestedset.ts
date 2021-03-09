
import ShowAllSuggestedSetsByCollectionId from '../controllers/suggestedsets/showByCollectionId';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";

import {Router} from "express";
const route = Router();

//List suggested Sets by CollectionId
route.get(`/collection/:collectionid`, AdminAuthMiddleware, ShowAllSuggestedSetsByCollectionId);



export default route;