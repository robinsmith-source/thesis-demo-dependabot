# GooseChef

This is our repository for our SE3 project implementing a recipe app.

## Setup
### Prerequisites
- Install node >18
- Make sure `corepack` is installed using `npm install -g corepack`
- Install `pnpm` using `corepack enable pnpm`
- Install docker and docker-compose
- Create a Discord application [here](https://discord.com/developers/applications)
  - Set the OAuth2 redirect URL to `http://localhost:3000/api/auth/callback/discord`
- Create an uploadthing account [here](https://uploadthing.com/)
  - Create a new application
### Setup
- Clone the repository
- Run `npm install` in the root directory
- Copy the `.env.example` file to `.env` and fill in the values
  - `DATABASE_URL` is the connection string to the database, if you're using docker-compose leave it as is
  - `AUTH_URL` is the url of the app, if you're using docker-compose leave it as is
  - `AUTH_DISCORD_ID` from the Discord application you created
  - `AUTH_DISCORD_SECRET` from the Discord application you created
  - `UPLOADTHING_SECRET` from the uploadthing application you created
  - `UPLOADTHING_APP_ID` from the uploadthing application you created

## Development
- Run `docker-compose up -d` to start the database
- Run `pnpm run db:reset` to set up the database
- Run `pnpm run dev` to start the development server
### Database
- If you're testing changes to the database, run `pnpm run db:push` to apply the changes to the database
- Once you've decided your database changes are good, make a migration
  - Run `pnpm run prisma migrate dev --name <migration-name>` to generate a migration
### Formatting
- This project uses [Prettier](https://prettier.io/) for formatting
- WebStorm has built-in support for Prettier
  - Please enable it on save!
  - You can set it up in `Settings > Languages & Frameworks > JavaScript > Prettier`
- VS Code requires a bit more setup, check out [this guide](https://www.robinwieruch.de/how-to-use-prettier-vscode/) for more info
### Committing
- Make sure your code is formatted before committing
- This project uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
- Pushing to the `main` branch is disabled, please make a branch and open a pull request
### Stopping
- Run `docker-compose down` to stop the database
- You can stop the development server with `Ctrl+C`

# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
