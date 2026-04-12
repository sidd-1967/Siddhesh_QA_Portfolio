const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

console.log('CLOUD_NAME:', JSON.stringify(process.env.CLOUDINARY_CLOUD_NAME));
console.log('API_KEY:', JSON.stringify(process.env.CLOUDINARY_API_KEY));
console.log('API_SECRET Length:', process.env.CLOUDINARY_API_SECRET ? process.env.CLOUDINARY_API_SECRET.length : 0);
