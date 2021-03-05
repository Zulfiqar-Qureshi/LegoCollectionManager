import DownloadPricedata from '../controllers/pricedata/download';
import ShowAllPricedata from '../controllers/pricedata/show';
import RefreshPriceDataById from '../controllers/pricedata/refresh';
import RefreshAllPriceData from '../controllers/pricedata/refreshall';
import GetSinglePricedataById from '../controllers/pricedata/single';
import DeleteSinglePriceDataById from '../controllers/pricedata/delete';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import {Router} from "express";
const route = Router();

//List all Pricedata
route.get(``, UserAuthMiddleware, ShowAllPricedata);
//Create a new Pricedata
route.post(``, AdminAuthMiddleware, DownloadPricedata);
//Show info about a Pricedata
route.get(`/:id`, UserAuthMiddleware, GetSinglePricedataById);
//Refresh a particular Pricedata
route.put(`/:id`, AdminAuthMiddleware, RefreshAllPriceData);
//Refresh all Pricedata
route.put(`/all`, AdminAuthMiddleware, RefreshPriceDataById);
//Delete a particular Pricedata
route.delete(`/:id`, AdminAuthMiddleware, DeleteSinglePriceDataById);

export default route;