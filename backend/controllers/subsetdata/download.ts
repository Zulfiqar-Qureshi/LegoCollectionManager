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
            setnumber
        } = req.body;

        if (setnumber) {
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
                        const findSubsetDataInDB = `SELECT * FROM Subsets WHERE no='${setnumber}'`;

                        connection.query(findSubsetDataInDB, (err, subsetresult: any) => {
                            if (err) res.json({
                                code: 500,
                                message: 'Some Error Occurred!',
                                //@ts-ignore
                                errorMessage: process.env.DEBUG && err
                            });
                            else{
                                if(subsetresult !== 'undefined' && subsetresult.length > 0) res.json({
                                        code: 100,
                                        message: 'subsetdata information was already downloaded!',
                                        //@ts-ignore
                                        errorMessage: process.env.DEBUG && err
                                    });
                                else{
                                    const {id: userid} = result[0];
                                    let subsetArray = new Array();
                                    blApi.bricklinkClient.getItemSubset(blApi.ItemType.Set, setnumber + "-1", {break_minifigs: false})
                                        .then(function(subsetData:any){
                                            subsetData.forEach(function(subsetdataEntry:any) {
                                                subsetdataEntry["entries"].forEach(function(entry:any){
                                                
                                                    subsetArray.push([
                                                        setnumber,
                                                        subsetdataEntry.match_no,
                                                        entry.item.no,
                                                        entry.item.name,
                                                        entry.item.type,
                                                        entry.item.category_id,
                                                        entry.color_id,
                                                        entry.quantity,
                                                        entry.extra_quantity,
                                                        entry.is_alternate,
                                                        entry.is_counterpart,
                                                        userid
                                                    ])
                                                    console.log(subsetArray)
                                                    subsetArray.forEach(element => {
                                                        const insertSubSetData = `INSERT INTO Subsets (
                                                            setNo,
                                                            match_no,
                                                            no,
                                                            name,
                                                            type,
                                                            category_id,
                                                            color_id,
                                                            quantity,
                                                            extra_quantity,
                                                            is_alternate,
                                                            is_counterpart,
                                                            createdBy)
                                                            VALUES (
                                                                ? )
                                                            ON DUPLICATE KEY UPDATE id=id`;
                                                        connection.query(insertSubSetData,[element], (err) => {
                                                            if (err) 
                                                            res.json({
                                                                code: 500,
                                                                message: 'Couldn\'t store downloaded Subsetdata.',
                                                                errorMessage: process.env.DEBUG && err
                                                            });
                                                        })
                                                        
                                                       //Download Partdata here
                                                       //DownloadPartData.call(this, (req:))


                                                    });
                                                });
                                            });
                                            res.json({
                                                code: 100,
                                                message: 'Subsetdata successfully downloaded!',
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
                code: 500,
                message: 'Setnumber is required!'
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