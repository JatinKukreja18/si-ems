// Test if shared package works independently
const { supabase } = require('./src/lib/supabase')
console.log('✅ Shared package works!', supabase ? 'Supabase client loaded' : 'No client')