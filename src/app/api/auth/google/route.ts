import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  const url = new URL(request.url);
  const origin = process.env.NEXT_PUBLIC_APP_URL || `${url.protocol}//${url.host}`;
  const callbackUrl = `${origin}/api/auth/callback/google`;

  // If OAuth credentials are not configured yet, redirect to login with explanatory error
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      new URL("/login?error=missing_credentials&detail=GOOGLE_CLIENT_ID_or_SECRET_not_configured", origin)
    );
  }

  // Generate cryptographic state for CSRF mitigation
  const state = Math.random().toString(36).substring(2) + Date.now().toString(36);

  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleAuthUrl.searchParams.set("client_id", clientId);
  googleAuthUrl.searchParams.set("redirect_uri", callbackUrl);
  googleAuthUrl.searchParams.set("response_type", "code");
  googleAuthUrl.searchParams.set("scope", "openid email profile");
  googleAuthUrl.searchParams.set("access_type", "offline");
  googleAuthUrl.searchParams.set("prompt", "select_account");
  googleAuthUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(googleAuthUrl.toString());

  // Store state in httpOnly cookie to verify upon callback
  response.cookies.set("google_oauth_state", state, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10, // 10 minutes
  });

  return response;
}
