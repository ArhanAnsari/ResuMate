import { ResumeData } from "@/interfaces/resume";
import { Buffer } from "buffer";
import {
    AlignmentType,
    Document,
    HeadingLevel,
    Packer,
    Paragraph,
    TextRun,
} from "docx";
// Use legacy import for compatibility with older code patterns or specific features
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

export const WordService = {
  async generateAndShare(
    data: ResumeData,
    template: "modern" | "classic" | "minimal" = "modern",
  ) {
    try {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              ...this.generateHeader(data, template),
              ...this.generateSummary(data, template),
              ...this.generateExperience(data, template),
              ...this.generateEducation(data, template),
              ...this.generateSkills(data, template),
            ],
          },
        ],
      });

      const buffer = await Packer.toBuffer(doc);
      // @ts-ignore
      const base64 = Buffer.from(buffer).toString("base64");
      const filename = `${FileSystem.documentDirectory}${data.profile?.fullName || "Resume"}.docx`;

      await FileSystem.writeAsStringAsync(filename, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await Sharing.shareAsync(filename);
    } catch (error) {
      console.error("Error generating Word document:", error);
      throw error;
    }
  },

  generateHeader(data: ResumeData, template: string): Paragraph[] {
    const alignment =
      template === "modern" || template === "classic"
        ? AlignmentType.CENTER
        : AlignmentType.LEFT;

    return [
      new Paragraph({
        text: data.profile?.fullName || "Your Name",
        heading: HeadingLevel.TITLE,
        alignment: alignment,
        spacing: { after: 200 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: data.profile?.email || "", break: 1 }),
          new TextRun({ text: ` | ${data.profile?.phone || ""}` }),
          new TextRun({ text: ` | ${data.profile?.location || ""}` }),
        ],
        alignment: alignment,
        spacing: { after: 400 },
      }),
    ];
  },

  generateSummary(data: ResumeData, template: string): Paragraph[] {
    if (!data.summary) return [];
    return [
      new Paragraph({
        text: "Summary",
        heading: HeadingLevel.HEADING_2,
        thematicBreak: true,
        spacing: { before: 200, after: 100 },
      }),
      new Paragraph({
        text: data.summary,
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 300 },
      }),
    ];
  },

  generateExperience(data: ResumeData, template: string): Paragraph[] {
    if (!data.experience?.length) return [];

    const items = data.experience
      .map((exp) => [
        new Paragraph({
          children: [
            new TextRun({
              text: exp.company,
              bold: true,
              size: 24,
            }),
            new TextRun({
              text: `  |  ${exp.position}`,
              italics: true,
            }),
          ],
          spacing: { before: 200 },
        }),
        new Paragraph({
          text: `${exp.startDate} - ${exp.endDate || "Present"}`,
          alignment: AlignmentType.RIGHT,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: exp.description || "",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 },
        }),
      ])
      .flat();

    return [
      new Paragraph({
        text: "Experience",
        heading: HeadingLevel.HEADING_2,
        thematicBreak: true,
        spacing: { before: 200, after: 100 },
      }),
      ...items,
    ];
  },

  generateEducation(data: ResumeData, template: string): Paragraph[] {
    if (!data.education?.length) return [];

    const items = data.education
      .map((edu) => [
        new Paragraph({
          children: [
            new TextRun({
              text: edu.institution,
              bold: true,
            }),
            new TextRun({
              text: ` - ${edu.degree}`,
            }),
          ],
          spacing: { before: 100 },
        }),
        new Paragraph({
          text: `${edu.startDate} - ${edu.endDate || "Present"}`,
          spacing: { after: 200 },
        }),
      ])
      .flat();

    return [
      new Paragraph({
        text: "Education",
        heading: HeadingLevel.HEADING_2,
        thematicBreak: true,
        spacing: { before: 200, after: 100 },
      }),
      ...items, // Flattening not needed if map returns flat array but here it returns array of arrays so we flap above
    ];
  },

  generateSkills(data: ResumeData, template: string): Paragraph[] {
    if (!data.skills?.length) return [];

    // Group skills by category if possible, or just list them
    const skillText = data.skills.map((s) => s.name).join(", ");

    return [
      new Paragraph({
        text: "Skills",
        heading: HeadingLevel.HEADING_2,
        thematicBreak: true,
        spacing: { before: 200, after: 100 },
      }),
      new Paragraph({
        text: skillText,
        spacing: { after: 200 },
      }),
    ];
  },
};
