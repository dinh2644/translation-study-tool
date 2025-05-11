# Follow these steps to sync your local environment with the latest project setup:
---

## 1. Checkout `main` and Pull Updates

> This will discard local changes

```bash
git checkout main   # use -f if needed if you can't pull (might discard local changes)
git pull
```

---

## 2. Add `.env.local` in the Next.js Folder

Create a file named `.env.local` inside the `nextjs` folder. Or copy the `.env.local-example` file
```env
# Next.js 
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_ARML_KEY=

# Database
MONGODB_URI=m
MONGO_INITDB_ROOT_USERNAME=
MONGO_INITDB_ROOT_PASSWORD=

# Langchain
LANGCHAIN_API_KEY=
GOOGLE_API_KEY=

# Auth0
AUTH0_DOMAIN=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
APP_BASE_URL=http://localhost:3000
AUTH0_SECRET='use [openssl rand -hex 32] to generate a 32 bytes value'
```

---

## 3. Get the Environment Variable Values

### ARML Key
- Generate here: [https://arml.trymagic.xyz/dash](https://arml.trymagic.xyz/dash)

### MongoDB
- Use the username & password from when the project was created
- Make sure your **IP address** is added to the MongoDB Atlas project (your IP can change at school/home)
- Use **MongoDB Compass** for a GUI view (connect using the Compass connection string from Atlas)
- `MONGO_INITDB_ROOT_USERNAME` & `MONGO_INITDB_ROOT_PASSWORD` might not be needed

### Langchain (framework for integrating LLMs)
- Get API key here: [Langchain Settings](https://www.langchain.com/langsmith)

### Google AI Studio (for Gemini API)
- Create API key here: [Google AI Studio](https://aistudio.google.com/app/apikey)

### Auth0
- Create your application here: [Auth0 Dashboard](https://manage.auth0.com/dashboard/us/dev-i0p3mjm75zje2dfl/applications/YNoxG6Y5yfkEy3jR6MTIQX6xmLQn96pL/settings)
- Add the following:
  - **Allowed Callback URLs**: `http://localhost:3000/auth/callback`
  - **Allowed Logout URLs**: `http://localhost:3000`

See the image below for a visual reference:
![image](https://github.com/user-attachments/assets/7c2d1517-56ad-4936-8100-b0577b956352)

---

## 4. Run Docker (in /src/ or whereever compose.yml is at)

### In /src
```bash
# (just in case)
docker compose down
# (-d: runs in background, --build: rebuilds image (only if you made changes to any Dockerfile), --remove-orphans: clean up unused containers)
docker compose up -d --build --remove-orphans 
```

---
