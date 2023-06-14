import { TextInput, Button, Group, Container, Paper, Title, Flex, Notification } from '@mantine/core';
import { DatePickerInput, YearPickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { getApplication, validateApplication } from './Api';
import { useEffect, useState } from 'react';
import { Application } from './types';

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

  const [quote, setQuote] = useState<number | null>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const id = params.get('resume')!;
    
    if (!id) return;

    getApplication({ id }).then((values) => {
      if (values.data.dateOfBirth) {
        values.data.dateOfBirth = new Date(values.data.dateOfBirth);
      }

      if (values.data.vehicles) {
        values.data.vehicles = values.data.vehicles.map((vehicle) => ({
          ...vehicle,
          year: new Date(vehicle.year),
        }));
      }
      
      form.setValues(values.data);
      form.resetDirty(values.data);
    });
  }, [])

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
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const id = params.get('resume')!;
    
    if (!id) return;

    validateApplication({id, data: values}).then(resp => setQuote(resp.data.quote));
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
          {quote && (
            <Notification title="Application Success" color="green" mt="xs">
              Congratulations! Your application has been accepted. Your quote is ${quote}.
            </Notification>
          )}
          <Group position="right" mt="md">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}

export default App;