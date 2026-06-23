// Mock user store — replace with a real DB query in production.
// Passwords are bcrypt hashes. Demo credentials are in .env.example.

export interface VenueUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  venueId: string;
  venueName: string;
}

export const MOCK_USERS: VenueUser[] = [
  {
    id: "user-001",
    email: "bar@demo.eclat.co.uk",
    passwordHash: "$2b$10$o8WTiVfEQBgSHaxDd.x8GOwP/EWLPcxS3IU1ZZotHye4lRPQ4XO9y",
    name: "The Alchemist Bar",
    venueId: "venue-001",
    venueName: "The Alchemist",
  },
  {
    id: "user-002",
    email: "hotel@demo.eclat.co.uk",
    passwordHash: "$2b$10$aOo8dkolv8.UQFsnks2nAeD1c1cMrpkVfKfO5JSdW1ABcO4O6PUd.",
    name: "King Street Hotel",
    venueId: "venue-002",
    venueName: "King Street Hotel",
  },
  {
    id: "user-003",
    email: "club@demo.eclat.co.uk",
    passwordHash: "$2b$10$oJzkzexwe6dy.D530br2Ses4XpahycHSKG9NQpY8DEdTfcPWiB7Kq",
    name: "Warehouse Project",
    venueId: "venue-003",
    venueName: "Warehouse Project",
  },
];

export function findUserByEmail(email: string): VenueUser | undefined {
  return MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
}
