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
                    let categoriesReplace = new Array();
                    blApi.bricklinkClient.send(blApi.Category.all())
                    .then(function(categories:any){
                        categories.forEach(function(category:any){
                            categoriesReplace.push([
                                category.category_id,
                                category.category_name.replace("'"," "),
                                category.parent_id,
                                id])
                            });
                                categoriesReplace.forEach(element => {
                                let createCategories = `INSERT INTO Categories (
                                    category_id,
                                    category_name,
                                    parent_id,
                                    createdBy)
                                    VALUES (
                                    ? )
                                     ON DUPLICATE KEY UPDATE id=id`; 
                                connection.query(createCategories,[element], (err) => {
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
                        code: 201,
                        message: `Categories successfully downloaded!`,
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