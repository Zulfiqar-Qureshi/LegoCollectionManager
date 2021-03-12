import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import {Token_encodeInterface} from "./token_encode.interface";

export default (req: Request, res: Response, next: NextFunction)=>{
    const {token} = req.cookies;
    try{
        //@ts-ignore
        jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded: Token_encodeInterface) => {
            if(err){
                res.json({
                    code: 403,
                    message: 'Invalid Token'
                });
            } else {
                if(decoded.type == "admin") {
                    next();
                } else {
                    res.json({
                        code: 403,
                        message: 'This token was not signed for admin.'
                    });
                }
            }
        })
    } catch (e) {
        res.json({
            code: 500,
            message: 'Some error occurred'
        });
    }
}