import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {id} = req.params;
    const deletePartdata = `DELETE FROM Parts WHERE id=${id};`
    connection.query(deletePartdata, (err, result) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while deleting PartData',
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