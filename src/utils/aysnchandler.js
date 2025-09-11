// const asynhandler = () =>{

import { response } from "express"

// }

const asynhandler = (responsehandler)  => (res , req ,next ) =>{
      Promise.resolve(responsehandler(req , res , next)).
      catch(err =>next(err))

      
}



export {asynhandler}

// const asynhandler = (fn) => async  (req, res, next) => {
//   try {
//     await fn(res , req, next)
       
//   } catch (error) {
//    res.status(err.code || 500).json({
//      success : false,
//      message: err.message  
//    })
//   }
// }