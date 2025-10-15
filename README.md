# HabitTaskApp
An easy-to-use app for tracking daily tasks and building better habits.
Create an account, set your habits or goals, and check them off as you progress through the day.
Use the built-in calendar to visualize your consistency and stay motivated over time.

I’ve focused on making the app responsive, dynamic, and accessible across all devices — so you can manage your habits anywhere, anytime.

Features

Create and manage custom tasks or habits
Calendar view to track your weekly and monthly progress
Secure user authentication with JWT
Fully responsive frontend built with React + TypeScript
Fast API built in ASP.NET Core with SQL Server

Tech Stack

Frontend: React (TypeScript, Vite)
Backend: ASP.NET Core Web API (C#)
Database: SQL Server / LocalDB
Auth: JSON Web Tokens (JWT)
Styling: Custom CSS

Setup & Run Locally:

Clone the repo
git clone https://github.com/AdamOhlson1/HabitTaskApp.git
cd HabitTaskApp

2️⃣ Backend setup
cd HabitsApp
dotnet restore
dotnet run

3️⃣ Frontend setup
cd clientHabits
npm install
npm run dev

Security Notes

JWT key and connection string are stored securely using dotnet user-secrets (not committed to Git).
HTTPS enforced and HSTS enabled in production.
CORS restricted to allow requests only from the frontend origin.

Future Improvements

Habit streak tracking
Reminders / notifications

About
Built by Adam Ohlson — a passionate fullstack developer focusing on clean, modern, and functional apps.
