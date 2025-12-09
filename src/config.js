const getBaseUrl = () => {
    // If we are in production (hosted), use the deployed backend URL
    // You MUST replace this string with your actual Render/Railway backend URL once deployed
    if (import.meta.env.PROD) {
        return 'https://foodify-backend-icny.onrender.com';
    }
    // Otherwise use localhost
    return 'http://localhost:5001';
};

export const API_URL = getBaseUrl();
