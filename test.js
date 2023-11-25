const Email = require('./utils/email')

const test = async ()=>{
 try {
  const user = {
   name:"mohamed",
   email:"m1@g.com"
  }
  url='mkmkll'
  await new Email(user,url).sendWelcome()
 } catch (error) {
  console.log(error)
 }
}

test()