const baseURL = "http://localhost:3000/posts";

// Grab DOM elements
const addNewPostBtn = document.getElementById("addNewPostBtn");
const formContainer = document.getElementById("formContainer");
const postForm = document.getElementById("postForm");
const postIdInput = document.getElementById("postId");
const postTitleInput = document.getElementById("postTitle");
const postBodyInput = document.getElementById("postBody");
const cancelBtn = document.getElementById("cancelBtn");
const formTitle = document.getElementById("exampleModalLabel");
const postsTableBody = document.querySelector("#postsTable tbody");

let isEditing = false;

// add button shows the form to create new post
addNewPostBtn.addEventListener("click", () => {
  showForm();
});

// Cancel button hides the form
cancelBtn.addEventListener("click", () => {
  hideForm();
});

// 2. Show and hide form
function showForm() {
  formContainer.classList.remove("hidden");
}
function hideForm() {
  formContainer.classList.add("hidden");
  postForm.reset();
  isEditing = false;
  postIdInput.value = "";
  formTitle.textContent = "Add Post";
}

// Render posts into the table
function renderPosts(posts) {
  postsTableBody.innerHTML = "";
  posts.forEach((post) => {
    const tr = document.createElement("tr");
    tr.innerHTML = ` 
      <td>${post.id}</td> 
      <td>${post.post_title}</td> 
      <td>${post.post_body}</td>
      <td><button class="btn btn-primary btn-sm action-btn editBtn" data-id="${post.id}" data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</button></td> 
      <td><button class="btn btn-danger btn-sm action-btn deleteBtn" data-id="${post.id}">Delete</button></td>
    `;
    postsTableBody.appendChild(tr);
  });
}

// 1. Fetch and display posts (GET)
async function fetchPosts() {
  try {
    const response = await fetch(baseURL);
    const posts = await response.json();
    renderPosts(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

// 3. Create or update post (POST / PUT)
postForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = postTitleInput.value;
  const body = postBodyInput.value;

  if (isEditing) {
    // Update post (PUT)
    const id = postIdInput.value;
    try {
      await fetch(`${baseURL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: parseInt(id),
          post_title: title,
          post_body: body,
        }),
      });
      alert("updated successfully");
    } catch (error) {
      console.error(error);
    }
  } else {
    // Create new post (POST)
    try {
      await fetch(baseURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_title: title,
          post_body: body,
        }),
      });
      alert("added successfully");
    } catch (error) {
      console.error(error);
    }
  }
  hideForm();
  fetchPosts();
});

// 4. Event delegation: Handle Edit and Delete buttons in table
postsTableBody.addEventListener("click", async (e) => {
  if (e.target.classList.contains("editBtn")) {
    // Edit: Fetch current values and populate form
    const id = e.target.dataset.id;
    try {
      const response = await fetch(`${baseURL}/${id}`);
      const post = await response.json();
      postIdInput.value = post.id;
      postTitleInput.value = post.post_title;
      postBodyInput.value = post.post_body;
      isEditing = true;
      formTitle.textContent = "Edit Post";
      showForm();
    } catch (error) {
      console.error(error);
    }
  } else if (e.target.classList.contains("deleteBtn")) {
    // Delete: Remove post
    const id = e.target.dataset.id;
    try {
      await fetch(`${baseURL}/${id}`, { method: "DELETE" });
      alert("deleted succsessfully");
      fetchPosts();
    } catch (error) {
      console.error(error);
    }
  }
});
// Initial fetch of posts
fetchPosts();