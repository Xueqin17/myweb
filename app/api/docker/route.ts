import { NextResponse } from "next/server";
import { exec } from "child_process";
import util from "util";


const execPromise = util.promisify(exec);

export async function POST() {
  try {
    const { stdout, stderr } = await execPromise("docker build -t my-next-app .");

    return NextResponse.json({
      success: true,
      output: stdout || stderr || "No output received",
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      output: error.message || "Docker build failed",
    });
  }
}