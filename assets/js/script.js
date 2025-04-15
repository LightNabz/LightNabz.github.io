function toggleMenu() {
    const navLinks = document.getElementById('nav-links');
    const hamburger = document.querySelector('.hamburger');
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
}

/* // Sync repo dari fork orang
const GITHUB_USERNAME = "LightNabz"; 

async function fetchGitHubRepos() {
    const reposContainer = document.getElementById("repos-container");
    reposContainer.innerHTML = "<p>Loading repositories...</p>";

    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos`);
        const repos = await response.json();

        reposContainer.innerHTML = "";

        repos.forEach(repo => {
            const repoBox = document.createElement("div");
            repoBox.className = "repo-box";

            repoBox.innerHTML = `
                <h3>${repo.name}</h3>
                <p>${repo.description || "No description available"}</p>
                <a href="${repo.html_url}" target="_blank">View Repository</a>
            `;

            reposContainer.appendChild(repoBox);
        });
    } catch (error) {
        reposContainer.innerHTML = "<p>Failed to load repositories. Please try again later.</p>";
        console.error("Error fetching GitHub repos:", error);
    }
}

fetchGitHubRepos(); */

window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    
    if (window.scrollY > 50) { 
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

const toggleButton = document.getElementById('toggle-theme');
const themeLink = document.getElementById('theme-style');
const containers = document.querySelectorAll('.background-container'); // ambil semua

let isDark = localStorage.getItem('theme') === 'dark' || !localStorage.getItem('theme');

function applyTheme() {
  if (isDark) {
    themeLink.href = 'assets/css/style.css';
    containers.forEach(container => {
      container.classList.remove('bg-[#f1f1f1]', 'bg-[#f2f2f2]');
      container.classList.add('bg-[#181825]', 'bg-[#1E1E2E]');
    });
  } else {
    themeLink.href = 'assets/css/stylel.css';
    containers.forEach(container => {
      container.classList.remove('bg-[#181825]', 'bg-[#1E1E2E]');
      container.classList.add('bg-[#f1f1f1]', 'bg-[#f2f2f2]');
    });
  }
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

toggleButton.addEventListener('click', () => {
  isDark = !isDark;
  applyTheme();
});

applyTheme();
