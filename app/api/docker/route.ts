import { NextResponse } from "next/server";
import { exec } from "child_process";
import { writeFile } from "fs/promises";
import path from "path";

// Accept POST request
export async function POST(req: Request) {
  try {
    const { imageName } = await req.json();
    const projectRoot = process.cwd();
    const now = new Date().toISOString();

    // Initialzie log
    let logOutput = ` Docker Automation Started at ${now}\n`;
    logOutput += `Image name: ${imageName}\n\n`;

    // Generate Dockerfile content
    const dockerfileContent = `
# Auto-generated Dockerfile
FROM node:22-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
    `;

    // Generate docker-compose.yml content
    const composeContent = `
version: '3'
services:
  app:
    image: ${imageName}
    build: .
    ports:
      - "3001:3000"
    container_name: ${imageName}-container
    restart: always
    command: npm start
    `;

    logOutput += "Generating Docker configuration files...\n";

    // Write files
    await writeFile(path.join(projectRoot, "Dockerfile"), dockerfileContent);
    await writeFile(path.join(projectRoot, "docker-compose.yml"), composeContent);

    logOutput += "Dockerfile & docker-compose.yml created successfully.\n\n";

    // Build Docker image
    logOutput += " Starting Docker build...\n";

    const dockerCommand = `docker build -t ${imageName} .`;
    const dockerOutput = await new Promise((resolve, reject) => {
      exec(dockerCommand, { cwd: projectRoot }, (error, stdout, stderr) => {
        if (error) reject(stderr || stdout);
        else resolve(stdout);
      });
    });

    logOutput += " Docker build complete.\n\n";

    // Auto commit to GitHub
    logOutput += "Committing Docker configs to GitHub...\n";

    const gitCommands = `
      git add Dockerfile docker-compose.yml &&
      (git commit -m "Auto update Docker configs for ${imageName} at ${now}" || echo "No Docker changes to commit") &&
      git push origin main
    `;

    const gitOutput = await new Promise((resolve, reject) => {
      exec(gitCommands, { cwd: projectRoot }, (error, stdout, stderr) => {
        if (error) reject(stderr || stdout);
        else resolve(stdout);
      });
    });

    logOutput += " GitHub push complete.\n\n";

    // log output
    const fullOutput = `
${logOutput}
--- Docker Build Log ---
${dockerOutput}

--- Git Log ---
${gitOutput}
`;

    // Return fronted display
    return NextResponse.json({
      success: true,
      message: "Docker automation completed successfully.",
      logs: fullOutput,
    });

  } catch (error: any) {
    
    return NextResponse.json({
      success: false,
      message: "Error during Docker automation.",
      error: error.toString(),
    });
  }
}