const getEnv = (key:string, defaultValue?:string):string => {
    const value = process.env[key] || defaultValue;
    if(value === undefined){
        throw new Error(`Missing Environment variable ${key}`);
    }
    
    return value;
}

export const MONGO_URI = getEnv("MONGO_URI");
export const NODE_ENV = getEnv("NODE_ENV", "development");
export const APP_ORIGIN = getEnv("APP_ORIGIN");
export const JWT_SECRET = getEnv("JWT_SECRET");
export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");
export const EMAIL = getEnv("EMAIL");
export const EMAIL_PASSWORD = getEnv("EMAIL_PASSWORD");
export const PORT = getEnv("PORT", "3000");