// Posts Management System - posts-script.js

$(document).ready(function () {
  const rowsPerPage = 10;
  let currentPage = 1;
  let allPosts = [];
  let filteredPosts = [];

  // Toastr configuration
  toastr.options = {
    closeButton: true,
    debug: false,
    newestOnTop: true,
    progressBar: true,
    positionClass: "toast-top-right",
    preventDuplicates: false,
    onclick: null,
    showDuration: "300",
    hideDuration: "1000",
    timeOut: "5000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut"
  };

  // Load posts data
  function loadData() {
    $("#loader").fadeIn();

    return $.when(
      $.getJSON("https://jsonplaceholder.typicode.com/posts"),
      $.getJSON("https://jsonplaceholder.typicode.com/users"),
      $.getJSON("https://jsonplaceholder.typicode.com/comments")
    )
      .done(function (postsResponse, usersResponse, commentsResponse) {
        $("#loader").fadeOut();
        toastr.success("Posts data loaded successfully!");

        let posts = postsResponse[0];
        let users = usersResponse[0];
        let comments = commentsResponse[0];

        // Process and enhance posts data
        allPosts = posts.map((post) => {
          const author = users.find((user) => user.id === post.userId);
          const postComments = comments.filter(
            (comment) => comment.postId === post.id
          );

          return {
            id: post.id,
            title: post.title,
            body: post.body,
            author: author ? author.name : "Unknown Author",
            authorEmail: author ? author.email : "unknown@email.com",
            authorUsername: author ? author.username : "unknown",
            userId: post.userId,
            category: getRandomCategory(),
            status: getRandomStatus(),
            views: Math.floor(Math.random() * 10000) + 100,
            likes: Math.floor(Math.random() * 500) + 10,
            comments: postComments.length,
            publishDate: generateRandomDate(),
            thumbnail: `https://picsum.photos/200/150?random=${post.id}`,
            featured: Math.random() > 0.8
          };
        });

        filteredPosts = [...allPosts];
        updateStats();
        renderPostsTable();
        renderPagination();
      })
      .fail(function (error) {
        $("#loader").fadeOut();
        console.error("Error loading data:", error);
        toastr.error("Failed to load posts data!");
      });
  }

  // Helper functions for random data generation
  function getRandomCategory() {
    const categories = [
      "Technology",
      "Travel",
      "Food",
      "Lifestyle",
      "Business",
      "Health",
      "Education",
      "Entertainment"
    ];
    return categories[Math.floor(Math.random() * categories.length)];
  }

  function getRandomStatus() {
    const statuses = ["published", "draft", "pending", "archived"];
    const weights = [0.6, 0.2, 0.15, 0.05]; // Higher probability for published posts
    const rand = Math.random();
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += weights[i];
      if (rand <= sum) return statuses[i];
    }
    return statuses[0];
  }

  function generateRandomDate() {
    const start = new Date(2023, 0, 1);
    const end = new Date();
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  }

  // Update statistics
  function updateStats() {
    const totalPosts = allPosts.length;
    const publishedPosts = allPosts.filter(
      (post) => post.status === "published"
    ).length;
    const draftPosts = allPosts.filter(
      (post) => post.status === "draft"
    ).length;
    const totalViews = allPosts.reduce((sum, post) => sum + post.views, 0);

    $("#total-posts").text(totalPosts);
    $("#published-posts").text(publishedPosts);
    $("#draft-posts").text(draftPosts);
    $("#total-views").text(totalViews.toLocaleString());
  }

  // Render posts table
  function renderPostsTable() {
    const tbody = $("#tableBody");
    tbody.empty();

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const postsToShow = filteredPosts.slice(start, end);

    postsToShow.forEach((post, index) => {
      const row = `
        <tr data-post-id="${post.id}" class="animate__animated animate__fadeIn">
          <td>
            <div class="post-cell">
              <img src="${
                post.thumbnail
              }" class="post-thumbnail" alt="Post thumbnail">
              <div class="post-info">
                <h6 title="${post.title}">${truncateText(post.title, 50)}</h6>
                <p title="${post.body}">${truncateText(post.body, 80)}</p>
              </div>
            </div>
          </td>
          <td>
            <div class="post-author">
              <img src="https://i.pravatar.cc/30?u=${
                post.authorEmail
              }" class="author-avatar" alt="Author">
              <div class="author-info">
                <h6>${post.author}</h6>
                <small>@${post.authorUsername}</small>
              </div>
            </div>
          </td>
          <td>
            <span class="category-tag">${post.category}</span>
          </td>
          <td>
            <span class="status-badge status-${post.status}">
              <i class="fas ${getStatusIcon(post.status)}"></i>
              ${capitalizeFirst(post.status)}
            </span>
          </td>
          <td class="metric-cell">
            ${post.views.toLocaleString()}
            <div class="metric-trend trend-${getRandomTrend()}">
              <i class="fas fa-arrow-${
                getRandomTrend() === "up"
                  ? "up"
                  : getRandomTrend() === "down"
                  ? "down"
                  : "right"
              }"></i>
              ${Math.floor(Math.random() * 20)}%
            </div>
          </td>
          <td class="metric-cell">
            ${post.likes}
            <div class="metric-trend trend-${getRandomTrend()}">
              <i class="fas fa-arrow-${
                getRandomTrend() === "up"
                  ? "up"
                  : getRandomTrend() === "down"
                  ? "down"
                  : "right"
              }"></i>
              ${Math.floor(Math.random() * 15)}%
            </div>
          </td>
          <td class="metric-cell">
            ${post.comments}
          </td>
          <td>
            <small class="text-muted">${formatDate(post.publishDate)}</small>
          </td>
          <td>
            <div class="action-buttons">
              <button class="btn btn-sm btn-light action-btn btn-view" title="View Post">
                <i class="fas fa-eye"></i>
              </button>
              <button class="btn btn-sm btn-light action-btn btn-edit" title="Edit Post">
                <i class="fas fa-edit"></i>
              </button>
              ${
                post.status === "draft" || post.status === "pending"
                  ? `<button class="btn btn-sm btn-light action-btn btn-publish" title="Publish Post">
                  <i class="fas fa-paper-plane"></i>
                </button>`
                  : ""
              }
              <button class="btn btn-sm btn-light action-btn btn-delete" title="Delete Post">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
      tbody.append(row);
    });

    // Initialize post manager after table render
    setTimeout(() => {
      if (window.postManager) {
        window.postManager.updateFavoriteButtons();
      }
    }, 100);
  }

  // Helper functions
  function truncateText(text, maxLength) {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  }

  function getStatusIcon(status) {
    const icons = {
      published: "fa-check-circle",
      draft: "fa-edit",
      pending: "fa-clock",
      archived: "fa-archive"
    };
    return icons[status] || "fa-circle";
  }

  function getRandomTrend() {
    const trends = ["up", "down", "neutral"];
    return trends[Math.floor(Math.random() * trends.length)];
  }

  function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }

  // Render pagination
  function renderPagination() {
    const totalPages = Math.ceil(filteredPosts.length / rowsPerPage);
    const start = (currentPage - 1) * rowsPerPage + 1;
    const end = Math.min(start + rowsPerPage - 1, filteredPosts.length);

    $(".pagination-info span").text(
      `Showing ${start}-${end} of ${filteredPosts.length} entries`
    );

    const paginationControls = $(".pagination-controls");
    paginationControls.empty();

    const prevBtn = $(
      `<button class="btn btn-outline-secondary btn-sm pagination-btn"><i class="fas fa-chevron-left"></i></button>`
    ).prop("disabled", currentPage === 1);
    paginationControls.append(prevBtn);

    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    for (let i = startPage; i <= endPage; i++) {
      const pageBtn = $(
        `<button class="btn btn-sm pagination-btn ${
          i === currentPage ? "btn-primary" : "btn-outline-secondary"
        }">${i}</button>`
      );
      paginationControls.append(pageBtn);
    }

    const nextBtn = $(
      `<button class="btn btn-outline-secondary btn-sm pagination-btn"><i class="fas fa-chevron-right"></i></button>`
    ).prop("disabled", currentPage === totalPages);
    paginationControls.append(nextBtn);

    $(".pagination-btn")
      .off("click")
      .on("click", function () {
        if ($(this).find("i").hasClass("fa-chevron-left")) {
          if (currentPage > 1) currentPage--;
        } else if ($(this).find("i").hasClass("fa-chevron-right")) {
          if (currentPage < totalPages) currentPage++;
        } else {
          currentPage = parseInt($(this).text());
        }
        renderPostsTable();
        renderPagination();
      });
  }

  // Search functionality
  $("#searchInput").on("input", function () {
    const searchTerm = $(this).val().toLowerCase();
    filteredPosts = allPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.body.toLowerCase().includes(searchTerm) ||
        post.author.toLowerCase().includes(searchTerm) ||
        post.category.toLowerCase().includes(searchTerm)
    );
    currentPage = 1;
    renderPostsTable();
    renderPagination();
  });

  // Filter functionality
  $(".filter-btn").on("click", function () {
    $(".filter-btn").removeClass("active").addClass("btn-outline-secondary");
    $(this).removeClass("btn-outline-secondary").addClass("active");

    const filter = $(this).data("filter");

    if (filter === "all") {
      filteredPosts = [...allPosts];
    } else {
      filteredPosts = allPosts.filter((post) => post.status === filter);
    }

    currentPage = 1;
    renderPostsTable();
    renderPagination();
  });

  // Theme toggle functionality
  function updateThemeButton(theme) {
    if (theme === "dark") {
      $("#themeToggle").html('<i class="fas fa-sun"></i> Light');
      $("body").css("background-color", "#0f172a");
    } else {
      $("#themeToggle").html('<i class="fas fa-moon"></i> Dark');
      $("body").css("background-color", "white");
    }
  }

  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  let currentTheme = savedTheme || (systemPrefersDark ? "dark" : "light");

  $("html").attr("data-bs-theme", currentTheme);
  updateThemeButton(currentTheme);

  $("#themeToggle").on("click", function () {
    let currentTheme = $("html").attr("data-bs-theme");
    let newTheme = currentTheme === "light" ? "dark" : "light";

    $("html").attr("data-bs-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeButton(newTheme);
  });

  // Sidebar toggle
  window.toggleSidebar = function () {
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("collapsed");
  };

  // Initialize data loading
  loadData();
});

