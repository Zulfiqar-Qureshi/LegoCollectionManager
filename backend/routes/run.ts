
import CreateRun from '../controllers/runs/create';
import ShowAllRuns from '../controllers/runs/show';
import ShowAllRunsByCollectionId from '../controllers/runs/showbycollectionid';
import UpdateRunsById from '../controllers/runs/update';
import GetSingleRunById from '../controllers/runs/single';
import DeleteSingleRunById from '../controllers/runs/delete';
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import {Router} from "express";
const route = Router();

//List all Runs
route.get(``, UserAuthMiddleware, ShowAllRuns);
//List all Runs by collectionid
route.get(`/collectionid/:collectionid`, UserAuthMiddleware, ShowAllRunsByCollectionId);
//Create a new Run
route.post(``, AdminAuthMiddleware, CreateRun);
//Show info about a specific Run
route.get(`/:id`, UserAuthMiddleware, GetSingleRunById);
//Update a particular Run
route.put(`/:id`, AdminAuthMiddleware, UpdateRunsById);
//Delete a particular Run
route.delete(`/:id`, AdminAuthMiddleware, DeleteSingleRunById);
export default route;