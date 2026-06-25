// Mock user store — replace with a real DB query in production.
// Passwords are bcrypt hashes. Demo credentials are in .env.example.
//
// OWNER ACCOUNTS: Owner accounts are NOT self-service. They are provisioned manually
// here in the mock store (and in the real DB by an admin). No sign-up flow creates
// owner accounts — they are seeded directly.

export type UserRole = "partner" | "owner";

export interface VenueUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  venueId: string;    // empty string for owner users
  venueName: string;  // empty string for owner users
  role: UserRole;
}

export const MOCK_USERS: VenueUser[] = [
  // ── Partner accounts ────────────────────────────────────────────────────────
  {
    id: "user-001",
    email: "bar@demo.eclat.co.uk",
    passwordHash: "$2b$10$o8WTiVfEQBgSHaxDd.x8GOwP/EWLPcxS3IU1ZZotHye4lRPQ4XO9y",
    name: "The Alchemist Bar",
    venueId: "venue-001",
    venueName: "The Alchemist",
    role: "partner",
  },
  {
    id: "user-002",
    email: "hotel@demo.eclat.co.uk",
    passwordHash: "$2b$10$aOo8dkolv8.UQFsnks2nAeD1c1cMrpkVfKfO5JSdW1ABcO4O6PUd.",
    name: "King Street Hotel",
    venueId: "venue-002",
    venueName: "King Street Townhouse",
    role: "partner",
  },
  {
    id: "user-003",
    email: "club@demo.eclat.co.uk",
    passwordHash: "$2b$10$oJzkzexwe6dy.D530br2Ses4XpahycHSKG9NQpY8DEdTfcPWiB7Kq",
    name: "Warehouse Project",
    venueId: "venue-003",
    venueName: "Warehouse Project",
    role: "partner",
  },

  // ── Owner accounts (manually provisioned — NOT self-service) ────────────────
  {
    id: "user-owner-001",
    email: "team@eclat.co.uk",
    // bcrypt hash — rotate this credential before going live
    passwordHash: "$2b$10$yHfBFk9INWDnhvBqInlJLeOVz6yDkEJv311OCthOjIkyMve9jcV.a",
    name: "Éclat Team",
    venueId: "",
    venueName: "",
    role: "owner",
  },
];

export function findUserByEmail(email: string): VenueUser | undefined {
  return MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
}