// Enhanced Posts Management System with Local Storage
class PostsManager {
  constructor() {
    this.favorites = this.loadFavoritesFromStorage();
    this.posts = [];
    this.init();
  }

  init() {
    this.bindActionEvents();
    this.updateFavoriteButtons();
  }

  // Load favorites from localStorage
  loadFavoritesFromStorage() {
    const stored = localStorage.getItem("postFavorites");
    return stored ? JSON.parse(stored) : [];
  }

  // Save favorites to localStorage
  saveFavoritesToStorage() {
    localStorage.setItem("postFavorites", JSON.stringify(this.favorites));
  }

  // Bind event listeners for action buttons
  bindActionEvents() {
    $(document).on("click", ".btn-view", (e) => {
      e.preventDefault();
      const postRow = $(e.target).closest("tr");
      const postData = this.extractPostDataFromRow(postRow);
      this.viewPost(postData);
    });

    $(document).on("click", ".btn-edit", (e) => {
      e.preventDefault();
      const postRow = $(e.target).closest("tr");
      const postData = this.extractPostDataFromRow(postRow);
      this.editPost(postData);
    });

    $(document).on("click", ".btn-delete", (e) => {
      e.preventDefault();
      const postRow = $(e.target).closest("tr");
      const postData = this.extractPostDataFromRow(postRow);
      this.deletePost(postData, postRow);
    });

    $(document).on("click", ".btn-publish", (e) => {
      e.preventDefault();
      const postRow = $(e.target).closest("tr");
      const postData = this.extractPostDataFromRow(postRow);
      this.publishPost(postData, postRow);
    });

    $(document).on("click", ".btn-favorite", (e) => {
      e.preventDefault();
      const postRow = $(e.target).closest("tr");
      const postData = this.extractPostDataFromRow(postRow);
      this.toggleFavorite(postData, $(e.target));
    });

    // Export and view favorites
    $("#exportFavorites").on("click", () => this.exportFavorites());
    $("#viewFavorites").on("click", () => this.viewFavoritesList());
  }

