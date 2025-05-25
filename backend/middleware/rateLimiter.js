import ratelimit from "../config/upstash.js";

const ratelimiter = async(req, res, next) => {
    try {
        const {success} = await ratelimit.limit("my-rate-limit"); 

        if (!success) {
            return res.status(429).json({
                message: "Too many requests, please try again later."
            });
        }
        // Allow the request to proceed
        // console.log("Rate limit check passed for IP:", req.ip);
        next();

    } catch (error) {
        console.log("Error in rate limiter middleware:", error);
        next(error);       
    }
}

export default ratelimiter;