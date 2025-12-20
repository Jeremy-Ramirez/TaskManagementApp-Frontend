"use client";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css"; // Estilos por defecto

const userPoolId = process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID;
const userPoolClientId =
  process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID;

console.log("Configuring Amplify with:", {
  userPoolId: userPoolId ? "Defined" : "Undefined",
  userPoolClientId: userPoolClientId ? "Defined" : "Undefined",
});

if (userPoolId && userPoolClientId) {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: userPoolId,
        userPoolClientId: userPoolClientId,
      },
    },
  });
} else {
  console.error(
    "Amplify configuration missing: NEXT_PUBLIC_USER_POOL_ID or NEXT_PUBLIC_USER_POOL_CLIENT_ID not found."
  );
}

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          {/* Pasamos el usuario y signOut a los hijos si es necesario */}
          {children}
          <button onClick={signOut}>Sign Out</button>
        </main>
      )}
    </Authenticator>
  );
}
