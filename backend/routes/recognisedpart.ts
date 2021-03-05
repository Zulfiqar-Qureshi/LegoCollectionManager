import CreateRecognisedPart from '../controllers/recognisedpart/create';
import ShowAllRecognisedParts from '../controllers/recognisedpart/show';
import ShowAllRecognisedPartsByRunId from '../controllers/recognisedpart/showByRunId';
import ShowAllRecognisedPartsByPartId from '../controllers/recognisedpart/showByPartId';
import UpdateRecognisedPartById from '../controllers/recognisedpart/update';
import GetSingleRecognisedPartById from '../controllers/recognisedpart/single';
import DeleteSingleRecognisedPartById from '../controllers/recognisedpart/delete';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import {Router} from "express";
const route = Router();

//List all RecognisedParts
route.get(``, UserAuthMiddleware, ShowAllRecognisedParts);
//List all RecognisedParts by RunId
route.get(`/runid/:runid`, UserAuthMiddleware, ShowAllRecognisedPartsByRunId);
//List all RecognisedParts by PartId
route.get(`/partid/:partid`, UserAuthMiddleware, ShowAllRecognisedPartsByPartId);
//Create a new RecognisedPart
route.post(``, AdminAuthMiddleware, CreateRecognisedPart);
//Show info about a RecognisedPart
route.get(`/:id`, UserAuthMiddleware, GetSingleRecognisedPartById);
//Update a particular RecognisedPart
route.put(`/:id`, AdminAuthMiddleware, UpdateRecognisedPartById);
//Delete a particular RecognisedPart
route.delete(`/:id`, AdminAuthMiddleware, DeleteSingleRecognisedPartById);

export default route;