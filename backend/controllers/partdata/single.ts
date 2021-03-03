import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {id} = req.params;
    const showOne = `SELECT * FROM Parts WHERE id=${id};`
    connection.query(showOne, (err, result) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching Partdata',
            errorMessage: process.env.DEBUG && err
        });
        else {
            res.json(result);
        }
    })
}