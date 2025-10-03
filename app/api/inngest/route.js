import { serve } from 'inngest/next';
import {
  ayncUserDeletion,
  inngest,
  syncUserCreation,
  syncUserUpdation,
} from '@/config/ingest';

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [syncUserCreation, syncUserUpdation, ayncUserDeletion],
});
