/*
* Routes that a logged in user, as we as an admin can query.
*/
import {Router} from "express";
const route = Router();

import Login from '../controllers/users/login';


route.post(`/login`, Login);

export default route;