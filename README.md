# HabitTaskApp


### Security Notes
- JWT key and Connection string is stored securely using `dotnet user-secrets` (not checked into Git).
- HTTPS enforced and HSTS enabled in production.
- CORS restricted to frontend origin only.
