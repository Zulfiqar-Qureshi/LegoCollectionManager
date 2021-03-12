import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {id} = req.params;
    const deleteType = `DELETE FROM Types WHERE id=${id};`
    connection.query(deleteType, (err, result) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while deleting Type',
            errorMessage: process.env.DEBUG && err
        });
        else {
            res.json(result);
        }
    })
}