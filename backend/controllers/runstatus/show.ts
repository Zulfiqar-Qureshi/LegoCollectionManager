import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const showAll = `SELECT * FROM RunStatus;`
    connection.query(showAll, (err, result) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching RunStatus',
            errorMessage: process.env.DEBUG && err
        });
        else {
            res.json(result);
        }
    })
}