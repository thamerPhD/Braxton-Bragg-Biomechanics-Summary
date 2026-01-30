# Video Sync App

This app is configured to deploy on GitHub Pages using GitHub Actions.

## One-time setup (GitHub Pages)

1. Create a new GitHub repository (name it how you want).
2. Initialize git in this folder and push to GitHub:
   - `git init`
   - `git add .`
   - `git commit -m "Initial commit"`
   - `git branch -M main`
   - `git remote add origin <YOUR_REPO_URL>`
   - `git push -u origin main`
3. In GitHub, go to **Settings → Pages** and set **Source** to **GitHub Actions**.

After the first push, the Actions workflow will build and publish. Your link will be:

```
https://<your-username>.github.io/<your-repo-name>/
```

## Notes

- The build uses a dynamic `base` path for GitHub Pages. If you rename the repo, just push again and the workflow uses the new name automatically.
- The password gate in the UI is client-side only. For stronger security, use GitHub Pages access control alternatives (e.g., private repo + Pages access, or a different host with server-side auth).
