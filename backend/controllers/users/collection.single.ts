import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {collectionId} = req.params;
    const showAllCollections = `SELECT * FROM Collections WHERE id=${collectionId};`
    connection.query(showAllCollections, (err, result) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching collections',
            errorMessage: process.env.DEBUG && err
        });
        else {
            res.json(result);
        }
    })
}