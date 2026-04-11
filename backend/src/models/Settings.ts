import mongoose, { Document, Schema } from 'mongoose';

export interface ISectionHeader {
  title: string;
  subtitle: string;
}

export interface ISettings extends Document {
  skillCategories: string[];
  skillProficiencies: string[];
  sectionHeaders: {
    hero: ISectionHeader;
    about: ISectionHeader;
    skills: ISectionHeader;
    experience: ISectionHeader;
    projects: ISectionHeader;
    education: ISectionHeader;
    certifications: ISectionHeader;
    contact: ISectionHeader & {
      description?: string;
      infoTitle?: string;
      infoText?: string;
    };
  };
  emailTemplate: {
    subject: string;
    body: string;
  };
}

const SectionHeaderSchema = new Schema({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
}, { _id: false });

const ContactHeaderSchema = new Schema({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  description: { type: String, default: '' },
  infoTitle: { type: String, default: '' },
  infoText: { type: String, default: '' },
}, { _id: false });

const SettingsSchema = new Schema<ISettings>(
  {
    skillCategories: { type: [String], default: ['Testing', 'Automation', 'Languages', 'Tools', 'Frameworks', 'CI/CD', 'Cloud', 'Databases', 'Other'] },
    skillProficiencies: { type: [String], default: ['Beginner', 'Intermediate', 'Advanced', 'Expert'] },
    sectionHeaders: {
      hero: { type: SectionHeaderSchema, default: { title: 'Hi, I\'m {name}', subtitle: 'QA Engineer | Test Automation Specialist' } },
      about: { type: SectionHeaderSchema, default: { title: 'Passion for Quality', subtitle: 'About Me' } },
      skills: { type: SectionHeaderSchema, default: { title: 'What I Work With', subtitle: 'Skills & Tech Stack' } },
      experience: { type: SectionHeaderSchema, default: { title: 'Work History', subtitle: 'Experience' } },
      projects: { type: SectionHeaderSchema, default: { title: 'Featured Work', subtitle: 'Projects' } },
      education: { type: SectionHeaderSchema, default: { title: 'Education', subtitle: 'Background' } },
      certifications: { type: SectionHeaderSchema, default: { title: 'Certifications', subtitle: 'Credentials' } },
      contact: { 
        type: ContactHeaderSchema, 
        default: { 
          title: 'Contact Me', 
          subtitle: 'Get in Touch',
          description: 'Have a project in mind or want to discuss QA? I\'d love to hear from you.',
          infoTitle: 'Let\'s Connect',
          infoText: 'Feel free to reach out for collaboration, job opportunities, or just to say hi!'
        } 
      },
    },
    emailTemplate: {
      subject: { type: String, default: '[Portfolio Contact] {{subject}}' },
      body: { 
        type: String, 
        default: `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1a202c; background-color: #f7fafc; margin: 0; padding: 0; }
        .wrapper { background-color: #f7fafc; padding: 40px 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); }
        .header { background: linear-gradient(135deg, #00d4ff 0%, #090979 100%); color: #ffffff; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.025em; }
        .content { padding: 40px; }
        .intro { margin-bottom: 30px; font-size: 16px; color: #4a5568; }
        .card { background: #f8fafc; border: 1px solid #edf2f7; border-radius: 8px; padding: 25px; margin-bottom: 30px; }
        .field { margin-bottom: 15px; border-bottom: 1px solid #edf2f7; padding-bottom: 10px; }
        .field:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
        .label { font-size: 12px; font-weight: 700; color: #718096; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; display: block; }
        .value { font-size: 15px; color: #2d3748; font-weight: 500; }
        .message-box { background: #ffffff; border-left: 4px solid #00d4ff; padding: 15px; margin-top: 10px; font-style: italic; color: #4a5568; }
        .footer { padding: 20px; text-align: center; font-size: 13px; color: #a0aec0; border-top: 1px solid #edf2f7; }
        .footer a { color: #00d4ff; text-decoration: none; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <h1>New Message Received</h1>
            </div>
            <div class="content">
                <p class="intro">You have received a new contact form submission from your portfolio website.</p>
                
                <div class="card">
                    <div class="field">
                        <span class="label">Sender Name</span>
                        <div class="value">{{name}}</div>
                    </div>
                    <div class="field">
                        <span class="label">Email Address</span>
                        <div class="value">{{email}}</div>
                    </div>
                    <div class="field">
                        <span class="label">Subject</span>
                        <div class="value">{{subject}}</div>
                    </div>
                    <div class="field">
                        <span class="label">Message</span>
                        <div class="message-box">{{message}}</div>
                    </div>
                </div>
            </div>
            <div class="footer">
                &copy; {{year}} Siddhesh Govalkar Portfolio. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>`
      }
    }
  },
  { timestamps: true }
);

// Ensure only one settings document exists
export const Settings = mongoose.model<ISettings>('Settings', SettingsSchema);
