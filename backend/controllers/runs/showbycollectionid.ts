import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {collectionid: collectionid} = req.params;
    const sumQuery = `SELECT allparts_specific.run_id,
    allparts_specific.no,
    allparts_specific.collection_id,
    allparts_specific.sorter_id,
    allparts_specific.imagefolder,
    allparts_specific.status_name,
    allparts_specific.status_description,
    allparts_specific.parts_unidentified,
    allparts_specific.parts_deleted,
    allparts_specific.parts_identified,
    allparts_specific.parts_identified_by_human,
    allparts_specific.parts_identified_by_cnn,
    uniqueparts_specific.parts_uniquepartsidentified,
    allparts_specific.created,
    allparts_specific.createdBy
        FROM (
    SELECT r.id as run_id,
    r.no,
    r.collection_id,
    r.sorter_id,
    r.imagefolder,
    st.name as status_name,
    st.description as status_description,
    r.created as created,
    r.createdBy,
    SUM(IF(rp.deleted IS NULL AND rp.no IS NULL,1,0)) as parts_unidentified,
    SUM(IF(rp.deleted IS NOT NULL,1,0)) as parts_deleted,
    SUM(IF(rp.deleted IS NULL AND rp.no IS NOT NULL,1,0)) as parts_identified, 
    SUM(IF(rp.deleted IS NULL AND rp.no IS NOT NULL AND rp.identifier = 'human',1,0)) as parts_identified_by_human, 
    SUM(IF(rp.deleted IS NULL AND rp.no IS NOT NULL AND rp.identifier != 'human',1,0)) as parts_identified_by_cnn
    FROM LegoSorterDB.Recognisedparts rp
    LEFT JOIN LegoSorterDB.Runs r ON r.id = rp.run_id
    LEFT JOIN LegoSorterDB.RunStatus rs ON r.id = rs.run_id
    LEFT JOIN LegoSorterDB.Status st ON rs.status = st.code AND st.typeid = 4 
    where r.collection_id = ${collectionid}
    GROUP BY r.id, status_name,status_description,created) As allparts_specific
    JOIN (SELECT COUNT(*) as parts_uniquepartsidentified , parts_uniquepartsidentified.run_id FROM (SELECT COUNT(*), r.id as run_id FROM LegoSorterDB.Recognisedparts rp
    LEFT JOIN LegoSorterDB.Runs r ON r.id = rp.run_id
    WHERE deleted IS NULL AND rp. no IS NOT NULL 
    AND collection_id = ${collectionid}
    GROUP BY rp.no, run_id) as parts_uniquepartsidentified
    GROUP BY run_id) as uniqueparts_specific
    ON allparts_specific.run_id = uniqueparts_specific.run_id`
    connection.query(sumQuery, (err, runStatisticResults:any) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching Runs summary',
            errorMessage: process.env.DEBUG && err
        });
        const sumQuery = `SELECT 
        SUM(IF(rp.deleted IS NULL AND rp.no IS NULL,1,0)) as allRunsPartsUnidentified,
        SUM(IF(rp.deleted IS NOT NULL,1,0)) as allRunsPartsDeleted,
        SUM(IF(rp.deleted IS NULL AND rp.no IS NOT NULL,1,0)) as allRunsPartsIdentified, 
        SUM(IF(rp.deleted IS NULL AND rp.no IS NOT NULL AND rp.identifier = 'human',1,0)) as allRunsPartsIdentifiedByHuman, 
        SUM(IF(rp.deleted IS NULL AND rp.no IS NOT NULL AND rp.identifier != 'human',1,0)) as allRunsPartsIdentifiedByCnn
        FROM LegoSorterDB.Recognisedparts rp
        LEFT JOIN LegoSorterDB.Runs r ON r.id = rp.run_id
        where collection_id = ${collectionid}`
        connection.query(sumQuery, (err, runsumResults:any) => {
            if (err) res.json({
                code: 500,
                message: 'Some error occurred while fetching runs total summary',
                errorMessage: process.env.DEBUG && err
            });
            const uniqueQuery = `SELECT COUNT(*) as allRunsUniquePartIdentifedCount FROM (SELECT COUNT(*) FROM LegoSorterDB.Recognisedparts rp
            LEFT JOIN LegoSorterDB.Runs r ON r.id = rp.run_id
            WHERE deleted IS NULL AND rp. no IS NOT NULL 
            AND collection_id = ${collectionid}  
            GROUP BY rp.no) as parts_uniquepartsidentified`
            connection.query(uniqueQuery, (err, runniqueResults:any) => {
                if (err) res.json({
                    code: 500,
                    message: 'Some error occurred while fetching runs total summary',
                    errorMessage: process.env.DEBUG && err
                });
                res.json({
                    code: 100,
                    summarized : runsumResults,
                    unique : runniqueResults,
                    runs : runStatisticResults
                });
            });
        });
    })
}