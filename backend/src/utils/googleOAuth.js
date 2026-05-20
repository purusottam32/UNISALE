import AppError from "./apiError.js";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

const getOAuthConfig = () => {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = process.env;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
    throw new AppError("Google OAuth is not configured.", 500);
  }

  return {
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    redirectUri: GOOGLE_CALLBACK_URL,
  };
};

export const getGoogleAuthUrl = () => {
  const { clientId, redirectUri } = getOAuthConfig();

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "online",
    prompt: "select_account",
  });

  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
};

export const exchangeCodeForGoogleUser = async (code) => {
  const { clientId, clientSecret, redirectUri } = getOAuthConfig();

  const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenResponse.ok) {
    throw new AppError("Failed to authenticate with Google.", 401);
  }

  const tokens = await tokenResponse.json();
  if (!tokens.access_token) {
    throw new AppError("Google did not return an access token.", 401);
  }

  const userResponse = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  if (!userResponse.ok) {
    throw new AppError("Failed to fetch Google profile.", 401);
  }

  const profile = await userResponse.json();

  if (!profile.email || !profile.id) {
    throw new AppError("Google account is missing required profile information.", 400);
  }

  return {
    googleId: profile.id,
    email: profile.email,
    name: profile.name || profile.email.split("@")[0],
    avatarUrl: profile.picture || "",
  };
};
