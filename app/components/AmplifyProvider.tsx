"use client";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css"; // Estilos por defecto

import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

const userPoolId = process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID;
const userPoolClientId =
  process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID;

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
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Insightt
              </Typography>
              <Button
                variant="contained"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={signOut}
              >
                Sign Out
              </Button>
            </Toolbar>
          </AppBar>
          <main>{children}</main>
        </Box>
      )}
    </Authenticator>
  );
}
