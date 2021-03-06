import CreatePartimage from '../controllers/partimages/create';
import ShowAllPartimages from '../controllers/partimages/show';
import ShowAllPartimagesByRunId from '../controllers/partimages/showByRunId';
import UpdatePartimageById from '../controllers/partimages/update';
import GetSinglePartimageById from '../controllers/partimages/single';
import DeleteSinglePartimageById from '../controllers/partimages/delete';
import MarkAsDeletedSinglePartimageById from '../controllers/partimages/markasdeleted';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import {Router} from "express";
const route = Router();

//List all Partimages
route.get(``, UserAuthMiddleware, ShowAllPartimages);
//List all sets by RunId
route.get(`/runid/:runid`, UserAuthMiddleware, ShowAllPartimagesByRunId);
//Create a new Partimage
route.post(``, AdminAuthMiddleware, CreatePartimage);
//Show info about a specific Partimage
route.get(`/:id`, UserAuthMiddleware, GetSinglePartimageById);
//Update a particular Partimage
route.put(`/:id`, AdminAuthMiddleware, UpdatePartimageById);
//Delete a particular Partimage
route.delete(`/:id`, AdminAuthMiddleware, DeleteSinglePartimageById);
route.lock(`/:id`, AdminAuthMiddleware, MarkAsDeletedSinglePartimageById);

export default route;