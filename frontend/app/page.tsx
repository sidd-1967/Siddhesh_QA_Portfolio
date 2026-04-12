import { publicAPI } from '@/lib/api';
import NavBar from '@/components/public/NavBar';
import HeroSection from '@/components/public/HeroSection';
import AboutSection from '@/components/public/AboutSection';
import SkillsSection from '@/components/public/SkillsSection';
import ExperienceSection from '@/components/public/ExperienceSection';
import ProjectsSection from '@/components/public/ProjectsSection';
import EducationCertSection from '@/components/public/EducationCertSection';
import ContactSection from '@/components/public/ContactSection';
import Footer from '@/components/public/Footer';

// Revalidate every 10 seconds — faster propagation after admin updates (ISR)
export const revalidate = 10;

async function fetchData<T>(fn: () => Promise<{ data: { data: T } }>): Promise<T | null> {
  try {
    const res = await fn();
    return res.data.data;
  } catch {
    return null;
  }
}

export default async function PortfolioPage() {
  const [profile, skillsData, experience, projects, education, certifications, settings] = await Promise.all([
    fetchData(() => publicAPI.getProfile()),
    fetchData<{ grouped: Record<string, unknown[]> }>(() => publicAPI.getSkills()),
    fetchData(() => publicAPI.getExperience()),
    fetchData(() => publicAPI.getProjects()),
    fetchData(() => publicAPI.getEducation()),
    fetchData(() => publicAPI.getCertifications()),
    fetchData(() => publicAPI.getSettings()), // Use helper
  ]);

  const config = (settings as any)?.sectionHeaders || {};

  return (
    <>
      <NavBar profile={profile} />
      <main>
        {config.hero?.enabled !== false && <HeroSection profile={profile as any} config={config.hero} />}
        {config.about?.enabled !== false && (
          <AboutSection 
            profile={profile as any} 
            config={config.about} 
            aboutStats={(settings as any)?.aboutStats} 
          />
        )}
        {config.skills?.enabled !== false && (
          <SkillsSection 
            grouped={(skillsData as { grouped: Record<string, any[]> } | null)?.grouped || {}} 
            config={config.skills} 
            categories={(settings as any)?.skillCategories}
          />
        )}
        {config.experience?.enabled !== false && (
          <ExperienceSection 
            experience={(experience as any[] | null) || []} 
            config={config.experience} 
          />
        )}
        {config.projects?.enabled !== false && (
          <ProjectsSection 
            projects={(projects as any[] | null) || []} 
            config={config.projects} 
          />
        )}
        {(config.education?.enabled !== false || config.certifications?.enabled !== false) && (
          <EducationCertSection
            education={(education as any[] | null) || []}
            certifications={(certifications as any[] | null) || []}
            config={{ education: config.education, certifications: config.certifications }}
          />
        )}
        {config.contact?.enabled !== false && <ContactSection profile={profile as any} config={config.contact} />}
      </main>
      <Footer name={(profile as { fullName?: string } | null)?.fullName || 'Siddhesh Govalkar'} />
    </>
  );
}
