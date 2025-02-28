import { createClient } from '@supabase/supabase-js';


const supabase = createClient('proj_url', 'anon_key');

// subscribe to changes in chat_logs table
const subscribeToRealtime = () => {
  const subscription = supabase
    .channel('public:chat_logs') 
    .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_logs' }, (payload) => {
      console.log('Change received!', payload);

      // real-time update
      if (payload.eventType === 'INSERT') {
        console.log('New record added:', payload.new);
      } else if (payload.eventType === 'UPDATE') {
        console.log('Record updated:', payload.new);
      } else if (payload.eventType === 'DELETE') {
        console.log('Record deleted:', payload.old);
      }
    })
    .subscribe();

  // return subscription for future use (unsubscribe)
  return subscription;
};

// call function to subscribe
const subscription = subscribeToRealtime();

// unsubscribe when no longer needed
subscription.unsubscribe();

//test with postman