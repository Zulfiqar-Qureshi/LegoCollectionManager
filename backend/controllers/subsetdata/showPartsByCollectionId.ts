import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {collectionid: collectionid} = req.params;
    const showAll = `SELECT * FROM LegoSorterDB.parts_overview WHERE collection_id = ${collectionid} AND type = 'PART' ORDER BY part_no;`
    connection.query(showAll, (err, result) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching Subsetdata for collectionid',
            errorMessage: process.env.DEBUG && err
        });
        else {
            res.json(result);
        }
    })
}