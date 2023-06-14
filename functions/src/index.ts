import {onCall} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, get, set, child } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA-xAUnQkMJVv11vstn-G-69nNEVmjROSc",
  authDomain: "hugo-insurance-challenge.firebaseapp.com",
  projectId: "hugo-insurance-challenge",
  storageBucket: "hugo-insurance-challenge.appspot.com",
  messagingSenderId: "413634730809",
  appId: "1:413634730809:web:bee497ddc9bd6b7c4366e8",
  databaseURL: "https://hugo-insurance-challenge-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// connectDatabaseEmulator(database, "127.0.0.1", 9000);

export const createApplication = onCall(async (request) => {
  try {
    const newApplication = await push(ref(database, 'applications'), request.data);
    logger.info("Created new application: " + JSON.stringify(request.data), {structuredData: true});
    return { url: 'https://hugo-insurance-challenge.web.app/?resume=' + newApplication.key };
  } catch (error) {
    logger.error("Error creating application: " + JSON.stringify(error), {structuredData: true});
    return {message: "Error creating application"};
  }
});

export const getApplication = onCall(async (request) => {
  if (!request.data.id) {
    logger.info("Application requested with no ID provided", {structuredData: true});
    return {message: "No application id provided"};
  }
  
  try {
    const snapshot = await get(child(ref(database, 'applications'), request.data.id))
    if (!snapshot.exists()) return {message: "No application found with that id"};
    return snapshot.val();
  } catch (error) {
    logger.error("Error retrieving application: " + error, {structuredData: true});
    return {message: "Error retrieving application"};
  }
});

export const updateApplication = onCall(async (request) => {
  if (!request.data.id) {
    logger.info("Application requested with no ID provided", {structuredData: true});
    return {message: "No application id provided"};
  }
  
  try {
    const snapshot = await get(child(ref(database, 'applications'), request.data.id))
    if (!snapshot.exists()) return {message: "No application found with that id"};
    set(snapshot.ref, request.data);
    logger.info("Updated application: " + request.data, {structuredData: true});
    return {message: "Application updated"};
  } catch (error) {
    logger.error("Error updating application: " + error, {structuredData: true});
    return {message: "Error updating application"};
  }
});

const validators = {
  firstName: (value: string) => value.trim().length > 0,
  
  lastName: (value: string) => value.trim().length > 0,
  
  dateOfBirth: (value: string) => new Date(value).getFullYear() <= new Date().getFullYear() - 16,
  
  address: (value: {street: string, city: string, state: string, zipCode: string}) =>
    value.street.trim().length > 0
    && value.city.trim().length > 0
    && value.state.trim().length > 0
    && value.zipCode.trim().length > 0
    && !isNaN(Number(value.zipCode.trim())),

  vehicles: (value: {vin: string, make: string, model: string, year: string}[]) =>
    value.length > 0
    && value.length <= 3
    && value.every((vehicle) =>
      vehicle.vin.trim().length > 0
      && vehicle.make.trim().length > 0
      && vehicle.model.trim().length > 0
      && new Date(vehicle.year).getFullYear() >= 1985
      && new Date(vehicle.year).getFullYear() <= new Date().getFullYear() + 1),
} as const;

export const validateApplication = onCall(async (request) => {
  if (!request.data.id) {
    logger.info("Application requested with no ID provided", {structuredData: true});
    return {message: "No application id provided"};
  }

  const errors = Object.entries(request.data.data).reduce((errors, [key, value]) => {
    if (!(key in validators)) return errors;
    if (!validators[key as keyof typeof validators](value as any)) errors.push(key);
    return errors;
  }, [] as string[]);
  
  if (errors.length > 0) {
    logger.info("Application failed validation: " + errors.join(", "), {structuredData: true});
    return {message: "Application failed validation", errors};
  }
  
  try {
    const snapshot = await get(child(ref(database, 'applications'), request.data.id))
    if (!snapshot.exists()) return {message: "No application found with that id"};
    set(snapshot.ref, request.data.data);
    logger.info("Updated application: " + request.data.data, {structuredData: true});
    logger.info("Application passed validation", {structuredData: true});
    return {quote: Math.floor(Math.random() * 1000)};
  } catch (error) {
    logger.error("Error updating application: " + error, {structuredData: true});
    return {message: "Error updating application"};
  }
});
