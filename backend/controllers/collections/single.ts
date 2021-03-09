import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {id: collectionid} = req.params;
    const showAllCollections = `SELECT * FROM Collections WHERE id=${collectionid};`
    connection.query(showAllCollections, (err, generalproperties:any) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching collections',
            errorMessage: process.env.DEBUG && err
        });
        else {
            const sumQuery = `SELECT 
            COUNT(no) as allSetsCount,
            SUM(weight_g) as allSetsSumWeight, 
            SUM(complete_part_count) as allSetsSumPartCount,
            SUM(complete_minifigs_count) as allSetsSumMinifigsCount,
            SUM(min_price) as allSetsSumMinPrice,
            SUM(avg_price) as allSetsSumAvgPrice
            FROM LegoSorterDB.Recognisedsets rs
            LEFT JOIN LegoSorterDB.Sets s ON rs.setno = s.no
            WHERE rs.collection_id = ${collectionid}`
            connection.query(sumQuery, (err, summarizedResults:any) => {
                if (err) res.json({
                    code: 500,
                    message: 'Some error occurred while fetching recognised Sets summary',
                    errorMessage: process.env.DEBUG && err
                });

                const uniquePartsQuery = `SELECT COUNT(*) as allSetsUniquePartCount FROM (
                    SELECT COUNT(*) as count, ss.no FROM LegoSorterDB.Recognisedsets rs
                    LEFT JOIN LegoSorterDB.Sets s ON s.no = rs.setNo
                         LEFT JOIN LegoSorterDB.Subsets ss ON s.no = ss.Setno
                         WHERE rs.collection_id = ${collectionid}
                         GROUP BY ss.no
                         ORDER by count desc) as x`
                connection.query(uniquePartsQuery, (err, uniquePartsResults:any) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Some error occurred while fetching unique Parts count',
                        errorMessage: process.env.DEBUG && err
                    });
                    res.json({
                        code: 100,
                        general : generalproperties[0],
                        summarized : summarizedResults[0],
                        unique : uniquePartsResults[0]
                    });
                });
            });
        }
    })
}