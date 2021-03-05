import CreateRecognisedImage from '../controllers/recognisedimage/create';
import ShowAllRecognisedImages from '../controllers/recognisedimage/show';
import ShowAllRecognisedImagesByRunId from '../controllers/recognisedimage/showByRunId';
import ShowAllRecognisedImagesByPartId from '../controllers/recognisedimage/showByPartId';
import UpdateRecognisedImageById from '../controllers/recognisedimage/update';
import GetSingleRecognisedImageById from '../controllers/recognisedimage/single';
import DeleteSingleRecognisedImageById from '../controllers/recognisedimage/delete';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import {Router} from "express";
const route = Router();

//List all RecognisedImages
route.get(``, UserAuthMiddleware, ShowAllRecognisedImages);
//List all RecognisedImages by RunId
route.get(`/runid/:runid`, UserAuthMiddleware, ShowAllRecognisedImagesByRunId);
//List all RecognisedImages by PartId
route.get(`/partid/:partid`, UserAuthMiddleware, ShowAllRecognisedImagesByPartId);
//Create a new RecognisedImage
route.post(``, AdminAuthMiddleware, CreateRecognisedImage);
//Show info about a RecognisedImage
route.get(`/:id`, UserAuthMiddleware, GetSingleRecognisedImageById);
//Update a particular RecognisedImage
route.put(`/:id`, AdminAuthMiddleware, UpdateRecognisedImageById);
//Delete a particular RecognisedImage
route.delete(`/:id`, AdminAuthMiddleware, DeleteSingleRecognisedImageById);

export default route;