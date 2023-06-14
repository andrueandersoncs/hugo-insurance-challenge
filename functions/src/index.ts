import {onCall} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

/*
Create a web API that exposes four endpoints:
1. POST route that starts a new insurance application and initializes it with the provided data
a. This route should return a “resume” route that points to the frontend URL to load the created application
2. GET route that can retrieve the current insurance application
3. PUT route that will update the insurance application with provided data
4. POST route that validates the application and returns a price
a. You do not actually need to do any calculation here, returning a random number value would be sufficient
*/

export const createApplication = onCall((request) => {
  logger.info("Hello logs!", {structuredData: true});
  return {message: "Hello from Firebase! or something"};
});

export const getApplication = onCall((request) => {
  logger.info("Hello logs!", {structuredData: true});
  return {message: "Hello from Firebase! or something"};
});

export const updateApplication = onCall((request) => {
  logger.info("Hello logs!", {structuredData: true});
  return {message: "Hello from Firebase! or something"};
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
}

export const validateApplication = onCall((request) => {
  logger.info("Hello logs!", {structuredData: true});
  return {message: "Hello from Firebase! or something"};
});
