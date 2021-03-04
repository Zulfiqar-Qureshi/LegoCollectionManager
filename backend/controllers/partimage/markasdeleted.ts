import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {id} = req.params;
    const markDeleted = `UPDATE Partimages SET deleted = NOW() WHERE id = ${id};`
    connection.query(markDeleted, (err, result) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while marking partimage as deleted',
            errorMessage: process.env.DEBUG && err
        });
        else {
            res.json(result);
        }
    })
}