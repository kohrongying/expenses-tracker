[Expense Tracker Site](http://imma-save-more-money.netlify.app/) is live! You can track your expenses, income and investments here.

### Project Architecture

- ReactJS Framework
- Firebase Firestore
- Deployment, CI/CD: Netlify (Commit to push will trigger build on netlify)

### Updates to UI

#### v3
AI collab (like 10% me 90% claude)

![v3](docs/ui-v3-2026.png)

#### v2
I made this WITHOUT AI (omg proud?)

![new](docs/ui-new.png)

#### v1
Changed from Google's Material UI theme to Ant Design, with a focus on mobile first. [Read more here.](https://blog.rongying.co/babble/2019/08/23/Revisiting-Expense-Tracker/)

![old](docs/ui-old.png)

Old design was a bit tacky but I put up with it cos it was still functional xD

## Contributing

### Setup

Running Expenses Tracker requires a Firebase project. The Firebase project should contain a Web app.

You need the Firebase configuration variables for your Web app, which are provided when you create
the Web app as well as under Project Settings -> Your apps. These are passed into the application
using environment variables. One way to set them is using a `.env.local` file like this:

```
VITE_STAGING_API_KEY=xxx
VITE_STAGING_AUTH_DOMAIN=xxx
VITE_STAGING_DATABASE_URL=xxx
VITE_STAGING_PROJECT_ID=xxx
VITE_STAGING_STORAGE_BUCKET=xxx
VITE_STAGING_MESSAGING_SENDER_ID=xxx
VITE_STAGING_APP_ID=xxx
```

Expenses Tracker currently only supports logging in with Google, so your project should have the
Google sign-in provider enabled. You can enable it from the Firebase console under Develop ->
Authentication -> Sign-in method.

Firebase Firestore needs to be enabled. You need to set the database rules:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

After everything is set up, you can run Expenses Tracker locally using `npm run dev`.

TODO
- [ ] more charts