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
    let logOutput = `Docker Automation Started at ${now}\n`;
    logOutput += `Image name: ${imageName}\n\n`;

    // Generate Dockerfile content
    const dockerfileContent = `
# Auto-generated Dockerfile

FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"]
    `;

    // Generate docker-compose.yml content
    const composeContent = `
services:
  app:
    image: myweb
    build: .
    ports:
      - "80:3000"
    container_name: myweb-container
    restart: always
    environment:
      - DATABASE_URL=file:./dev.db
      - NODE_ENV=production
    command: >
      sh -c "npx prisma generate &&
             npx prisma migrate dev --name init_user_table &&
             npm run build &&
             npm run start"
    `;

    logOutput += "Generating Docker configuration files...\n";

    // Write files
    await writeFile(path.join(projectRoot, "Dockerfile"), dockerfileContent);
    await writeFile(path.join(projectRoot, "docker-compose.yml"), composeContent);

    logOutput += "Dockerfile & docker-compose.yml created successfully.\n\n";

    // Build Docker image
    logOutput += "Starting Docker build...\n";

    const dockerCommand = `docker build -t ${imageName} .`;
    const dockerOutput = await new Promise((resolve, reject) => {
      exec(dockerCommand, { cwd: projectRoot }, (error, stdout, stderr) => {
        if (error) reject(stderr || stdout);
        else resolve(stdout);
      });
    });

    logOutput += "Docker build complete.\n\n";

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

    logOutput += "GitHub push complete.\n\n";

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