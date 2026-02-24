// server.js
const app = require('./app');
const connectDB = require('./config/db');
const { PORT } = require('./config/env');

const startServer = async ()=> {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
}

startServer();