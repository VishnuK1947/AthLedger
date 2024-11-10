import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";
import { AuthRedirect } from "./components/auth/AuthRedirect";
import { RoleProvider } from "./components/providers/role-provider";
import { UserProfile } from "./components/UserProfile";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <RoleProvider>
        <html lang="en">
          <body>
            <SignedIn>
              <AuthRedirect />
              {children}
            </SignedIn>
            <SignedOut>{children}</SignedOut>
          </body>
        </html>
      </RoleProvider>
    </ClerkProvider>
  );
}

function CustomSignInButton() {
  return (
    <SignInButton mode="modal">
      <button className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
        Sign In
      </button>
    </SignInButton>
  );
}
