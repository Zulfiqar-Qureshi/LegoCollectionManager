import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {runid: runid} = req.params;
    const showRecognisedImagesByRunId = `SELECT * FROM Recognisedimages ri
                                            LEFT JOIN Partimages pi ON ri.image_id = pi.id
                                            WHERE pi.run_id =  ${runid} `
    connection.query(showRecognisedImagesByRunId, (err, result) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching recognised Images',
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