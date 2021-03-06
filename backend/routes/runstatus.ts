
import CreateRunStatus from '../controllers/runstatus/create';
import ShowAllRunStatus from '../controllers/runstatus/show';
import UpdateRunStatusById from '../controllers/runstatus/update';
import GetSingleRunStatusById from '../controllers/runstatus/single';
import DeleteSingleRunStatusById from '../controllers/runstatus/delete';
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import {Router} from "express";
const route = Router();

//List all RunStatus
route.get(``, UserAuthMiddleware, ShowAllRunStatus);
//Create a new RunStatus
route.post(``, AdminAuthMiddleware, CreateRunStatus);
//Show info about a specific RunStatus
route.get(`/:id`, UserAuthMiddleware, GetSingleRunStatusById);
//Update a particular RunStatus
route.put(`/:id`, AdminAuthMiddleware, UpdateRunStatusById);
//Delete a particular RunStatus
route.delete(`/:id`, AdminAuthMiddleware, DeleteSingleRunStatusById);

export default route;