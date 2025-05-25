import ratelimit from "../config/upstash.js";

const ratelimiter = async(req, res, next) => {
    try {
        // Check if the request is coming from a valid IP address
        const ip = req.ip;
        const {success} = await ratelimit.limit(ip); 

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