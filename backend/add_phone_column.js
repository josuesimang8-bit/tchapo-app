import { createClient } from '@supabase/supabase-js';

// Using the anon key — but we'll try the REST approach
const supabaseUrl = 'https://rkempjcqoefhdthvwewm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrZW1wamNxb2VmaGR0aHZ3ZXdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3NTEwNjIsImV4cCI6MjA5MzMyNzA2Mn0.NC38AzJUtZa7ZQ-T5AjFe_hyZGoPrasXPLJjsQ1rltI';

const supabase = createClient(supabaseUrl, supabaseKey);

// Try inserting a dummy order with phone to see if column exists
async function checkAndAddColumn() {
    console.log('Checking if phone column exists in orders...');
    
    // Try selecting the phone column
    const { data, error } = await supabase
        .from('orders')
        .select('id, phone')
        .limit(1);
    
    if (error && error.message.includes('phone')) {
        console.log('Column "phone" does NOT exist yet.');
        console.log('Error:', error.message);
        console.log('\n⚠️  The anon key cannot run ALTER TABLE.');
        console.log('Please run this SQL in Supabase SQL Editor:');
        console.log('\nALTER TABLE orders ADD COLUMN IF NOT EXISTS phone text;\n');
    } else {
        console.log('✅ Column "phone" already exists in orders table!');
        console.log('Data sample:', data);
    }
}

checkAndAddColumn();
