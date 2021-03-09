import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {collectionid} = req.params;
    const showRecognisedSetsByCollectionId = `SELECT collection_id, 
    partNos, 
    color_ids, 
    setNo, 
    count, 
    s_id, 
    no, 
    name, category_id, year, weight_g, size, complete_part_count, complete_minifigs_count, min_price, max_price, avg_price, qty_avg_price, unit_quantity, total_quantity, thumbnail_url, image_url, created, parts_existing, complete_percentage 
    FROM LegoSorterDB.suggested_sets_detail_view 
    WHERE count > ROUND((SELECT max(count) FROM LegoSorterDB.suggested_sets_detail_view)*0.7,0) 
    AND setNo IS NOT NULL 
    AND collection_id = ${collectionid} 
    ORDER by count desc`
    connection.query(showRecognisedSetsByCollectionId, (err, setsResult) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching recognised Sets',
            errorMessage: process.env.DEBUG && err
        });
        else {
            res.json({
            code: 100,
            setsResult : setsResult
        });

        }
    })
}