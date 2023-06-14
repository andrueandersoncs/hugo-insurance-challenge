import { initializeApp } from "firebase/app";
import { connectFunctionsEmulator, getFunctions, httpsCallable } from "firebase/functions";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";

import App from "./App";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-xAUnQkMJVv11vstn-G-69nNEVmjROSc",
  authDomain: "hugo-insurance-challenge.firebaseapp.com",
  projectId: "hugo-insurance-challenge",
  storageBucket: "hugo-insurance-challenge.appspot.com",
  messagingSenderId: "413634730809",
  appId: "1:413634730809:web:bee497ddc9bd6b7c4366e8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

connectFunctionsEmulator(functions, "127.0.0.1", 5001);

const createApplication = httpsCallable(functions, 'createApplication');

createApplication({ text: 'asdf' })
  .then((result) => {
    const data: any = result.data;
    const sanitizedMessage = data.text;
    console.log(data)
  });

const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <App />
    </MantineProvider>
  </StrictMode>
);
