import Express, { Application } from 'express';
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from 'cors';
import connection from "./database_connection";
import dotenv from 'dotenv';
const app: Application = Express();


/*
* Importing Routes
*/
import user from "./routes/user";
import collection from "./routes/collection";

import setdata from "./routes/setdata";
import partdata from "./routes/partdata";
import category from "./routes/category";
import color from "./routes/color";
import partimage from "./routes/partimage";
import pricedata from "./routes/pricedata";
import recognisedset from "./routes/recognisedset";
import recognisedimage from "./routes/recognisedimage";
import recognisedpart from "./routes/recognisedpart";
import run from "./routes/run";
import runstatus from "./routes/runstatus";
import sorter from "./routes/sorter";
import status from "./routes/status";


/*
* Initializing Middlewares
*/
dotenv.config();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

/*
* Middleware Routes
*/
app.use('/users', user);
app.use('/collections', collection);
app.use('/setdata', setdata);
app.use('/partdata', partdata);
app.use('/categories', category);
app.use('/colors', color);
app.use('/partimages', partimage);
app.use('/pricedata', pricedata);
app.use('/recognisedsets', recognisedset);
app.use('/recognisedimages', recognisedimage);
app.use('/recognisedparts', recognisedpart);
app.use('/runs', run);
app.use('/runstatus', runstatus);
app.use('/sorters', sorter);
app.use('/status', status);


const PORT = process.env.PORT || 4000;
connection.getConnection((err) => {
    if(err) throw err;
    app.listen(PORT, () => {
        console.log(`Server started, PORT: ${PORT}`);
        console.log(`Connected to DB`)
    });
})

