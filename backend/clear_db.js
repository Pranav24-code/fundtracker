const mongoose = require('mongoose');
const Project = require('./src/models/Project');
const Update = require('./src/models/Update');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('Connection error:', err.message);
        process.exit(1);
    }
};

const run = async () => {
    await connectDB();
    try {
        console.log('Deleting all projects...');
        const pRes = await Project.deleteMany({});
        console.log(`Deleted ${pRes.deletedCount} projects.`);

        console.log('Deleting all updates...');
        const uRes = await Update.deleteMany({});
        console.log(`Deleted ${uRes.deletedCount} updates.`);
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
};

run();
