### Blog Develop Environment Setup

#### Setup And Startup

```bash
# create project
npm create vite@latest tech-blog -- --template react-ts
cd tech-blog
npm install

# package install
npm install lucide-react
npm install -D tailwindcss@v3.4.17 postcss autoprefixer gh-pages @types/node
npx tailwindcss init -p

# startup
npm run dev
```

#### GitHub Action and Pages Deploy

```bash
# Manual deployment method(Trigger with empty commit)
git commit --allow-empty -m "chore: trigger workflow after secret update"
git push origin main
```
