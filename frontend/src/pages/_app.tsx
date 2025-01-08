import { CoordinatesDetailsProvider } from "@/context/coordinatesDetails";
import { UserDetailsProvider } from "@/context/userDetails";
import "@/styles/globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GoogleOAuthProvider clientId="837907809974-mv22rp83g28u09h8i6ond7q2tt22tst0.apps.googleusercontent.com">
      <CoordinatesDetailsProvider>
        <UserDetailsProvider>
          <Component {...pageProps} />
        </UserDetailsProvider>
      </CoordinatesDetailsProvider>
    </GoogleOAuthProvider>
  );
}
