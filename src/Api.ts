import { initializeApp } from "firebase/app";
import { connectFunctionsEmulator, getFunctions, httpsCallable } from "firebase/functions";
import { Application } from "./types";

const firebaseConfig = {
  apiKey: "AIzaSyA-xAUnQkMJVv11vstn-G-69nNEVmjROSc",
  authDomain: "hugo-insurance-challenge.firebaseapp.com",
  projectId: "hugo-insurance-challenge",
  storageBucket: "hugo-insurance-challenge.appspot.com",
  messagingSenderId: "413634730809",
  appId: "1:413634730809:web:bee497ddc9bd6b7c4366e8"
};

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

// connectFunctionsEmulator(functions, "127.0.0.1", 5001);

export const createApplication = httpsCallable(functions, 'createApplication');

type GetApplicationRequest = {id: string}

export const getApplication = httpsCallable<GetApplicationRequest, Application>(functions, 'getApplication');

type UpdateApplicationRequest = {id: string, data: Application}

export const updateApplication = httpsCallable<UpdateApplicationRequest, Application>(functions, 'updateApplication');

type ValidateApplicationRequest = {id: string, data: Application}

type ValidateApplicationResponse = {quote: number}

export const validateApplication = httpsCallable<ValidateApplicationRequest, ValidateApplicationResponse>(functions, 'validateApplication');
