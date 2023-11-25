import axios from "axios";
import { showAlert } from "./alert";

export const login =async (email,password)=>{
 try{
 
  const res = await axios({
  method:'POST',
  url:'http://127.0.0.1:3300/api/users/login',
  data:{
   email,
   password
  }
 })
if(res.data.status === 'success'){
 showAlert('success','logged in success')
 window.setTimeout(()=>{
location.assign('/')
 })
}
}catch(err){
showAlert('error',err.response.data.message)
}
}



// const login =async (email,password)=>{
//  try{
//   const data = {email,password}
//   const res = await fetch('http://127.0.0.1:3300/api/users/login',{
//    method:"POST",
//    headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify(data)
//   })
//  console.log(res)
// }catch(err){
// console.log(err.response.data)
// }
// }


