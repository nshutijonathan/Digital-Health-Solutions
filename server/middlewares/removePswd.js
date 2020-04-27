const removePswd=(data)=>{
 for(let value=0;value<data.length;value++){
    delete data[value]['password']   
 }  
 return data
}
export default removePswd;