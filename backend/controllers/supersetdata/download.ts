import { Console } from 'console';
import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import connection from "../../database_connection";
import {Token_encodeInterface} from '../middleware/token_encode.interface';
import DownloadPartData from '../partdata/download';

const blApi = require("../../config/bl.api.js");


export default (req: Request, res: Response) => {
    try {
        const {token} = req.cookies;
        const {
            partnumber,
            colorid,
            refresh = 0
        } = req.body;

        if (partnumber && colorid) {
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
                        const findSubsetDataInDB = `SELECT * FROM SuperSets WHERE partNo='${partnumber}'  AND color_id =${colorid}`;

                        connection.query(findSubsetDataInDB, (err, subsetresult: any) => {
                            if (err) res.json({
                                code: 500,
                                message: 'Some Error Occurred!',
                                //@ts-ignore
                                errorMessage: process.env.DEBUG && err
                            });
                            else{
                                if(subsetresult !== 'undefined' && subsetresult.length > 0 && refresh == 0) res.json({
                                        code: 100,
                                        message: 'supersetdata was already downloaded!',
                                        //@ts-ignore
                                        errorMessage: process.env.DEBUG && err
                                    });
                                else{
                                    const {id: userid} = result[0];
                                    let supersetArray = new Array();
                                    blApi.bricklinkClient.getItemSuperset(blApi.ItemType.Part, partnumber,{
                                        color_id : colorid
                                    })
                                        .then(function(supersetData:any){
                                            supersetData.forEach(function(supersetDataEntry:any) {
                                                supersetDataEntry["entries"].forEach(function(entry:any){
                                                
                                                    supersetArray.push([
                                                        partnumber,
                                                        supersetDataEntry.color_id,
                                                        entry.item.no,
                                                        entry.item.name,
                                                        entry.item.type,
                                                        entry.item.category_id,
                                                        entry.quantity,
                                                        entry.appears_as,
                                                        userid
                                                    ])
                                                    //console.log(supersetArray)
                                                    supersetArray.forEach(element => {
                                                        const insertSubSetData = `INSERT INTO SuperSets (
                                                            partNo,
                                                            color_id,
                                                            setNo,
                                                            name,
                                                            type,
                                                            category_id,
                                                            quantity,
                                                            appears_as,
                                                            createdBy)
                                                            VALUES (
                                                                ? )
                                                            ON DUPLICATE KEY UPDATE id=id`;
                                                        connection.query(insertSubSetData,[element], (err) => {
                                                            if (err) 
                                                            res.json({
                                                                code: 500,
                                                                message: 'Couldn\'t downloaded and store SuperSetdata.',
                                                                errorMessage: process.env.DEBUG && err
                                                            });
                                                        })
                                                        
                                                       //Download Setdata here here
                                                       //DownloadPartData.call(this, (req:))


                                                    });
                                                });
                                            });
                                            if (refresh == 0)
                                            res.json({
                                                code: 201,
                                                message: 'SuperSetdata successfully downloaded!',
                                            });
                                            else
                                            res.json({
                                                code: 201,
                                                message: 'SuperSetdata successfully updated!',
                                            });
                                    });
                                }
                            }
                        });
                    }
                })
            })
        } else {
            res.json({
                code: 400,
                message: 'partnumber && colorid is required!'
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