import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {id} = req.params;
    const deleteRecognisedImage = `DELETE FROM Recognisedimages WHERE id=${id};`
    connection.query(deleteRecognisedImage, (err, result) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while deleting recognisedimage',
            errorMessage: process.env.DEBUG && err
        });
        else {
            res.json(result);
        }
    })
}