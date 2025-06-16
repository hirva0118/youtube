const asyncHandler = (requestHandle:any) => {
    return (req:any,res:any,next:any)=>{
        Promise.resolve(requestHandle(req,res,next))
        .catch((error)=>next(error))
    }   
};
export {asyncHandler}