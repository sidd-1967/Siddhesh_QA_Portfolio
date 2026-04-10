import { Router } from 'express';
import { Profile } from '../models/Profile';
import { Skill } from '../models/Skill';
import { Experience } from '../models/Experience';
import { Project } from '../models/Project';
import { Education } from '../models/Education';
import { Certification } from '../models/Certification';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

/** GET /api/public/profile */
router.get('/profile', asyncHandler(async (_req, res) => {
  const profile = await Profile.findOne().lean();
  if (!profile) {
    res.status(404).json({ success: false, message: 'Profile not found' });
    return;
  }
  res.json({ success: true, data: profile });
}));

/** GET /api/public/skills - grouped by category */
router.get('/skills', asyncHandler(async (_req, res) => {
  const skills = await Skill.find().sort({ category: 1, order: 1 }).lean();
  // Group by category
  const grouped = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});
  res.json({ success: true, data: { skills, grouped } });
}));

/** GET /api/public/experience */
router.get('/experience', asyncHandler(async (_req, res) => {
  const experience = await Experience.find().sort({ startDate: -1 }).lean();
  res.json({ success: true, data: experience });
}));

/** GET /api/public/projects */
router.get('/projects', asyncHandler(async (_req, res) => {
  const projects = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
  res.json({ success: true, data: projects });
}));

/** GET /api/public/education */
router.get('/education', asyncHandler(async (_req, res) => {
  const education = await Education.find().sort({ startYear: -1 }).lean();
  res.json({ success: true, data: education });
}));

/** GET /api/public/certifications */
router.get('/certifications', asyncHandler(async (_req, res) => {
  const certifications = await Certification.find().sort({ issueDate: -1 }).lean();
  res.json({ success: true, data: certifications });
}));

export default router;
