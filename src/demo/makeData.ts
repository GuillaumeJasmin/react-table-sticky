export const mathsRandomInt = (min: number, max: number) => {
  return Math.round(Math.random() * (max - min) + min);
};

const firstName = [
  'Luther',
  'Brain',
  'Camilla',
  'Weston',
  'Ida',
  'Granville',
  'Leda',
];

const lastName = [
  'Shields',
  'Jones',
  'Goyette',
  'Ankunding',
  'Rau',
  'Hilpert',
  'Powlowski',
];

const email = [
  'Rex52@yahoo.com',
  'Graciela.Simonis9@yahoo.com',
  'Bret20@hotmail.com',
  'Oleta.Eichmann55@gmail.com',
  'Garnett34@gmail.com',
  'Zechariah36@gmail.com',
  'Ruthe.Hyatt59@hotmail.com',
  'Lupe_Ullrich@hotmail.com',
];

const street = [
  'Nigel Groves',
  'VonRueden Village',
  'Glenna Burg',
  'Sister Freeway',
  'Raul Shoals',
  'Heathcote Rapids',
  'Bosco Mall',
  'Ethyl Roads',
  'Hailey Manor',
  'Jennyfer Way',
  'Grady Crescent',
];

const city = [
  'Paris',
  'London',
  'New York',
  'Las Vegas',
  'Berlin',
  'Lyon',
  'Tokyo',
  'East Micahberg',
  'Horaceshire',
  'Schmittbury',
];

function getFirstName() {
  return firstName[mathsRandomInt(0, firstName.length - 1)];
}

function getLastName() {
  return lastName[mathsRandomInt(0, lastName.length - 1)];
}

function getEmail() {
  return email[mathsRandomInt(0, email.length - 1)];
}

function getStreet() {
  return street[mathsRandomInt(0, street.length - 1)];
}

function getCity() {
  return city[mathsRandomInt(0, city.length - 1)];
}

function getAge() {
  return mathsRandomInt(18, 40);
}

export function getData() {
  const data = [];
  for (let i = 0; i < 120; i += 1) {
    data.push({
      id: `id-${i}`,
      firstName: getFirstName(),
      lastName: getLastName(),
      age: getAge(),
      email: getEmail(),
      proEmail: getEmail(),
      street: getStreet(),
      streetBis: getStreet(),
      city: getCity(),
    });
  }
  return data;
}
