import mongoose from 'mongoose';
import { Skill } from './src/models/Skill';
import { Settings } from './src/models/Settings';

const uri = 'mongodb://siddhesh1967_DB_User:RH7snjAvGr4KEAxh@ac-de7akhw-shard-00-00.rwkri5i.mongodb.net:27017,ac-de7akhw-shard-00-01.rwkri5i.mongodb.net:27017,ac-de7akhw-shard-00-02.rwkri5i.mongodb.net:27017/qa_portfolio_db?ssl=true&replicaSet=atlas-y7fanu-shard-0&authSource=admin&appName=PortfolioWebsiteCluste01';

async function check() {
  await mongoose.connect(uri);
  const skills = await Skill.find().lean();
  console.log("SKILLS COUNT:", skills.length);
  if (skills.length > 0) console.log("SAMPLE SKILL CATEGORY:", skills[0].category);

  const settings = await Settings.findOne().lean();
  console.log("SETTINGS SKILL CATEGORIES:", settings?.skillCategories);

  // Group by category
  const grouped = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});
  
  console.log("GROUPED KEYS:", Object.keys(grouped));

  process.exit(0);
}

check().catch(console.error);
