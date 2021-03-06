import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {partid: partid} = req.params;
    const showRecognisedPartsByRunId = `SELECT * FROM Recognisedparts rp
                                            LEFT JOIN Recognisedimages ri ON ri.part_id = rp.id
                                            LEFT JOIN Partimages pi ON ri.image_id = pi.id
                                            WHERE ri.part_id =  ${partid} `
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