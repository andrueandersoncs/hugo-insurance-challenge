import { TextInput, Button, Group, Container, Paper, Title, Flex } from '@mantine/core';
import { DatePickerInput, YearPickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';

/*
Frontend
Create a React frontend that can display the current application state, and can allow information
to be added or edited. The frontend should do basic validation, and when everything is filled out,
allow the application to be submitted, and display either an error message if the application is
not complete or the quoted price to purchase insurance.

Specifications
The data that an insurance application needs consists of the following:
● First and Last name
● Date of Birth (validate that input is a date and at least 16 years old)
● Address
○ Street
○ City
○ State
○ ZipCode (validate numeric, but don’t worry about validating if zip code exists)
● Vehicle(s) (must have 1 vehicle, cannot have more than 3 total)
○ VIN
○ Year (validate numeric and valid year between 1985 and current year + 1)
○ Make and Model
*/

type Application = {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  address: Address;
  vehicles: Vehicle[];
}

type Address = {
  street: string;
  city: string;
  state: string;
  zipCode: string;
};

type Vehicle = {
  vin: string;
  year: Date;
  make: string;
  model: string;
}

const App = () => {
  const form = useForm<Application>({
    initialValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: new Date(),
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
      },
      vehicles: [{
        vin: '',
        year: new Date(),
        make: '',
        model: '',
      }],
    },
    validate: {
      firstName: (value) => value.trim().length > 0 ? null : 'First name is required',

      lastName: (value) => value.trim().length > 0 ? null : 'Last name is required',

      dateOfBirth: (value) =>
        (
          value instanceof Date
          && value.getFullYear() <= new Date().getFullYear() - 16
        ) ? null : 'Must be at least 16 years old',

      address: {
        street: (value) => value.trim().length > 0 ? null : 'Street is required',
        city: (value) => value.trim().length > 0 ? null : 'City is required',
        state: (value) => value.trim().length > 0 ? null : 'State is required',
        zipCode: (value) => (value.trim().length === 0 ? 'Zip code is required' : isNaN(Number(value.trim())) ? 'Zip code is invalid' : null),
      },

      vehicles: {
        vin: (value) => value.trim().length > 0 ? null : 'VIN is required',
        make: (value) => value.trim().length > 0 ? null : 'Make is required',
        model: (value) => value.trim().length > 0 ? null : 'Model is required',
        year: (value) => value.getFullYear() < 1985 ? 'Year cannot be before 1985' : value.getFullYear() > new Date().getFullYear() + 1 ? 'Year cannot be after next year' : null,
      }
    },
  });

  const vehicles = form.getTransformedValues().vehicles;

  const onClickAddVehicle = () => {
    form.insertListItem('vehicles', {
      vin: '',
      year: new Date(),
      make: '',
      model: '',
    })
  }

  const onClickRemoveVehicle = (index: number) => () => {
    form.removeListItem('vehicles', index);
  }

  const onSubmitForm = (values: Application) => {
    console.log('Submitted:', values)
  }

  return (
    <Container size="sm" mt="xl">
      <Paper withBorder p="sm">
        <form onSubmit={form.onSubmit(onSubmitForm)}>
          <Title order={3}>Personal Information</Title>
          <TextInput
            withAsterisk
            label="First Name"
            {...form.getInputProps('firstName')}
          />
          <TextInput
            withAsterisk
            label="Last Name"
            {...form.getInputProps('lastName')}
          />
          <DatePickerInput
            withAsterisk
            label="Date of Birth"
            {...form.getInputProps('dateOfBirth')}
          />
          <Title order={3} mt="sm">Home Address</Title>
          <TextInput
            withAsterisk
            label="Street"
            {...form.getInputProps('address.street')}
          />
          <TextInput
            withAsterisk
            label="City"
            {...form.getInputProps('address.city')}
          />
          <TextInput
            withAsterisk
            label="State"
            {...form.getInputProps('address.state')}
          />
          <TextInput
            withAsterisk
            label="Zip Code"
            {...form.getInputProps('address.zipCode')}
          />
          <Title order={3} mt="sm">Vehicles</Title>
          {vehicles.map((_, index) => (
            <Paper key={index} withBorder p="xs" mt="xs">
              <TextInput
                withAsterisk
                label="VIN"
                {...form.getInputProps(`vehicles.${index}.vin`)}
              />
              <YearPickerInput
                withAsterisk
                label="Year"
                {...form.getInputProps(`vehicles.${index}.year`)}
              />
              <TextInput
                withAsterisk
                label="Make"
                {...form.getInputProps(`vehicles.${index}.make`)}
              />
              <TextInput
                withAsterisk
                label="Model"
                {...form.getInputProps(`vehicles.${index}.model`)}
              />
              <Flex mt="xs">
                {index === vehicles.length - 1 && index < 2 && (
                  <Button mr="xs" variant="filled" color="blue" onClick={onClickAddVehicle}>
                    Add Vehicle
                  </Button>
                )}
                {(index > 0 || vehicles.length > 1) && (
                  <Button variant="filled" color="red" onClick={onClickRemoveVehicle(index)}>
                    Remove Vehicle
                  </Button>
                )}
              </Flex>
            </Paper>
          ))}
          <Group position="right" mt="md">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}

export default App;