  // Extract post data from table row
  extractPostDataFromRow(row) {
    const postId = row.data("post-id");
    const title = row.find(".post-info h6").text().trim();
    const excerpt = row.find(".post-info p").text().trim();
    const author = row.find(".author-info h6").text().trim();
    const category = row.find(".category-tag").text().trim();
    const status = row.find(".status-badge").text().trim().toLowerCase();
    const views = row.find(".metric-cell").eq(0).text().split("\n")[0].trim();
    const likes = row.find(".metric-cell").eq(1).text().split("\n")[0].trim();
    const comments = row.find(".metric-cell").eq(2).text().trim();
    const date = row.find("td").eq(7).find("small").text().trim();
    const thumbnail = row.find(".post-thumbnail").attr("src");

    return {
      id: postId,
      title,
      excerpt,
      author,
      category,
      status,
      views: parseInt(views.replace(/,/g, "")) || 0,
      likes: parseInt(likes) || 0,
      comments: parseInt(comments) || 0,
      date,
      thumbnail
    };
  }

  // View post details
  viewPost(postData) {
    const modalContent = `
            <div class="post-details">
                <img src="${
                  postData.thumbnail
                }" alt="Post thumbnail" class="img-fluid mb-3">
                <h3>${postData.title}</h3>
                
                <div class="post-meta">
                    <div class="post-meta-item">
                        <i class="fas fa-user"></i>
                        <span>By ${postData.author}</span>
                    </div>
                    <div class="post-meta-item">
                        <i class="fas fa-tag"></i>
                        <span>${postData.category}</span>
                    </div>
                    <div class="post-meta-item">
                        <i class="fas fa-calendar"></i>
                        <span>${postData.date}</span>
                    </div>
                    <div class="post-meta-item">
                        <span class="status-badge status-${postData.status}">
                            <i class="fas ${this.getStatusIcon(
                              postData.status
                            )}"></i>
                            ${this.capitalizeFirst(postData.status)}
                        </span>
                    </div>
                </div>

                <div class="post-content">
                    <p>${postData.excerpt}</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                </div>

                <div class="row text-center">
                    <div class="col-md-3">
                        <h5 class="text-primary">${postData.views.toLocaleString()}</h5>
                        <small class="text-muted">Views</small>
                    </div>
                    <div class="col-md-3">
                        <h5 class="text-success">${postData.likes}</h5>
                        <small class="text-muted">Likes</small>
                    </div>
                    <div class="col-md-3">
                        <h5 class="text-info">${postData.comments}</h5>
                        <small class="text-muted">Comments</small>
                    </div>
                    <div class="col-md-3">
                        <h5 class="text-warning">
                            ${
                              this.favorites.some(
                                (fav) => fav.id == postData.id
                              )
                                ? '<i class="fas fa-star"></i>'
                                : '<i class="far fa-star"></i>'
                            }
                        </h5>
                        <small class="text-muted">Favorite</small>
                    </div>
                </div>
            </div>
        `;

    $("#postModal .modal-title").text("Post Details");
    $("#postModal .modal-body").html(modalContent);
    $("#postModal .modal-footer").html(`
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" onclick="postManager.editPost(${JSON.stringify(
              postData
            ).replace(/"/g, "&quot;")})">Edit Post</button>
        `);
    $("#postModal").modal("show");
  }

