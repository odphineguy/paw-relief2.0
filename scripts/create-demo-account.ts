import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables.');
  console.error('Make sure .env.local contains:');
  console.error('  VITE_SUPABASE_URL=your_supabase_url');
  console.error('  VITE_SUPABASE_ANON_KEY=your_supabase_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Creates a demo testing account for Paw Relief
 * Email: demo@pawrelief.app
 * Password: PawRelief2024!
 */

async function createDemoAccount() {
  const email = 'demo.pawrelief@gmail.com';
  const password = 'PawRelief2024!';

  console.log('Creating demo account...');
  console.log('Email:', email);
  console.log('Password:', password);
  console.log('\n💡 Note: Using Gmail for now. Switch to @pawrelief.app once DNS is configured.');

  try {
    // Sign up the demo user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('Error creating demo account:', error.message);
      return;
    }

    console.log('\n✅ Demo account created successfully!');
    console.log('\nLogin credentials:');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('\nUser ID:', data.user?.id);

    if (data.user && !data.user.confirmed_at) {
      console.log('\n⚠️  Note: Email confirmation may be required depending on your Supabase settings.');
      console.log('Check your Supabase dashboard to confirm the user if needed.');
    }

  } catch (err: any) {
    console.error('Unexpected error:', err.message);
  }
}

createDemoAccount();
