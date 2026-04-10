/**
 * Seed Script — Run once to initialize the database with:
 *  - Admin user
 *  - Sample portfolio data
 *
 * Usage: npm run seed
 */
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { config } from '../config/config';
import { User } from '../models/User';
import { Profile } from '../models/Profile';
import { Skill } from '../models/Skill';
import { Experience } from '../models/Experience';
import { Project } from '../models/Project';
import { Education } from '../models/Education';
import { Certification } from '../models/Certification';

async function seed() {
  console.log('🌱 Starting database seed...');
  await mongoose.connect(config.mongoUri);

  // ── Admin User ──────────────────────────────────────────────────────
  const existingUser = await User.findOne({ email: 'admin@portfolio.com' });
  if (!existingUser) {
    await User.create({ email: 'admin@portfolio.com', password: 'Admin@1234', role: 'admin' });
    console.log('✅ Admin user created: admin@portfolio.com / Admin@1234');
  } else {
    console.log('ℹ️  Admin user already exists');
  }

  // ── Profile ─────────────────────────────────────────────────────────
  const existingProfile = await Profile.findOne();
  if (!existingProfile) {
    await Profile.create({
      fullName: 'Siddhesh Kachave',
      headline: 'QA Engineer | Test Automation | Selenium | Cypress | API Testing',
      bio: `Passionate QA Engineer with 3+ years of experience in manual and automated testing.
Skilled in building robust test frameworks using Selenium, Cypress, and Playwright.
I ensure software quality through meticulous test planning, execution, and continuous improvement.`,
      email: 'siddhesh@example.com',
      phone: '+91 98765 43210',
      location: 'Pune, Maharashtra, India',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/siddhesh-kachave',
        github: 'https://github.com/siddhesh-kachave',
      },
      yearsOfExperience: 3,
      openToWork: true,
    });
    console.log('✅ Profile created');
  }

  // ── Skills ──────────────────────────────────────────────────────────
  const skillCount = await Skill.countDocuments();
  if (skillCount === 0) {
    await Skill.insertMany([
      { name: 'Selenium WebDriver', category: 'Automation', proficiency: 'Expert', order: 1 },
      { name: 'Cypress', category: 'Automation', proficiency: 'Advanced', order: 2 },
      { name: 'Playwright', category: 'Automation', proficiency: 'Intermediate', order: 3 },
      { name: 'Appium', category: 'Automation', proficiency: 'Intermediate', order: 4 },
      { name: 'Java', category: 'Languages', proficiency: 'Advanced', order: 1 },
      { name: 'JavaScript', category: 'Languages', proficiency: 'Advanced', order: 2 },
      { name: 'Python', category: 'Languages', proficiency: 'Intermediate', order: 3 },
      { name: 'TestNG', category: 'Frameworks', proficiency: 'Expert', order: 1 },
      { name: 'JUnit', category: 'Frameworks', proficiency: 'Advanced', order: 2 },
      { name: 'Mocha/Chai', category: 'Frameworks', proficiency: 'Advanced', order: 3 },
      { name: 'Cucumber/BDD', category: 'Frameworks', proficiency: 'Advanced', order: 4 },
      { name: 'Postman', category: 'Tools', proficiency: 'Expert', order: 1 },
      { name: 'REST Assured', category: 'Tools', proficiency: 'Advanced', order: 2 },
      { name: 'Jira', category: 'Tools', proficiency: 'Expert', order: 3 },
      { name: 'Jenkins', category: 'CI/CD', proficiency: 'Intermediate', order: 1 },
      { name: 'GitHub Actions', category: 'CI/CD', proficiency: 'Intermediate', order: 2 },
      { name: 'Docker', category: 'Tools', proficiency: 'Beginner', order: 5 },
      { name: 'Manual Testing', category: 'Testing', proficiency: 'Expert', order: 1 },
      { name: 'API Testing', category: 'Testing', proficiency: 'Expert', order: 2 },
      { name: 'Performance Testing', category: 'Testing', proficiency: 'Intermediate', order: 3 },
    ]);
    console.log('✅ Skills seeded');
  }

  // ── Experience ──────────────────────────────────────────────────────
  const expCount = await Experience.countDocuments();
  if (expCount === 0) {
    await Experience.insertMany([
      {
        company: 'TechCorp Solutions',
        role: 'Senior QA Engineer',
        startDate: new Date('2023-01-01'),
        endDate: null,
        current: true,
        description: `Leading the QA efforts for a SaaS product with 50k+ users.
Built an automation framework from scratch using Selenium + Java + TestNG.
Reduced manual testing effort by 60% through comprehensive automation.
Mentoring 2 junior QA engineers.`,
        techStack: ['Selenium', 'Java', 'TestNG', 'Jenkins', 'Jira', 'Postman'],
        location: 'Pune, India',
        order: 1,
      },
      {
        company: 'StartupXYZ',
        role: 'QA Engineer',
        startDate: new Date('2021-06-01'),
        endDate: new Date('2022-12-31'),
        current: false,
        description: `Performed manual and automated testing for a fintech application.
Wrote 200+ test cases covering critical payment flows.
Integrated Cypress into the CI/CD pipeline via GitHub Actions.`,
        techStack: ['Cypress', 'JavaScript', 'Postman', 'GitHub Actions', 'Jira'],
        location: 'Pune, India',
        order: 2,
      },
    ]);
    console.log('✅ Experience seeded');
  }

  // ── Projects ────────────────────────────────────────────────────────
  const projCount = await Project.countDocuments();
  if (projCount === 0) {
    await Project.insertMany([
      {
        title: 'Selenium Automation Framework',
        description: 'A robust Page Object Model based test automation framework using Selenium WebDriver, Java, TestNG, and Maven. Includes reporting via Extent Reports and CI integration with Jenkins.',
        techStack: ['Selenium', 'Java', 'TestNG', 'Maven', 'Jenkins', 'Extent Reports'],
        githubUrl: 'https://github.com/siddhesh-kachave/selenium-framework',
        featured: true,
        order: 1,
      },
      {
        title: 'API Testing Suite',
        description: 'Comprehensive REST API test suite using REST Assured and Java. Covers authentication, CRUD operations, error handling, and schema validation. Integrated with GitHub Actions.',
        techStack: ['REST Assured', 'Java', 'TestNG', 'GitHub Actions', 'JSON Schema'],
        githubUrl: 'https://github.com/siddhesh-kachave/api-testing-suite',
        featured: true,
        order: 2,
      },
      {
        title: 'Cypress E2E Test Suite',
        description: 'End-to-end test suite for a web application using Cypress. Includes custom commands, fixtures, and intercept-based API mocking. BDD-style with Cucumber.',
        techStack: ['Cypress', 'JavaScript', 'Cucumber', 'Node.js'],
        githubUrl: 'https://github.com/siddhesh-kachave/cypress-e2e',
        featured: false,
        order: 3,
      },
    ]);
    console.log('✅ Projects seeded');
  }

  // ── Education ───────────────────────────────────────────────────────
  const eduCount = await Education.countDocuments();
  if (eduCount === 0) {
    await Education.insertMany([
      {
        institution: 'Savitribai Phule Pune University',
        degree: 'Bachelor of Engineering',
        field: 'Computer Engineering',
        startYear: 2017,
        endYear: 2021,
        grade: '8.2 CGPA',
      },
    ]);
    console.log('✅ Education seeded');
  }

  // ── Certifications ──────────────────────────────────────────────────
  const certCount = await Certification.countDocuments();
  if (certCount === 0) {
    await Certification.insertMany([
      {
        name: 'ISTQB Foundation Level',
        issuer: 'ISTQB',
        issueDate: new Date('2022-03-01'),
        credentialId: 'CTFL-2022-12345',
      },
      {
        name: 'Selenium WebDriver with Java',
        issuer: 'Udemy',
        issueDate: new Date('2021-08-15'),
        credentialUrl: 'https://udemy.com/certificate/example',
      },
      {
        name: 'Postman API Fundamentals Student Expert',
        issuer: 'Postman',
        issueDate: new Date('2023-04-10'),
        credentialUrl: 'https://badgr.com/example',
      },
    ]);
    console.log('✅ Certifications seeded');
  }

  console.log('\n🎉 Seed complete!');
  console.log('📧 Admin login: admin@portfolio.com');
  console.log('🔑 Admin password: Admin@1234');
  console.log('⚠️  CHANGE THE PASSWORD after first login!\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
