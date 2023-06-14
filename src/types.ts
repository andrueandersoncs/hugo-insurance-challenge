export type Application = {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  address: Address;
  vehicles: Vehicle[];
}

export type Address = {
  street: string;
  city: string;
  state: string;
  zipCode: string;
};

export type Vehicle = {
  vin: string;
  year: Date;
  make: string;
  model: string;
}