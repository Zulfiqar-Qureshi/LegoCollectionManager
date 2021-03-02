/*
* Routes that a logged in user, as we as an admin can query.
*/
import {Router} from "express";
const route = Router();
import UserAuthMiddleware from '../controllers/users/UserAuth.middleware';
import Login from '../controllers/users/login';
import CreateCollection from '../controllers/users/collection.create';
import ShowAllCollections from '../controllers/users/collection.show';
import UpdateCollectionById from '../controllers/users/collection.update';
import GetSingleCollectionById from '../controllers/users/collection.single';
import AdminAuthMiddleware from "../controllers/users/AdminAuth.middleware";

route.post(`/login`, Login);

route.post(`/create/collection`, AdminAuthMiddleware, CreateCollection);

route.get(`/show/all/collections`, UserAuthMiddleware, ShowAllCollections);

route.post(`/update/collection`, UserAuthMiddleware, UpdateCollectionById);

route.get('/show/collection/:collectionId', UserAuthMiddleware, GetSingleCollectionById);

export default route;