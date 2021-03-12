import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import connection from "../../database_connection";

interface RequestBody {
    username: string,
    password: string,
    remember?: string
}

export default (req: Request, res: Response)=>{
    const {
        username,
        password,
        remember
    }: RequestBody = req.body;

    if(username && password) {
        const sqlQuery = `SELECT groupname FROM LegoSorterDB.Users u
        LEFT JOIN Usergroups ug ON ug.id = u.usergroup
        WHERE username='${username}' AND password='${password}'`;
        console.log(sqlQuery)
        connection.query(sqlQuery, (err, result:any) => {
            if(err) res.json({
                code: 500,
                message: 'Query failed!'
            });
            else {
                if(result !== 'undefined' && result.length > 0){
                    const {groupname} = result[0];

                    /*
                    * Make sure that PRIVATE_KEY is present in the environment, otherwise token won't be
                    * generated!
                    */
                    //@ts-ignore
                    jwt.sign({username: username, type: groupname}, process.env.PRIVATE_KEY, (err1, token) => {
                        if(err1) res.json({
                            code: 500,
                            message: 'couldn\'t generate token'
                        });

                        else {
                            if (remember) {
                                res.cookie('token', token, {
                                    httpOnly: true,
                                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                                })
                                res.json({
                                    message: `login as ${groupname} successful`,
                                    code: 200
                                })
                            } else {
                                res.cookie('token', token, {
                                    httpOnly: true,
                                    maxAge: 2 * 60 * 60 * 1000 // 2 hours
                                })
                                res.json({
                                    message: `login as ${groupname} successful`,
                                    code: 200
                                })
                            }
                        }
                    })
                }else{
                    res.json({
                        code: 403,
                        message: 'Username or password invalid!'
                    });
                }

            }
        })
    } else {
        res.json({
            code: 400,
            message: 'Username and password is required!'
        });
    }



};