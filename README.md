# Galaxy Portfolio Website

## Overview
This project is a portfolio website for Mack B.S. Briggs. It showcases personal information, education, skills, work experience, and projects. The website is built using HTML, CSS, and JavaScript, providing a clean and interactive user experience.

## Project Structure
```
galaxy
├── index.html         # Main HTML document for the portfolio
├── css
│   └── style.css     # Styles for the portfolio website
├── js
│   └── scripts.js     # JavaScript for interactivity
├── data
│   └── projects.json  # Structured data about projects
├── .gitignore         # Files and directories to ignore by Git
├── LICENSE            # Licensing information
└── README.md          # Documentation for the project
```

## Setup Instructions
1. Clone the repository to your local machine.
2. Open the `index.html` file in a web browser to view the portfolio.
3. Modify the `css/style.css` file to change the styles as needed.
4. Update the `js/scripts.js` file to add any interactivity.
5. Edit the `data/projects.json` file to include your projects.

## Deploying & Hosting (quick guide)

You can host this static site on GitHub Pages, Netlify, or Vercel and attach a custom domain. Below are quick, copy-and-paste instructions.

1) Prepare a clean commit and push to GitHub (if not already):

```powershell
cd "C:\Users\MACK\Desktop\galaxy - Copy"
git init
git add .
git commit -m "Prepare site for deployment"
# create remote repo on GitHub and push (replace placeholders)
git remote add origin https://github.com/<your-username>/<repo>.git
git branch -M main
git push -u origin main
```

2) Netlify (recommended — easiest for custom domains and HTTPS):
- Go to https://app.netlify.com/ and add a new site from Git.
- Connect GitHub, select this repository, and deploy from the `main` branch.
- In Site Settings → Domain management → Add custom domain — point your registrar's DNS records as Netlify instructs. Netlify provisions HTTPS automatically.

3) Vercel (also excellent):
- Sign up at https://vercel.com/, import repository, and deploy. Vercel will provide a shareable URL and automatic HTTPS.

4) GitHub Pages (simple, but manual DNS steps for apex domains):
- In your GitHub repo go to Settings → Pages and select branch `main` + root. Your site will be deployed to `https://<username>.github.io/<repo>`.
- To use a custom domain, add a `CNAME` file in the repo with your domain and configure DNS as explained by GitHub Pages.

Custom domain helper files in this repo:
- `CNAME.example` — shows where to put your domain in the repository root (rename to `CNAME` when you're ready).

If you want, tell me which host you prefer (Netlify / Vercel / GitHub Pages) and whether you already bought a domain — I can prepare the final CNAME file, verify configuration steps, and produce the exact DNS record values you'll need.

## Contributing
Feel free to fork the repository and submit pull requests for any improvements or features you would like to add.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.