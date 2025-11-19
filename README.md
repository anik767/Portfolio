## Tech Summary

- Next.js App Router + TypeScript
- TailwindCSS for UI
- MongoDB (using the native Node driver)
- Cloudinary for asset storage

## Environment Variables

Create a `.env.local` file with the following values:

```
MONGODB_URI=mongodb+srv://...
ADMIN_TOKEN=admin-secret-token

# Optional but recommended so fresh installs have an admin account
ADMIN_DEFAULT_EMAIL=admin@example.com
ADMIN_DEFAULT_PASSWORD=super-secret
```

- `ADMIN_TOKEN` controls the signed-in cookie, keep it secret.
- When `ADMIN_DEFAULT_EMAIL` and `ADMIN_DEFAULT_PASSWORD` are present the first login attempt will automatically seed the `admin_users` collection if it is empty.

## Seeding & Migrating Admin Users

There are three ways to populate the `admin_users` collection:

1. **Automatic seed (recommended)** – set the `ADMIN_DEFAULT_*` env vars before the first login. The `/api/auth/login` route will provision this account on the fly if the collection is empty.
2. **Legacy migration** – visit **Dashboard ▸ Admin Users** and click **“Migrate Legacy Users”** to copy accounts from the old `users` collection (passwords are hashed during migration).
3. **Manual create** – use the “Add New Admin” form on the same dashboard screen to add additional accounts. Passwords are hashed server-side via bcrypt.

If you clone this project in a new environment, simply set the env vars and log in once; the table and credentials will be created for you.

## Running Locally

```bash
npm install
npm run dev
# or
npm run build && npm run start
```

The dashboard is served at `http://localhost:3000/admin`. Once authenticated you can manage hero/about/services/projects plus the admin user list.

## Deployment

Deploy as a standard Next.js application (Vercel, Docker, etc). Ensure all env variables above are configured in the hosting platform and MongoDB Atlas (or your instance) is reachable from that environment.
