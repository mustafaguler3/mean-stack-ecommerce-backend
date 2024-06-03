function errorHandler(err,req,res,next){
    if(err && err.name === 'UnauthorizedError'){
        return res.json({message:"The user is not authorized"})
    }

    if(err && err.name === 'ValidationError'){
        return res.json({message: err})
    }

    return res.json(err)
}

module.exports = errorHandler;