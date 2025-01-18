// Fetch GitHub Repositories
const username = 'LightNabz'; // Replace with your GitHub username
const repoList = document.getElementById('repo-list');

// Fetch and display repositories
async function fetchRepos() {
  const response = await fetch(`https://api.github.com/users/${username}/repos`);
  const repos = await response.json();

  repos.forEach(repo => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <h3>${repo.name}</h3>
      <p>${repo.description || 'No description available.'}</p>
      <a href="${repo.html_url}" target="_blank">View Repository</a>
    `;
    repoList.appendChild(listItem);
  });
}

fetchRepos();