  // Edit post
  editPost(postData) {
    const modalContent = `
            <form id="editPostForm">
                <div class="row">
                    <div class="col-md-8">
                        <div class="mb-3">
                            <label for="editTitle" class="form-label">Post Title</label>
                            <input type="text" class="form-control" id="editTitle" value="${
                              postData.title
                            }" required>
                        </div>
                        <div class="mb-3">
                            <label for="editExcerpt" class="form-label">Excerpt</label>
                            <textarea class="form-control" id="editExcerpt" rows="3" required>${
                              postData.excerpt
                            }</textarea>
                        </div>
                        <div class="mb-3">
                            <label for="editContent" class="form-label">Content</label>
                            <textarea class="form-control" id="editContent" rows="6">Lorem ipsum dolor sit amet, consectetur adipiscing elit...</textarea>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="mb-3">
                            <label for="editStatus" class="form-label">Status</label>
                            <select class="form-control" id="editStatus">
                                <option value="draft" ${
                                  postData.status === "draft" ? "selected" : ""
                                }>Draft</option>
                                <option value="pending" ${
                                  postData.status === "pending"
                                    ? "selected"
                                    : ""
                                }>Pending Review</option>
                                <option value="published" ${
                                  postData.status === "published"
                                    ? "selected"
                                    : ""
                                }>Published</option>
                                <option value="archived" ${
                                  postData.status === "archived"
                                    ? "selected"
                                    : ""
                                }>Archived</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="editCategory" class="form-label">Category</label>
                            <select class="form-control" id="editCategory">
                                <option value="Technology" ${
                                  postData.category === "Technology"
                                    ? "selected"
                                    : ""
                                }>Technology</option>
                                <option value="Travel" ${
                                  postData.category === "Travel"
                                    ? "selected"
                                    : ""
                                }>Travel</option>
                                <option value="Food" ${
                                  postData.category === "Food" ? "selected" : ""
                                }>Food</option>
                                <option value="Lifestyle" ${
                                  postData.category === "Lifestyle"
                                    ? "selected"
                                    : ""
                                }>Lifestyle</option>
                                <option value="Business" ${
                                  postData.category === "Business"
                                    ? "selected"
                                    : ""
                                }>Business</option>
                                <option value="Health" ${
                                  postData.category === "Health"
                                    ? "selected"
                                    : ""
                                }>Health</option>
                                <option value="Education" ${
                                  postData.category === "Education"
                                    ? "selected"
                                    : ""
                                }>Education</option>
                                <option value="Entertainment" ${
                                  postData.category === "Entertainment"
                                    ? "selected"
                                    : ""
                                }>Entertainment</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="editAuthor" class="form-label">Author</label>
                            <input type="text" class="form-control" id="editAuthor" value="${
                              postData.author
                            }">
                        </div>
                        <div class="mb-3">
                            <label for="editThumbnail" class="form-label">Thumbnail URL</label>
                            <input type="url" class="form-control" id="editThumbnail" value="${
                              postData.thumbnail
                            }">
                        </div>
                    </div>
                </div>
            </form>
        `;

    $("#postModal .modal-title").text("Edit Post");
    $("#postModal .modal-body").html(modalContent);
    $("#postModal .modal-footer").html(`
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-success" onclick="postManager.savePostChanges('${postData.id}')">Save Changes</button>
        `);
    $("#postModal").modal("show");
  }

