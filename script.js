const API_URL = "https://api.github.com/users/";

const form = document.getElementById("userInput");
const searchBox = document.getElementById("inputBox");
const main = document.getElementById("main");

// Show welcome message at start
main.innerHTML = `
  <div class="card" style="text-align:center; justify-content:center;">
    <h2>Welcome 👋</h2>
    <p>Search for any GitHub user above to see their profile and repos.</p>
  </div>
`;

// Fetch GitHub user data
async function getUser(username) {
  showLoading();

  try {
    const response = await fetch(API_URL + username);

    if (!response.ok) {
      if (response.status === 404) {
        showError("User not found 😢");
      } else {
        showError("Something went wrong. Please try again.");
      }
      return;
    }

    const data = await response.json();
    createUserCard(data);
    getRepos(username);
  } catch (error) {
    showError("Network error. Please check your connection.");
  }
}

// Fetch repositories
async function getRepos(username) {
  try {
    const response = await fetch(API_URL + username + "/repos?sort=created");

    if (!response.ok) {
      showError("Could not load repositories.");
      return;
    }

    const repos = await response.json();
    addReposToCard(repos);
  } catch (error) {
    showError("Error fetching repositories.");
  }
}

// Create user profile card
function createUserCard(user) {
  const cardHTML = `
    <div class="card">
      <div>
        <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
      </div>
      <div class="user-info">
        <h2>${user.name || user.login}</h2>
        <p>${user.bio || "No bio available."}</p>
        <ul>
          <li><strong>${user.followers}</strong> Followers</li>
          <li><strong>${user.following}</strong> Following</li>
          <li><strong>${user.public_repos}</strong> Repos</li>
        </ul>
        <div id="repos"></div>
      </div>
    </div>
  `;

  main.innerHTML = cardHTML;
}

// Add repos to card
function addReposToCard(repos) {
  const reposEl = document.getElementById("repos");

  repos
    .slice(0, 6) // show only latest 6 repos
    .forEach(repo => {
      const repoEl = document.createElement("a");
      repoEl.classList.add("repo");
      repoEl.href = repo.html_url;
      repoEl.target = "_blank";
      repoEl.innerText = repo.name;
      reposEl.appendChild(repoEl);
    });
}

// Show error message
function showError(message) {
  main.innerHTML = `
    <div class="card" style="text-align:center; justify-content:center;">
      <h2 style="color:#ffde59;">${message}</h2>
    </div>
  `;
}

// Show loading spinner
function showLoading() {
  main.innerHTML = `<div class="spinner"></div>`;
}

// Event listener
form.addEventListener("submit", e => {
  e.preventDefault();
  const user = searchBox.value.trim();

  if (user) {
    getUser(user);
    searchBox.value = "";
  }
});

