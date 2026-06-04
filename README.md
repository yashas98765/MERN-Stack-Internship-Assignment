# MERN Task Management App

This is a simple MERN stack Task Management application built for the internship assignment.

Summary
- User registration and login
- Create, update, delete, and view tasks
- Mark tasks as completed or pending

Features:
- User registration and login (JWT)
- Create, update, delete, view tasks
- Toggle task status (pending / completed)
- Search & pagination-ready API

Requirements:
- Node.js (16+ recommended)
- MongoDB running locally or a connection string

Setup
1. Server

```powershell
cd C:/Users/Yashas/mern-task/server
npm install
copy .env.example .env
# edit .env to set MONGO_URI and JWT_SECRET
npm run dev
```

2. Client

```powershell
cd C:/Users/Yashas/mern-task/client
npm install
npm run dev
```

Open http://localhost:5173 (Vite) for client and ensure server runs at http://localhost:5000

Notes
- The client expects the API at `http://localhost:5000/api`.
- To prepare submission: zip the project folder or push to GitHub.

Deployment (Vercel + Render)

1) Deploy client to Vercel
- Go to https://vercel.com, import the GitHub repository `yashas98765/MERN-Stack-Internship-Assignment`.
- In project settings set the root directory to `client`.
- Build command: `npm run build` — Output directory: `dist`.
- Environment: none required for client.

2) Deploy server to Render
- Go to https://render.com, create a new Web Service, connect the GitHub repo and select the `main` branch.
- Build command: `npm install` — Start command: `npm start`.
- Add environment variables in Render Dashboard: `MONGO_URI` and `JWT_SECRET` (use a secure value).

After deployment
- Update the client to use the deployed server API URL (set `API` base URL in `client/src/api.js` or via Vercel environment variables).

Screenshots & Demo

Create the following screenshots for submission:
- `screenshots/register.png` — registration page filled
- `screenshots/login.png` — login page
- `screenshots/dashboard-empty.png` — dashboard with no tasks
- `screenshots/dashboard-tasks.png` — dashboard showing tasks
- `screenshots/task-create.png` — create task modal/form
- `screenshots/task-edit.png` — edit task

To record a short demo (30–90s):
- Start the server and client locally as described above.
- Show: register → login → create task → toggle complete → edit → delete.
- Save video as `demo.mp4` and attach or upload to YouTube/Drive and include link in submission.

Automated screenshots & demo recording

1) Generate screenshots (automated)
- Ensure client is running at `http://localhost:5173`.
- Install Puppeteer once:

```powershell
cd C:/Users/Yashas/mern-task
npm install puppeteer --save-dev
node tools/generate_screenshots.js
```

Screenshots will be saved to `screenshots/`.

2) Record a short demo (ffmpeg)
- On Windows you can use `ffmpeg` to record the screen (or use OBS for a GUI recorder).
- Example ffmpeg command (records 1280x720 area at top-left, 30s):

```powershell
ffmpeg -f gdigrab -framerate 30 -offset_x 0 -offset_y 0 -video_size 1280x720 -t 00:00:30 -i desktop -pix_fmt yuv420p demo.mp4
```

- Alternatively, use OBS to record: capture your browser window, follow the demo script (register → login → create task → toggle → edit → delete) and export `demo.mp4`.

3) Packaging for submission
- Include the `screenshots/` folder and `demo.mp4` in your ZIP or attach them with your email.



