# HabitTaskApp


### Security Notes
- JWT key is stored securely using `dotnet user-secrets` (not checked into Git).
- HTTPS enforced and HSTS enabled in production.
- CORS restricted to frontend origin only.
- Connection string uses Windows authentication for local dev; in production this would be stored securely.
