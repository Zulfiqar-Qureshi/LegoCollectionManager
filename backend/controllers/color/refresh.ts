import { Console } from 'console';
import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import connection from "../../database_connection";
import {Token_encodeInterface} from '../middleware/token_encode.interface';

const blApi = require("../../config/bl.api.js");


export default (req: Request, res: Response) => {
    try {
        const {token} = req.cookies;

        //@ts-ignore
        jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded: Token_encodeInterface) => {
            const {username} = decoded;
            const findUserInDB = `SELECT * FROM Users WHERE username='${username}'`;
            connection.query(findUserInDB, (err, result: any) => {
                if (err) res.json({
                    code: 500,
                    message: 'Some Error Occurred!',
                    //@ts-ignore
                    errorMessage: process.env.DEBUG && err
                });
                else {
                    const {id} = result[0];
                    let colorsReplace = new Array();
                    blApi.bricklinkClient.send(blApi.Color.all())
                    .then(function(colors:any){
                        colors.forEach(function(color:any){
                            colorsReplace.push([
                                color.color_id,
                                color.color_name.replace("'"," "),
                                color.color_code,
                                color.color_type,
                                id])
                            });
                                colorsReplace.forEach(element => {
                                let InsertColors = `INSERT INTO Colors (
                                    color_id,
                                    color_name,
                                    color_code,
                                    color_type,
                                    createdBy)
                                    VALUES (
                                    ? )
                                     ON DUPLICATE KEY UPDATE id=id`; 
                                connection.query(InsertColors,[element], (err) => {
                                    if (err) {
                                        console.log(err)
                                        res.json({
                                        code: 500,
                                        message: 'Couldn\'t store downloaded Category.',
                                        errorMessage: process.env.DEBUG && err
                                    });}
                                });
                            }) 
                    res.json({
                        code: 100,
                        message: `Colors successfully downloaded!`,
                    });
                });
                
            }
        })
    })
    }   catch (e) {
        res.json({
            code: 500,
            message: 'Some error occurred',
            error: e
        });
    }
}