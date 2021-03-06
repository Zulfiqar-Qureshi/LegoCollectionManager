import CreateRecognisedImage from '../controllers/recognisedimages/create';
import ShowAllRecognisedImages from '../controllers/recognisedimages/show';
import ShowAllRecognisedImagesByRunId from '../controllers/recognisedimages/showByRunId';
import ShowAllRecognisedImagesByPartId from '../controllers/recognisedimages/showByPartId';
import UpdateRecognisedImageById from '../controllers/recognisedimages/update';
import GetSingleRecognisedImageById from '../controllers/recognisedimages/single';
import DeleteSingleRecognisedImageById from '../controllers/recognisedimages/delete';
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