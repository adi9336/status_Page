<<<<<<< HEAD
<<<<<<< HEAD
# Status_Page
=======
# TeamStatus – Company Status Page & Incident Dashboard

**TeamStatus** is a modern, real-time status page and incident management dashboard for teams and organizations. Built with Next.js, Clerk, Prisma, and Tailwind CSS, it empowers your company to monitor service health, manage incidents, and keep your team and stakeholders informed.

---

## 🚀 Features

- **User Authentication**: Secure sign-in/sign-up with Clerk (supports team/organization accounts)
- **Team Management**: Invite and manage team members
- **Service Management**:  
  - Add, edit, and remove services (e.g., Website, API, Database)
  - Set and update service status (Operational, Degraded, Down)
- **Incident Management**:  
  - Create, update, and resolve incidents
  - Associate incidents with specific services
  - Add updates to ongoing incidents
- **Organization Support**: Multi-tenant (multiple teams/companies)
- **Real-time Status Updates**:  
  - Live status area auto-refreshes every 30 seconds
  - See current service health, uptime %, and recent incidents
- **Public Status Page**:  
  - Share real-time service status and incident timeline with your team or customers
- **Minimal, Professional UI**:  
  - Clean, responsive design inspired by modern SaaS dashboards

---

## 🛠️ Tech Stack

- **Frontend**: Next.js (App Router), React, Tailwind CSS
- **Auth**: Clerk (user & team management)
- **Database**: Prisma ORM, SQLite/Postgres (configurable)
- **API**: RESTful endpoints for services and incidents
- **Styling**: Tailwind CSS, Shadcn UI (optional)
- **Deployment**: Vercel, Netlify, or any Node.js host

---

## 📦 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/teamstatus.git
cd teamstatus
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure environment variables

Create a `.env` file in the root directory and set your database and Clerk credentials:

```
DATABASE_URL=your_database_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### 4. Run database migrations

```bash
npx prisma migrate dev --name init
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🖥️ Usage

- **Landing Page**: See real-time status, service health, and recent incidents.
- **Sign In/Up**: Join or log in to your team.
- **Dashboard**: Manage services, incidents, and team members (requires authentication).
- **Public Status**: Share the status page with your team or customers.

---

## 📊 Screenshots

> _Add screenshots or a Loom video link here to showcase your app!_

---

## 📝 Project Structure

- `app/` – Next.js app directory (pages, layouts, API routes)
- `components/` – Reusable UI components
- `prisma/` – Prisma schema and migrations
- `lib/` – Database and utility functions

---

## 🧑‍💻 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

## 📄 License

MIT

---

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Clerk](https://clerk.com/)
- [Prisma](https://prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)

---

>>>>>>> a6f498a (First coomit)
=======
# status_Page
>>>>>>> bedd6aba5c32b0158f9f499efdff7d634d773701
