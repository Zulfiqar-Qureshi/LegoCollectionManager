import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {partid: partid} = req.params;
    const showRecognisedImagesByRunId = `SELECT * FROM Recognisedimages ri
                                            LEFT JOIN Partimages pi ON ri.image_id = pi.id
                                            WHERE ri.part_id =  ${partid} `
    connection.query(showRecognisedImagesByRunId, (err, result) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching recognised Image',
            errorMessage: process.env.DEBUG && err
        });
        else {
            res.json({
                code: 200,
                result
            });
        }
    })
}