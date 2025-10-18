import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { writeFileSync } from 'fs';
import path from 'path';

// Accept POST request
export async function POST(req: Request) {
  try {
    const { imageName } = await req.json(); 
    const projectRoot = process.cwd();

    // Create Dockerfile
    const dockerfileContent = `
# Use Node.js 22 Alpine version
FROM node:22-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
    `.trim();
    writeFileSync(path.join(projectRoot, 'Dockerfile'), dockerfileContent);

    // Create docker-compose.yml
    const composeContent = `
version: '3'
services:
  ${imageName || 'myweb'}:
    build: .
    ports:
      - "3000:3000"
    container_name: ${imageName || 'myweb'}-container
    restart: always
    environment:
      - NODE_ENV=production
    `.trim();
    writeFileSync(path.join(projectRoot, 'docker-compose.yml'), composeContent);

    // Implement Docker build
    const dockerCommand = `docker build -t ${imageName || 'myweb'} .`;

    const dockerOutput = await new Promise((resolve, reject) => {
      exec(dockerCommand, { cwd: projectRoot }, (error, stdout, stderr) => {
        if (error) reject(stderr || stdout);
        else resolve(stdout);
      });
    });

    // Automating commit to GitHub
    const now = new Date().toISOString();
    const gitCommands = `
      git add Dockerfile docker-compose.yml &&
      git commit -m "Auto generated Docker config for ${imageName} at ${now}" &&
      echo "No changes to commit" &&
      git push origin main
    `;
    const gitOutput = await new Promise((resolve, reject) => {
      exec(gitCommands, { cwd: projectRoot }, (error, stdout, stderr) => {
        if (error) reject(stderr || stdout);
        else resolve(stdout);
      });
    });

    // Return log
    return NextResponse.json({
      success: true,
      message: `Dockerfile, compose & build complete for image: ${imageName}`,
      logs: `${dockerOutput}\n\n--- GIT LOG ---\n${gitOutput}`,
    });
  } catch (error: any) {
    console.error("Docker automation failed:", error);
    return NextResponse.json({
      success: false,
      message: 'Error during Docker automation',
      error: error?.stdeer || error?.message || String(error),
    });
  }
}