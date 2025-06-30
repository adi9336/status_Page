# Statusly - Status Page & Incident Management Dashboard

Statusly is a modern, real-time status page and incident management dashboard for teams and organizations. Built with Next.js, Clerk, and Prisma, it empowers your company to monitor service health, manage incidents, and keep your team and stakeholders informed.

**Live Demo**: [https://status-page-npnw3cxfh-adi9336s-projects.vercel.app/](https://status-page-npnw3cxfh-adi9336s-projects.vercel.app/)

---

## 🚀 Features

- **User Authentication**: Secure sign-in/sign-up with Clerk.
- **Team Management**: Invite and manage team members with different roles (Admin, Member, etc.).
- **Master Admin Role**: A top-level role with full control over all users and settings.
- **Service Management**:  
  - Add, edit, and remove services (e.g., Website, API, Database).
  - Set and update service status (Operational, Degraded, Down).
- **Incident Management**:  
  - Create, update, and resolve incidents.
  - Associate incidents with specific services.
  - Add updates with status changes to ongoing incidents.
- **Real-time Notifications**: A notification system to keep users informed of important events.
- **Responsive UI**: A clean, modern, and fully responsive design that works on any device.
- **Public Status Page**: A public-facing page to share real-time service status and incident history.

---

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router)
- **Authentication**: Clerk
- **Database ORM**: Prisma
- **Database**: PostgreSQL (recommended), compatible with any Prisma-supported DB.
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

---

## 📦 Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd statuspage
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory and add your database and Clerk credentials. See `env.example` for the required variables.

```env
# Example .env.local
DATABASE_URL="your_postgresql_connection_string"

# Get these from your Clerk Dashboard
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# This is required for the Clerk webhook to function
CLERK_WEBHOOK_SECRET="whsec_..."
```

### 4. Set Up the Database

Run the Prisma migrations to set up your database schema.

```bash
npx prisma migrate dev
```

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deployment

This project is configured for easy deployment to **Vercel**.

1.  **Push to GitHub**: Create a repository and push your code.
2.  **Import to Vercel**: Connect your GitHub repository to Vercel.
3.  **Configure Environment Variables**: Add the same environment variables from your `.env.local` file to your Vercel project settings.
4.  **Deploy**: Vercel will automatically build and deploy your application.

Your live application will be available at the URL provided by Vercel.

### Clerk Webhook Setup

After deployment, you must set up a webhook in Clerk to sync user data with your application's database.

1.  Go to your **Clerk Dashboard** and navigate to **Webhooks**.
2.  Click **"Add Endpoint"**.
3.  Paste your production webhook URL: `YOUR_DEPLOYMENT_URL/api/webhooks/clerk`
    - **Example**: `https://status-page-npnw3cxfh-adi9336s-projects.vercel.app/api/webhooks/clerk`
4.  Select the `user.created`, `user.updated`, and `user.deleted` events.
5.  Click **"Create"** and copy the **Signing Secret**.
6.  Add the signing secret to your environment variables in Vercel as `CLERK_WEBHOOK_SECRET`.

---

## 👑 Master Admin Setup

To gain full control over the application, you need to set up a Master Admin.

1.  **Sign Up**: Create a new user account in the application.
2.  **Get User ID**: Find the user's ID from your database in the `User` table.
3.  **Run the Script**: Execute the following command in your terminal, replacing `YOUR_USER_ID` with the ID you just found:
    ```bash
    node scripts/setup-master-admin.js YOUR_USER_ID
    ```
This will elevate the specified user to the `MASTER_ADMIN` role.