  // Save post changes
  savePostChanges(postId) {
    const title = $("#editTitle").val();
    const excerpt = $("#editExcerpt").val();
    const status = $("#editStatus").val();
    const category = $("#editCategory").val();
    const author = $("#editAuthor").val();
    const thumbnail = $("#editThumbnail").val();

    if (!title || !excerpt) {
      toastr.error("Title and excerpt are required!");
      return;
    }

    // Update the row in the table
    const postRow = $(`tr[data-post-id="${postId}"]`);
    if (postRow.length) {
      postRow.find(".post-info h6").text(title);
      postRow.find(".post-info p").text(excerpt);
      postRow.find(".author-info h6").text(author);
      postRow.find(".category-tag").text(category);
      postRow
        .find(".status-badge")
        .removeClass(
          "status-published status-draft status-pending status-archived"
        )
        .addClass(`status-${status}`)
        .html(
          `<i class="fas ${this.getStatusIcon(
            status
          )}"></i> ${this.capitalizeFirst(status)}`
        );

      if (thumbnail) {
        postRow.find(".post-thumbnail").attr("src", thumbnail);
      }
    }

    $("#postModal").modal("hide");
    toastr.success("Post updated successfully!");
  }

  // Delete post
  deletePost(postData, postRow) {
    const confirmModal = `
            <div class="text-center">
                <i class="fas fa-exclamation-triangle text-warning" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <h4>Delete Post</h4>
                <p>Are you sure you want to delete <strong>"${postData.title}"</strong>?</p>
                <p class="text-muted">This action cannot be undone.</p>
            </div>
        `;

    $("#postModal .modal-title").text("Confirm Deletion");
    $("#postModal .modal-body").html(confirmModal);
    $("#postModal .modal-footer").html(`
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" onclick="postManager.confirmDelete('${postData.id}')">Delete Post</button>
        `);
    $("#postModal").modal("show");

    this.pendingDeleteRow = postRow;
  }

  // Confirm delete
  confirmDelete(postId) {
    if (this.pendingDeleteRow) {
      this.pendingDeleteRow.fadeOut(300, () => {
        this.pendingDeleteRow.remove();
      });

      // Remove from favorites if exists
      this.favorites = this.favorites.filter((fav) => fav.id != postId);
      this.saveFavoritesToStorage();

      $("#postModal").modal("hide");
      toastr.success("Post deleted successfully!");
    }
  }

  // Publish post
  publishPost(postData, postRow) {
    postRow
      .find(".status-badge")
      .removeClass("status-draft status-pending")
      .addClass("status-published")
      .html('<i class="fas fa-check-circle"></i> Published');

    postRow.find(".btn-publish").remove();

    toastr.success(`"${postData.title}" has been published!`);
  }

