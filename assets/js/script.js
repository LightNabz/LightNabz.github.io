function toggleMenu() {
  const navLinks = document.getElementById('nav-links');
  const hamburger = document.querySelector('.hamburger');
  navLinks.classList.toggle('active');
  hamburger.classList.toggle('active');
}

// Disini buat sync repo
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

fetchGitHubRepos();

