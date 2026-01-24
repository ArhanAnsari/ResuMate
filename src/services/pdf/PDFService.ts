import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export class PDFService {
  static async generateAndShare(resume: any) {
    if (!resume) throw new Error("No resume data provided");

    const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
                <style>
                    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
                    h1 { color: #2563EB; border-bottom: 2px solid #2563EB; padding-bottom: 10px; }
                    h2 { color: #1E293B; margin-top: 20px; border-bottom: 1px solid #E2E8F0; padding-bottom: 5px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .header h1 { border: none; margin-bottom: 5px; color: #0F172A; }
                    .contact-info { color: #64748B; font-size: 0.9em; }
                    .section { margin-bottom: 20px; }
                    .item { margin-bottom: 15px; }
                    .item-header { display: flex; justify-content: space-between; font-weight: bold; }
                    .subtitle { font-style: italic; color: #475569; }
                    .date { color: #64748B; }
                    .description { margin-top: 5px; line-height: 1.5; color: #334155; }
                    .skills-list { display: flex; flex-wrap: wrap; gap: 10px; }
                    .skill-tag { background: #F1F5F9; padding: 5px 10px; border-radius: 4px; font-size: 0.9em; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>${resume.data?.profile?.fullName || resume.title || "Resume"}</h1>
                    <div class="contact-info">
                        ${[
                          resume.data?.profile?.email,
                          resume.data?.profile?.phone,
                          resume.data?.profile?.location,
                        ]
                          .filter(Boolean)
                          .join(" • ")}
                    </div>
                </div>

                ${
                  resume.data?.summary
                    ? `
                <div class="section">
                    <h2>Professional Summary</h2>
                    <p>${resume.data.summary}</p>
                </div>
                `
                    : ""
                }

                ${
                  resume.data?.experience?.length > 0
                    ? `
                <div class="section">
                    <h2>Experience</h2>
                    ${resume.data.experience
                      .map(
                        (exp: any) => `
                        <div class="item">
                            <div class="item-header">
                                <span>${exp.position}</span>
                                <span class="date">${exp.startDate} - ${exp.endDate || "Present"}</span>
                            </div>
                            <div class="subtitle">${exp.company}</div>
                            <div class="description">${exp.description}</div>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
                `
                    : ""
                }

                ${
                  resume.data?.education?.length > 0
                    ? `
                <div class="section">
                    <h2>Education</h2>
                    ${resume.data.education
                      .map(
                        (edu: any) => `
                        <div class="item">
                            <div class="item-header">
                                <span>${edu.school}</span>
                                <span class="date">${edu.startDate} - ${edu.endDate || "Present"}</span>
                            </div>
                            <div class="subtitle">${edu.degree}</div>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
                `
                    : ""
                }

                 ${
                   resume.data?.skills?.length > 0
                     ? `
                <div class="section">
                    <h2>Skills</h2>
                    <div class="skills-list">
                        ${resume.data.skills
                          .map(
                            (skill: string) => `
                            <span class="skill-tag">${skill}</span>
                        `,
                          )
                          .join("")}
                    </div>
                </div>
                `
                     : ""
                 }
            </body>
            </html>
        `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, {
        UTI: ".pdf",
        mimeType: "application/pdf",
      });
    } catch (error) {
      console.error(error);
      throw new Error("Failed to generate or share PDF");
    }
  }
}
