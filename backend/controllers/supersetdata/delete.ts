import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {id} = req.params;
    const deleteSubsetdata = `DELETE FROM SuperSets WHERE id=${id};`
    connection.query(deleteSubsetdata, (err, result) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while deleting Superset',
            errorMessage: process.env.DEBUG && err
        });
        else {
            res.json(result);
        }
    })
}