import DownloadSetData from '../controllers/setdata/download';
import ShowAllSetData from '../controllers/setdata/show';
import RefreshSetDataById from '../controllers/setdata/refresh';
import GetSingleSetDataById from '../controllers/setdata/single';
import DeleteSingleSetDataById from '../controllers/setdata/delete';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import {Router} from "express";
const route = Router();

//List all setDetails
route.get(``, UserAuthMiddleware, ShowAllSetData);
//Download a new setDetail
route.post(``, AdminAuthMiddleware, DownloadSetData);
//Show info about a setDetail
route.get(`/:id`, UserAuthMiddleware, GetSingleSetDataById);
//Refresh info of a particular setDetail
route.put(`/:id`, AdminAuthMiddleware, RefreshSetDataById);
//Delete a particular setDetail
route.delete(`/:id`, AdminAuthMiddleware, DeleteSingleSetDataById);

export default route;