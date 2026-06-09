# felixr-api

## Local Setup

1. **Installing**
   ```bash
   npm install
   ```

2. **Env setup**
   Copy `.env.example` to `.env` and configure your variables.
   ```dotenv
   HOST=
   PORT=

   DB_USER=
   DB_PASSWORD=
   DB_NAME=
   DB_PORT=

   JWT_SECRET=
   API_KEY=

   DATABASE_URL=
   ```
   ```bash
   cp .env.example .env
   ```

3. **Running Docker**
   ```bash
   docker-compose up -d
   ```

4. **Running Prisma**
   ```bash
   npm run db:generate
   npm run db:pull
   ```

5. **Run the application**
   ```bash
   npm run dev
   # or
   npm run watch
   ```
