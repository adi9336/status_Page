# Master Admin System Setup Guide

## Overview

The Master Admin system provides complete control over user management. Only users with the `MASTER_ADMIN` role can:
- Create new users
- Modify existing user roles and permissions
- Activate/deactivate users
- Access the Master Admin Panel

## Setup Instructions

### 1. Get Your Clerk User ID

First, you need to find your Clerk user ID:

1. Go to your [Clerk Dashboard](https://dashboard.clerk.com/)
2. Navigate to Users
3. Find your user account
4. Copy the User ID (it looks like `user_2abc123def456...`)

### 2. Set Up Master Admin

Run the setup script with your Clerk user ID:

```bash
node scripts/setup-master-admin.js <your-clerk-user-id>
```

Example:
```bash
node scripts/setup-master-admin.js user_2abc123def456
```

### 3. Update Email (if needed)

If the script created a new user with a temporary email, update it in the database:

```sql
UPDATE "User" 
SET email = 'your-actual-email@example.com' 
WHERE role = 'MASTER_ADMIN' AND clerkId = 'your-clerk-user-id';
```

## Using the Master Admin System

### Accessing the Master Admin Panel

1. Sign in to your application
2. Navigate to Dashboard → Users
3. If you have master admin privileges, you'll see a "Master Admin Panel" button
4. Click the button to open the full user management interface

### Master Admin Features

#### Create New Users
- Add users with email, name, and role
- Set initial permissions and preferences
- Users are created with `isActive: true` by default

#### Manage Existing Users
- Change user roles (except other Master Admins)
- Activate/deactivate users
- View user activity and creation dates

#### Role Hierarchy
1. **MASTER_ADMIN** - Full system control (cannot be modified by other users)
2. **SUPER_ADMIN** - High-level administrative access
3. **ADMIN** - Administrative access
4. **MANAGER** - Management-level access
5. **MEMBER** - Standard user access
6. **VIEWER** - Read-only access

### Security Features

#### Access Control
- Only users with `isActive: true` can access the application
- Master Admin users are protected from modification
- Role changes are logged and auditable

#### Database Validation
- All user operations are validated against the database
- Duplicate email/Clerk ID prevention
- Organization-scoped user management

## API Endpoints

### Master Admin Only Endpoints

- `GET /api/users/master-admin` - List all users
- `POST /api/users/master-admin` - Create new user
- `PUT /api/users/master-admin` - Update multiple users

### Regular User Endpoints

- `GET /api/users` - List users (filtered by permissions)
- `GET /api/users/[id]` - Get specific user
- `PATCH /api/users/[id]` - Update user (limited permissions)
- `DELETE /api/users/[id]` - Deactivate user (limited permissions)

## Troubleshooting

### "Access Denied" Error
- Ensure your user has the `MASTER_ADMIN` role
- Check that your user is active (`isActive: true`)
- Verify your Clerk user ID matches the database

### User Not Found in Database
- Run the setup script again with the correct Clerk user ID
- Check that the user exists in your Clerk organization
- Ensure the organization ID matches your setup

### Database Connection Issues
- Verify your `DATABASE_URL` environment variable
- Check that your database is accessible
- Ensure Prisma client is generated: `npx prisma generate`

## Best Practices

1. **Limit Master Admins**: Only assign the MASTER_ADMIN role to trusted individuals
2. **Regular Audits**: Periodically review user roles and permissions
3. **Secure Communication**: Share Clerk user IDs securely
4. **Backup**: Regularly backup your user database
5. **Monitoring**: Monitor user activity and access patterns

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your Clerk and database configurations
3. Ensure all environment variables are set correctly
4. Check the application logs for detailed error information 