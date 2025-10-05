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
