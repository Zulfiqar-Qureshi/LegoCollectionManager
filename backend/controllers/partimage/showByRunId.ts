import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {runid} = req.params;
    const showAllPartimagesByRunId = `SELECT *
                                FROM Partimages WHERE run_id = ${runid} ORDER BY created, size_kb;`
    connection.query(showAllPartimagesByRunId, (err, result) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching Partimages',
            errorMessage: process.env.DEBUG && err
        });
        else {
            res.json(result);
        }
    })
}