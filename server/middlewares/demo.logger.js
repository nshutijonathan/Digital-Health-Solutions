let logs=[];

let demoLogger=(req,res,next)=>{
    let current_datetime = new Date();
  let formatted_date =
    current_datetime.getFullYear() +
    "-" +
    (current_datetime.getMonth() + 1) +
    "-" +
    current_datetime.getDate() +
    " " +
    current_datetime.getHours() +
    ":" +
    current_datetime.getMinutes() +
    ":" +
    current_datetime.getSeconds();
  let method = req.method;
  let url = req.url;
//   let user=req.headers['x-auth-token'];
let ip=ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
  console.log(ip)
  let status = res.statusCode;
  let log = `[${formatted_date}] ${method}:${url}  ${ip} ${status}`;
    // console.log(typeof(log))
    logs.unshift({"action":log})
    console.log(logs)
    next()
}
export {logs,demoLogger};