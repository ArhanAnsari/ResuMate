export interface ResumeProfile {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  summary?: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string; // ISO Date or YYYY-MM
  endDate?: string; // ISO Date or YYYY-MM or 'Present'
  description?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrentRole: boolean;
  description: string; // Bullet points joined by newlines or HTML? Usually plain text for ATS
}

export interface ProjectItem {
  id: string;
  name: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  link?: string;
  description: string;
  technologies: string[];
}

export interface SkillItem {
  id: string;
  name: string;
  category?: 'technical' | 'soft' | 'language' | 'tool';
  level?: 'beginner' | 'intermediate' | 'expert';
}

export interface ResumeData {
  id: string;
  title: string; // e.g. "Software Engineer Resume"
  lastModified: number;
  profile: ResumeProfile;
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: SkillItem[];
}

export type ResumeSectionType = 'profile' | 'education' | 'experience' | 'projects' | 'skills';
