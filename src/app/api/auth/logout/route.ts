import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("studyos_session");
  response.cookies.delete("google_oauth_state");
  return response;
}