  // Toggle favorite
  toggleFavorite(postData, button) {
    const existingFavorite = this.favorites.find(
      (fav) => fav.id == postData.id
    );

    if (existingFavorite) {
      this.favorites = this.favorites.filter((fav) => fav.id != postData.id);
      button.removeClass("btn-warning").addClass("btn-outline-warning");
      button.find("i").removeClass("fas").addClass("far");
      toastr.info(`"${postData.title}" removed from favorites`);
    } else {
      this.favorites.push(postData);
      button.removeClass("btn-outline-warning").addClass("btn-warning");
      button.find("i").removeClass("far").addClass("fas");
      toastr.success(`"${postData.title}" added to favorites`);
    }

    this.saveFavoritesToStorage();
    this.updateFavoritesCount();
  }

  // Update favorite buttons
  updateFavoriteButtons() {
    setTimeout(() => {
      $("#tableBody tr").each((index, row) => {
        const postData = this.extractPostDataFromRow($(row));
        const isFavorite = this.favorites.some((fav) => fav.id == postData.id);

        const actionButtons = $(row).find(".action-buttons");
        if (actionButtons.find(".btn-favorite").length === 0) {
          const favoriteBtn = $(`
                        <button class="btn btn-sm ${
                          isFavorite ? "btn-warning" : "btn-outline-warning"
                        } action-btn btn-favorite" title="Toggle Favorite">
                            <i class="${
                              isFavorite ? "fas" : "far"
                            } fa-star"></i>
                        </button>
                    `);
          actionButtons.append(favoriteBtn);
        }
      });
      this.updateFavoritesCount();
    }, 100);
  }

  // Update favorites count
  updateFavoritesCount() {
    $("#favoritesCount").text(this.favorites.length);
  }

  // Export favorites
  exportFavorites() {
    if (this.favorites.length === 0) {
      toastr.warning("No favorite posts to export!");
      return;
    }

    const csv = [
      [
        "Title",
        "Author",
        "Category",
        "Status",
        "Views",
        "Likes",
        "Comments",
        "Date"
      ],
      ...this.favorites.map((post) => [
        post.title,
        post.author,
        post.category,
        post.status,
        post.views,
        post.likes,
        post.comments,
        post.date
      ])
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "favorite-posts.csv";
    a.click();
    window.URL.revokeObjectURL(url);

    toastr.success("Favorite posts exported successfully!");
  }

  // View favorites list
  viewFavoritesList() {
    if (this.favorites.length === 0) {
      toastr.info("No favorite posts yet!");
      return;
    }

    const favoritesHtml = this.favorites
      .map(
        (post) => `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-2">
                            <img src="${
                              post.thumbnail
                            }" class="img-fluid rounded" alt="Thumbnail">
                        </div>
                        <div class="col-md-8">
                            <h6 class="card-title mb-1">${post.title}</h6>
                            <p class="card-text text-muted mb-1">${
                              post.excerpt
                            }</p>
                            <small class="text-muted">
                                By ${post.author} • ${post.category} • ${
          post.date
        }
                            </small>
                        </div>
                        <div class="col-md-2 text-end">
                            <span class="status-badge status-${post.status}">
                                <i class="fas ${this.getStatusIcon(
                                  post.status
                                )}"></i>
                                ${this.capitalizeFirst(post.status)}
                            </span>
                            <div class="mt-2">
                                <small class="text-muted">
                                    <i class="fas fa-eye me-1"></i>${post.views.toLocaleString()}
                                    <i class="fas fa-heart ms-2 me-1"></i>${
                                      post.likes
                                    }
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
      )
      .join("");

    $("#postModal .modal-title").text(
      `Favorite Posts (${this.favorites.length})`
    );
    $("#postModal .modal-body").html(`
            <div class="favorites-list" style="max-height: 500px; overflow-y: auto;">
                ${favoritesHtml}
            </div>
        `);
    $("#postModal .modal-footer").html(`
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" onclick="postManager.exportFavorites()">Export List</button>
        `);
    $("#postModal").modal("show");
  }

  // Helper functions
  getStatusIcon(status) {
    const icons = {
      published: "fa-check-circle",
      draft: "fa-edit",
      pending: "fa-clock",
      archived: "fa-archive"
    };
    return icons[status] || "fa-circle";
  }

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  getFavorites() {
    return this.favorites;
  }
}

// Initialize the posts manager
$(document).ready(function () {
  setTimeout(() => {
    window.postManager = new PostsManager();
  }, 1000);
});
