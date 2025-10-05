# Supabase SQL Scripts

## Create Demo User

This script creates a demo user directly in the database without sending confirmation emails.

**Demo Account:**
- Email: `demo@pawrelief.app`
- Password: `password`

**How to run:**

1. Go to your Supabase Dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New query"
4. Copy and paste the contents of `create-demo-user.sql`
5. Click "Run"

The user will be created with a confirmed email and can log in immediately.

**Note:** This script can be run multiple times safely - it will delete and recreate the user each time.

## Add Demo Dog

This script creates a sample dog for the demo user so they can test the app features.

**Sample Dog:**
- Name: Buddy
- Breed: Golden Retriever
- Age: 3 years
- Known allergies: Chicken, Pollen, Dust

**How to run:**

1. Make sure you've created the demo user first (see above)
2. Go to Supabase SQL Editor
3. Copy and paste the contents of `add-demo-dog.sql`
4. Click "Run"

**Note:** This will delete any existing dogs for the demo user and create a fresh sample dog.
