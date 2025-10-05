# Scripts

## Create Demo Account

Creates a demo testing account for Paw Relief.

**Credentials:**
- Email: `demo.pawrelief@gmail.com`
- Password: `PawRelief2024!`
- User ID: `be93c22b-115b-4b60-b37c-5a45e4a48394`

**Note:** Currently using Gmail. Once pawrelief.app DNS is configured, you can create accounts with @pawrelief.app emails.

**To run:**

```bash
npx tsx scripts/create-demo-account.ts
```

**Note:** You may need to install `tsx` first:

```bash
npm install -D tsx
```

If email confirmation is enabled in your Supabase project settings, you'll need to confirm the user in the Supabase dashboard under Authentication > Users.
