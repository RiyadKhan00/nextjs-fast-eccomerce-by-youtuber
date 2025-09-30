import { serve } from 'inngest/next';
import {
  asyncUserDeletion,
  inngest,
  syncUserCreation,
  syncUserUpdation,
} from '@/config/ingest';

// Create an API that serves zero functions
export const { GET, POST } = serve({
  client: inngest,
  functions: [syncUserCreation, syncUserUpdation, asyncUserDeletion],
});
