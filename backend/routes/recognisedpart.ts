import CreateRecognisedPart from '../controllers/recognisedparts/create';
import ShowAllRecognisedParts from '../controllers/recognisedparts/show';
import ShowAllRecognisedPartsByRunId from '../controllers/recognisedparts/showByRunId';
import ShowAllRecognisedPartsByPartId from '../controllers/recognisedparts/showByPartId';
import ShowAllUnsettedRecognisedPartsByCollectionId from '../controllers/recognisedparts/showUnsettedByCollectionId';

import UpdateRecognisedPartById from '../controllers/recognisedparts/update';
import GetSingleRecognisedPartById from '../controllers/recognisedparts/single';
import DeleteSingleRecognisedPartById from '../controllers/recognisedparts/delete';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import {Router} from "express";
const route = Router();

//List all RecognisedParts
route.get(``, UserAuthMiddleware, ShowAllRecognisedParts);
//List all RecognisedParts by RunId
route.get(`/runid/:runid`, UserAuthMiddleware, ShowAllRecognisedPartsByRunId);
//List all RecognisedParts by PartId
route.get(`/part/:partid`, UserAuthMiddleware, ShowAllRecognisedPartsByPartId);

route.get(`/collection/:collectionid/unsetted`, UserAuthMiddleware, ShowAllUnsettedRecognisedPartsByCollectionId);
//Create a new RecognisedPart
route.post(``, AdminAuthMiddleware, CreateRecognisedPart);
//Show info about a RecognisedPart
route.get(`/:id`, UserAuthMiddleware, GetSingleRecognisedPartById);
//Update a particular RecognisedPart
route.put(`/:id`, AdminAuthMiddleware, UpdateRecognisedPartById);
//Delete a particular RecognisedPart
route.delete(`/:id`, AdminAuthMiddleware, DeleteSingleRecognisedPartById);

export default route;