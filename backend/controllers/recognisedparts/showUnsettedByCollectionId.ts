import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {collectionid: collectionid} = req.params;
    const showRecognisedPartsByRunId = `
    SELECT PartNo, color_id, super_set_count FROM LegoSorterDB.unsetted_parts WHERE collection_id = ${collectionid}`
    connection.query(showRecognisedPartsByRunId, (err, result) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching recognised Image',
            errorMessage: process.env.DEBUG && err
        });
        else {
            res.json(result);
        }
    })
}