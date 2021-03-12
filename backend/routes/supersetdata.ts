import DownloadSupersetData from '../controllers/supersetdata/download';
import ShowAllSupersetData from '../controllers/supersetdata/show';
import ShowAllSupersetdataByPartNo from '../controllers/supersetdata/showPartsByPartNo';
import GetSingleSupersetDataById from '../controllers/supersetdata/single';
import DeleteSingleSupersetDataById from '../controllers/supersetdata/delete';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import {Router} from "express";
const route = Router();

//List all SupersetData
route.get(``, UserAuthMiddleware, ShowAllSupersetData);
//List SupersetData by partid
route.get(`/part/:partno/`, UserAuthMiddleware, ShowAllSupersetdataByPartNo);
//Download a new SupersetData
route.post(``, AdminAuthMiddleware, DownloadSupersetData);
//Show info about a SupersetData
route.get(`/:id`, UserAuthMiddleware, GetSingleSupersetDataById);
//Delete a particular SupersetData
route.delete(`/:id`, AdminAuthMiddleware, DeleteSingleSupersetDataById);

export default route;