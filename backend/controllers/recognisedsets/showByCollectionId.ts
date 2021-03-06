import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {collectionid} = req.params;
    const showRecognisedSetsByCollectionId = `SELECT *
                                FROM Recognisedsets WHERE collection_id = ${collectionid} `
    connection.query(showRecognisedSetsByCollectionId, (err, result) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching recognised Sets',
            errorMessage: process.env.DEBUG && err
        });
        else {
            res.json(result);
        }
    })
}