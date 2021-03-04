import CreatePartimage from '../controllers/partimage/create';
import ShowAllPartimages from '../controllers/partimage/show';
import ShowAllPartimagesByRunId from '../controllers/partimage/showByRunId';
import UpdatePartimageById from '../controllers/partimage/update';
import GetSinglePartimageById from '../controllers/partimage/single';
import DeleteSinglePartimageById from '../controllers/partimage/delete';
import MarkAsDeletedSinglePartimageById from '../controllers/partimage/markasdeleted';
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