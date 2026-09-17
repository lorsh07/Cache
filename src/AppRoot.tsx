import { useState } from "react";
import { useAuth } from "./store/AuthContext";
import { AppStoreProvider } from "./store/AppStore";
import { SplashScreen } from "./screens/SplashScreen";
import { FirebaseSetupNotice } from "./screens/FirebaseSetupNotice";
import { LandingScreen } from "./screens/LandingScreen";
import { AuthScreen, type AuthMode } from "./screens/AuthScreen";
import App from "./App";

export function AppRoot() {
  const { user, loading, configured } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);

  if (!configured) return <FirebaseSetupNotice />;
  if (loading) return <SplashScreen />;

  if (!user) {
    if (authMode === null) {
      return (
        <LandingScreen onLogin={() => setAuthMode("login")} onSignup={() => setAuthMode("signup")} />
      );
    }
    return (
      <AuthScreen mode={authMode} onSwitchMode={setAuthMode} onBack={() => setAuthMode(null)} />
    );
  }

  return (
    <AppStoreProvider userId={user.uid}>
      <App user={user} />
    </AppStoreProvider>
  );
}
