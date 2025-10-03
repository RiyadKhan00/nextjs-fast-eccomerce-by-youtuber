import { Inngest } from 'inngest';
import connectDB from './db';
import User from '@/models/User';

// Create a client to send and receive events
export const inngest = new Inngest({ id: 'piyas-next' });

//Inngest Fucntion to ssave ussssser data to a database
export const syncUserCreation = inngest.createFunction(
  {
    id: 'sync-user-from-cleak',
  },
  {
    event: 'clerk/user.created',
  },
  async ({ event }) => {
    console.log('call the user.create');
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + ' ' + last_name,
      imageUrl: image_url,
    };

    await connectDB();
    await User.create(userData);
  }
);

// export const syncUserCreation = inngest.createFunction(
//   { id: 'create-user-from-clerk' },
//   { event: 'clerk/user.created' },
//   async ({ event }) => {
//     const { id, first_name, last_name, email_addresses, image_url } =
//       event.data;

//     try {
//       await connectDB();
//       const user = await User.create({
//         _id: id,
//         email: email_addresses[0]?.email_address || '',
//         name: `${first_name || ''} ${last_name || ''}`.trim(),
//         image_url,
//       });
//       console.log('✅ User created:', user._id);
//     } catch (err) {
//       console.error('❌ User creation failed:', err);
//       throw err; // so Inngest logs it as failed
//     }
//   }
// );

//Inngest Function to update user data in database
export const syncUserUpdation = inngest.createFunction(
  {
    id: 'update-user-from-clerk',
  },
  {
    event: 'clerk/user.updated',
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + ' ' + last_name,
      imageUrl: image_url,
    };

    await connectDB();
    await User.findByIdAndUpdate(id, userData);
  }
);

// Innget Function to delete usesr from database
export const syncUserDeletion = inngest.createFunction(
  {
    id: 'delete-user-with-clerk',
  },
  {
    event: 'clerk/user.deleted',
  },
  async ({ event }) => {
    const { id } = event.data;
    // await connectDB();
    // await User.findByIdAndDelete(id);

    try {
      await connectDB();
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        console.log('⚠️ User already deleted:', id);
      } else {
        console.log('✅ User deleted:', id);
      }
    } catch (err) {
      console.error('❌ User deletion failed:', err);
      throw err;
    }
  }
);
