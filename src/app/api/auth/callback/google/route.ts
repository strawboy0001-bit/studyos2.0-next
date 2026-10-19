import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const origin = process.env.NEXT_PUBLIC_APP_URL || `${url.protocol}//${url.host}`;

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  // Handle user cancellation or denial
  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=cancelled&reason=${encodeURIComponent(error)}`, origin)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=missing_code", origin)
    );
  }

  // Validate state
  const savedState = request.cookies.get("google_oauth_state")?.value;
  if (!state || !savedState || state !== savedState) {
    return NextResponse.redirect(
      new URL("/login?error=invalid_state", origin)
    );
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const callbackUrl = `${origin}/api/auth/callback/google`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      new URL("/login?error=missing_credentials", origin)
    );
  }

  try {
    // Exchange authorization code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: callbackUrl,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      const errorBody = await tokenRes.text();
      return NextResponse.redirect(
        new URL(`/login?error=token_exchange_failed&detail=${encodeURIComponent(errorBody)}`, origin)
      );
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // Fetch user info from Google's OpenID UserInfo endpoint
    const userinfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userinfoRes.ok) {
      return NextResponse.redirect(
        new URL("/login?error=userinfo_fetch_failed", origin)
      );
    }

    const googleProfile = await userinfoRes.json();

    const sessionPayload = {
      id: `g_${googleProfile.sub}`,
      email: googleProfile.email,
      name: googleProfile.name || googleProfile.email.split("@")[0],
      avatarUrl: googleProfile.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(googleProfile.email)}`,
      verified: googleProfile.email_verified ?? true,
      authProvider: "google",
      createdAt: new Date().toISOString(),
    };

    // Redirect to login page with auth_success query param so client can hydrate AuthContext and IndexedDB
    const redirectUrl = new URL(`/login/callback?session=${encodeURIComponent(JSON.stringify(sessionPayload))}`, origin);
    const response = NextResponse.redirect(redirectUrl);

    // Set secure HTTP-only cookie for session persistence
    response.cookies.set("studyos_session", JSON.stringify(sessionPayload), {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    // Clear state cookie
    response.cookies.delete("google_oauth_state");

    return response;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal authentication error";
    return NextResponse.redirect(
      new URL(`/login?error=oauth_exception&detail=${encodeURIComponent(errorMsg)}`, origin)
    );
  }
}
