import mongoose from 'mongoose';
import { Settings } from './src/models/Settings';

const newUri = 'mongodb://siddhesh1967_DB_User:RH7snjAvGr4KEAxh@ac-de7akhw-shard-00-00.rwkri5i.mongodb.net:27017,ac-de7akhw-shard-00-01.rwkri5i.mongodb.net:27017,ac-de7akhw-shard-00-02.rwkri5i.mongodb.net:27017/qa_portfolio_db?ssl=true&replicaSet=atlas-y7fanu-shard-0&authSource=admin&appName=PortfolioWebsiteCluste01';

async function fix() {
    await mongoose.connect(newUri);
    
    const doc = await Settings.findOne();
    if (doc) {
        doc.skillCategories = [
            'Automation & Testing Tools',
            'API & Performance Testing',
            'Programming & Scripting',
            'Testing Expertise',
            'Other Skills'
        ];
        await doc.save();
        console.log("Successfully fixed the skill categories to match what's in the actual skill items!");
    } else {
        console.log("Settings document missing altogether.");
    }
    
    process.exit(0);
}

fix().catch(console.error);
