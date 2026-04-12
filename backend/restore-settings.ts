import mongoose from 'mongoose';

const oldUri = 'mongodb://siddhesh1967_DB_User:RH7snjAvGr4KEAxh@ac-de7akhw-shard-00-00.rwkri5i.mongodb.net:27017,ac-de7akhw-shard-00-01.rwkri5i.mongodb.net:27017,ac-de7akhw-shard-00-02.rwkri5i.mongodb.net:27017/test?ssl=true&replicaSet=atlas-y7fanu-shard-0&authSource=admin&appName=PortfolioWebsiteCluste01';
const newUri = 'mongodb://siddhesh1967_DB_User:RH7snjAvGr4KEAxh@ac-de7akhw-shard-00-00.rwkri5i.mongodb.net:27017,ac-de7akhw-shard-00-01.rwkri5i.mongodb.net:27017,ac-de7akhw-shard-00-02.rwkri5i.mongodb.net:27017/qa_portfolio_db?ssl=true&replicaSet=atlas-y7fanu-shard-0&authSource=admin&appName=PortfolioWebsiteCluste01';

async function restoreSettings() {
    console.log('Connecting to databases...');
    const oldConn = await mongoose.createConnection(oldUri).asPromise();
    const newConn = await mongoose.createConnection(newUri).asPromise();

    const oldDb = oldConn.db as any;
    const newDb = newConn.db as any;

    const oldSettings = await oldDb.collection('settings').findOne({});
    if (oldSettings) {
        console.log('Found original settings from test db. Migrating...');
        // Replace current new settings entirely, preserving the ID for sanity or drop it
        await newDb.collection('settings').deleteMany({});
        await newDb.collection('settings').insertOne(oldSettings);
        console.log('✅ Settings officially fully restored! This includes exact category names.');
    } else {
        console.log('No original settings found.');
    }
    
    process.exit(0);
}

restoreSettings().catch(console.error);
