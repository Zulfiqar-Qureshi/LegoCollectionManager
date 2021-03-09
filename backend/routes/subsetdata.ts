import DownloadSubsetData from '../controllers/subsetdata/download';
import ShowAllSubsetData from '../controllers/subsetdata/show';
import ShowAllSubsetPartdataByCollectionId from '../controllers/subsetdata/showPartsByCollectionId';
import ShowAllSubseMinifigdataByCollectionId from '../controllers/subsetdata/showMinifigsByCollectionId';
import RefreshSubsetDataById from '../controllers/subsetdata/refresh';
import GetSingleSubsetDataById from '../controllers/subsetdata/single';
import DeleteSingleSubsetDataById from '../controllers/subsetdata/delete';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import {Router} from "express";
const route = Router();

//List all SubsetData
route.get(``, UserAuthMiddleware, ShowAllSubsetData);
//List expected Parts by CollectionId
route.get(`/collection/:collectionid/parts`, UserAuthMiddleware, ShowAllSubsetPartdataByCollectionId);
//List expected Parts by CollectionId
route.get(`/collection/:collectionid/minifigs`, UserAuthMiddleware, ShowAllSubseMinifigdataByCollectionId);
//Download a new SubsetData
route.post(``, AdminAuthMiddleware, DownloadSubsetData);
//Show info about a SubsetData
route.get(`/:id`, UserAuthMiddleware, GetSingleSubsetDataById);
//Refresh info of a particular SubsetData
route.put(`/:id`, AdminAuthMiddleware, RefreshSubsetDataById);
//Delete a particular SubsetData
route.delete(`/:id`, AdminAuthMiddleware, DeleteSingleSubsetDataById);

export default route;