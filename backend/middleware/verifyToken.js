import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const {token} = req.cookies;
    try {
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Unauthorized"
            })
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({
                success:false,
                message:"Unauthorized"
            })    
        }
        
        req.userId = decoded.userId;
        next();

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.messgae
        })
    }
}