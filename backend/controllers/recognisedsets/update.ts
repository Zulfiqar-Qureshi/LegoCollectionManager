import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import connection from "../../database_connection";
import {Token_encodeInterface} from '../middleware/token_encode.interface';

export default (req: Request, res: Response) => {
    try {
        const {token} = req.cookies;
        const {
            id,
            collectionid,
            setnumber,
            comments,
            instructions,
            condition,
            status
        } = req.body;

        if (
            collectionid &&
            setnumber &&
            instructions && 
            status) {
            //@ts-ignore
            jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded: Token_encodeInterface) => {
                const updateRecognisedSet = `UPDATE Recognisedsets SET collection_id = ${collectionid},
                                            setNo = '${setnumber}',
                                            comments = '${comments}',
                                            instructions = '${instructions}',
                                            Recognisedsets.condition = '${condition}',
                                            status = ${status}
                                            WHERE id=${id}`;
                console.log(updateRecognisedSet)
                connection.query(updateRecognisedSet, (err, result) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Couldn\'t updated the Recognisedsets',
                        error: err
                    });
                    else {
                        res.json({
                            code: 200,
                            message: 'Recognisedsets updated!'
                        });
                    }
                })
            })  
        } else {
            res.json({
                code: 400,
                message: 'collectionid, setnumber, status and instructions are required!'
            });
        }
    } catch (e) {
        res.json({
            code: 500,
            message: 'Some error occurred',
            error: e
        });
    }
}