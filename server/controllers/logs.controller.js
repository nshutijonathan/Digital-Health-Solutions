import {logs} from '../middlewares/demo.logger';

class LogsGotten{
    static getAllLogs(req,res){
        return res.status(200).send({
            status:200,
            message:'Logs successfully returned',
            data:logs,
            LogsLength:logs.length
        })
    }

}
export default LogsGotten