import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createSimpleDemo() {
  const email = 'demo@pawrelief.app';
  const password = 'password';

  console.log('Creating simple demo account...');
  console.log('Email:', email);
  console.log('Password:', password);

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('Error:', error.message);
      console.log('\n⚠️  Domain not working yet. Trying with Gmail...');

      // Try Gmail instead
      const gmailEmail = 'demo@gmail.com';
      const { data: gmailData, error: gmailError } = await supabase.auth.signUp({
        email: gmailEmail,
        password,
      });

      if (gmailError) {
        console.error('Gmail error:', gmailError.message);
        return;
      }

      console.log('\n✅ Demo account created!');
      console.log('Email:', gmailEmail);
      console.log('Password:', password);
      console.log('User ID:', gmailData.user?.id);
      return;
    }

    console.log('\n✅ Demo account created!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('User ID:', data.user?.id);

  } catch (err: any) {
    console.error('Error:', err.message);
  }
}

createSimpleDemo();
