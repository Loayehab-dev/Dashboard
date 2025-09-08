$(document).ready(function () {
  const rowsPerPage = 5;
  let currentPage = 1;
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
  function loadData() {
    $("#loader").fadeIn();
    return $.when(
      $.getJSON("https://jsonplaceholder.typicode.com/users"),
      $.getJSON("https://jsonplaceholder.typicode.com/posts"),
      $.getJSON("https://jsonplaceholder.typicode.com/comments")
    )
      .done(function (usersResponse, postsResponse, commentsResponse) {
        $("#loader").fadeOut();
     toastr.success("Data has been loaded successfully!");
        let users = usersResponse[0];
        let posts = postsResponse[0];
        let comments = commentsResponse[0];
        //update stats
        $("#users-count").text(users.length); //Users count
        $("#posts-count").text(posts.length); // Posts Count
        $("#comments-count").text(comments.length); //Comment counts
        renderUsersTable(users, posts, comments);
        renderTable();
      })
      .fail(function (error) {
        console.error("Error loading data:", error);
      });
  }
  //insert data to table
  function renderUsersTable(users, posts, comments) {
    const tbody = $("#tableBody");
    tbody.empty();

    users.forEach((user, index) => {
      const status = Math.random() > 0.5 ? "active" : "inactive";

      const userPosts = posts.filter((p) => p.userId === user.id);

      let userCommentsCount = 0;
      userPosts.forEach((p) => {
        const postComments = comments.filter((c) => c.postId === p.id);
        userCommentsCount += postComments.length;
      });

      const likes = Math.floor(Math.random() * 500); //Dummy value

      const row = `
        <tr>
          <td>
            <div class="user-info d-flex align-items-center">
              <img src="https://i.pravatar.cc/40?img=${index + 1}" 
                   class="rounded-circle me-2" width="40" height="40">
              <div>
                <h6 class="mb-0">${user.name}</h6>
                <p class="mb-0 text-muted small">${user.email}</p>
              </div>
            </div>
          </td>
          <td>
            <span class="status-badge status-${status}">
              ${status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </td>
          <td class="metric-cell metric-posts"><span>${
            userPosts.length
          }</span></td>
          <td class="metric-cell metric-likes"><span>${likes}</span></td>
          <td class="metric-cell metric-comments"><span>${userCommentsCount}</span></td>
          <td class="action-buttons">
            <button class="btn btn-sm btn-light action-btn btn-view"><i class="fas fa-eye"></i></button>
            <button class="btn btn-sm btn-light action-btn btn-edit"><i class="fas fa-edit"></i></button>
            <button class="btn btn-sm btn-light action-btn btn-delete"><i class="fas fa-trash"></i></button>
          </td>
        </tr>
      `;
      tbody.append(row);
    });
  }

  // Pagination function
  function renderTable() {
    const rows = $("#tableBody tr");
    const totalRows = rows.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);

    rows.hide();
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    rows.slice(start, end).show();

    $(".pagination-info span").text(
      `Showing ${start + 1}-${Math.min(end, totalRows)} of ${totalRows} entries`
    );

    const paginationControls = $(".pagination-controls");
    paginationControls.empty();

    const prevBtn = $(
      `<button class="pagination-btn"><i class="fas fa-chevron-left"></i></button>`
    ).prop("disabled", currentPage === 1);
    paginationControls.append(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = $(`<button class="pagination-btn">${i}</button>`);
      if (i === currentPage) pageBtn.addClass("active");
      paginationControls.append(pageBtn);
    }

    const nextBtn = $(
      `<button class="pagination-btn"><i class="fas fa-chevron-right"></i></button>`
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
        renderTable();
      });
  }

  
  loadData();
});


$(document).ready(function () {
  var table = $("#statsTable").DataTable();

  // Prevent form submission on search
  $(".search-form").on("submit", function (e) {
    e.preventDefault();
  });

  // Connect the search input to DataTable search API
  $(".search-input").on("keyup", function () {
    table.search(this.value).draw();
  });
});


document.addEventListener("DOMContentLoaded", function () {
  // Search functionality
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", function (e) {
      const searchTerm = e.target.value.toLowerCase();
      const tableRows = document.querySelectorAll("#tableBody tr");

      tableRows.forEach((row) => {
        const userNameEl = row.querySelector(".user-info h6");
        const userRoleEl = row.querySelector(".user-info p");

        if (userNameEl && userRoleEl) {
          const userName = userNameEl.textContent.toLowerCase();
          const userRole = userRoleEl.textContent.toLowerCase();

          if (userName.includes(searchTerm) || userRole.includes(searchTerm)) {
            row.style.display = "";
          } else {
            row.style.display = "none";
          }
        }
      });
    });
  }

  // Filter functionality
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove active class from all buttons
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));

      // Add active class to clicked button
      this.classList.add("active");

      const filter = this.dataset.filter;
      const tableRows = document.querySelectorAll("#tableBody tr");

      tableRows.forEach((row) => {
        if (filter === "all") {
          row.style.display = "";
        } else {
          const statusBadge = row.querySelector(".status-badge");
          if (statusBadge) {
            const statusClass = statusBadge.classList.contains(
              `status-${filter}`
            );

            if (statusClass) {
              row.style.display = "";
            } else {
              row.style.display = "none";
            }
          }
        }
      });
    });
  });

  // Action button functionality
  document.querySelectorAll(".action-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const action = this.classList.contains("btn-view")
        ? "view"
        : this.classList.contains("btn-edit")
        ? "edit"
        : "delete";
      const userRow = this.closest("tr");
      const userNameEl = userRow.querySelector(".user-info h6");

      if (userNameEl) {
        const userName = userNameEl.textContent;
        console.log(`${action} action for user: ${userName}`);

        // Add visual feedback
        this.style.transform = "scale(0.95)";
        setTimeout(() => {
          this.style.transform = "";
        }, 150);
      }
    });
  });

  // Tooltip functionality for action buttons
  document.querySelectorAll(".action-btn").forEach((btn) => {
    btn.addEventListener("mouseleave", function () {
      if (this.tooltipElement) {
        document.body.removeChild(this.tooltipElement);
        this.tooltipElement = null;
      }
    });
  });

  // Animate table rows on load
  const rows = document.querySelectorAll("#tableBody tr");
  rows.forEach((row, index) => {
    row.style.opacity = "0";
    row.style.transform = "translateY(20px)";

    setTimeout(() => {
      row.style.transition = "all 0.5s ease";
      row.style.opacity = "1";
      row.style.transform = "translateY(0)";
    }, index * 100);
  });

  // Set search placeholder with keyboard shortcut hint
  if (searchInput) {
    searchInput.placeholder = "Search users... (Ctrl+K)";
  }

  // Export button functionality
  const existingExportBtn = document.querySelector(".btn-primary");
  if (
    existingExportBtn &&
    existingExportBtn.textContent.includes("Generate Report")
  ) {
    existingExportBtn.addEventListener("click", function (e) {
      e.preventDefault();
      exportTableData();
    });
  }
});

// Keyboard shortcuts
document.addEventListener("keydown", function (e) {
  // Ctrl/Cmd + K for search focus
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.focus();
    }
  }

  // Escape to clear search
  if (e.key === "Escape") {
    const searchInput = document.getElementById("searchInput");
    if (searchInput && searchInput.value) {
      searchInput.value = "";
      searchInput.dispatchEvent(new Event("input"));
    }
    if (searchInput) {
      searchInput.blur();
    }
  }
});

// Export functionality
function exportTableData() {
  const tableData = [];
  const rows = document.querySelectorAll(
    '#tableBody tr:not([style*="display: none"])'
  );

  rows.forEach((row) => {
    const userNameEl = row.querySelector(".user-info h6");
    const userRoleEl = row.querySelector(".user-info p");
    const statusEl = row.querySelector(".status-badge");
    const postsEl = row.querySelector(".metric-posts");
    const likesEl = row.querySelector(".metric-likes");
    const commentsEl = row.querySelector(".metric-comments");

    if (
      userNameEl &&
      userRoleEl &&
      statusEl &&
      postsEl &&
      likesEl &&
      commentsEl
    ) {
      const userName = userNameEl.textContent;
      const userRole = userRoleEl.textContent;
      const status = statusEl.textContent.trim();
      const posts = postsEl.firstChild.textContent.trim();
      const likes = likesEl.firstChild.textContent.trim();
      const comments = commentsEl.firstChild.textContent.trim();

      tableData.push({
        name: userName,
        role: userRole,
        status: status,
        posts: posts,
        likes: likes,
        comments: comments
      });
    }
  });

  if (tableData.length > 0) {
    // Convert to CSV
    const csv = [
      ["Name", "Role", "Status", "Posts", "Likes", "Comments"],
      ...tableData.map((row) => [
        row.name,
        row.role,
        row.status,
        row.posts,
        row.likes,
        row.comments
      ])
    ]
      .map((row) => row.join(","))
      .join("\n");

    // Download CSV
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "user-statistics.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

// function toggleSidebar() {
//   const sidebar = document.querySelector(".sidebar");
//   sidebar.classList.toggle("collapsed");
// }
// $(document).ready(function () {
//   $("#themeToggle").on("click", function () {
//     let currentTheme = $("html").attr("data-bs-theme");

//     if (currentTheme === "light") {
//       $("html").attr("data-bs-theme", "dark");
//         $("body").css("background-color", "#0f172a");
     
      
//       $(this).html('<i class="fas fa-sun"></i> Light ');
//     } else {
//       $("html").attr("data-bs-theme", "light");
//       $("body").css("background-color", "white");
       
      
//       $(this).html('<i class="fas fa-moon"></i> Dark ');
//     }
//   });
// });

  function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("collapsed");
  }

  $(document).ready(function () {
    // 
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
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
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
  });



// Uncomment the line below to enable automatic metric updates every 30 seconds
// setInterval(updateMetrics, 30000);
// Enhanced User Management System - Add this to your existing script.js file

// User Management Class with Local Storage
class EnhancedUserManager {
    constructor() {
        this.favorites = this.loadFavoritesFromStorage();
        this.users = [];
        this.init();
    }

    init() {
        this.bindActionEvents();
        this.createModals();
        this.updateFavoriteButtons();
    }

    // Load favorites from localStorage
    loadFavoritesFromStorage() {
        const stored = localStorage.getItem('userFavorites');
        return stored ? JSON.parse(stored) : [];
    }

    // Save favorites to localStorage
    saveFavoritesToStorage() {
        localStorage.setItem('userFavorites', JSON.stringify(this.favorites));
    }

    // Save users to localStorage
    saveUsersToStorage() {
        localStorage.setItem('usersData', JSON.stringify(this.users));
    }

    // Load users from localStorage
    loadUsersFromStorage() {
        const stored = localStorage.getItem('usersData');
        return stored ? JSON.parse(stored) : [];
    }

    // Bind event listeners for action buttons
    bindActionEvents() {
        // Use event delegation for dynamically created buttons
        $(document).on('click', '.btn-view', (e) => {
            e.preventDefault();
            const userRow = $(e.target).closest('tr');
            const userData = this.extractUserDataFromRow(userRow);
            this.viewUser(userData);
        });

        $(document).on('click', '.btn-edit', (e) => {
            e.preventDefault();
            const userRow = $(e.target).closest('tr');
            const userData = this.extractUserDataFromRow(userRow);
            this.editUser(userData);
        });

        $(document).on('click', '.btn-delete', (e) => {
            e.preventDefault();
            const userRow = $(e.target).closest('tr');
            const userData = this.extractUserDataFromRow(userRow);
            this.deleteUser(userData, userRow);
        });

        $(document).on('click', '.btn-favorite', (e) => {
            e.preventDefault();
            const userRow = $(e.target).closest('tr');
            const userData = this.extractUserDataFromRow(userRow);
            this.toggleFavorite(userData, $(e.target));
        });
    }

    // Extract user data from table row
    extractUserDataFromRow(row) {
        const userInfo = row.find('.user-info');
        const name = userInfo.find('h6').text().trim();
        const email = userInfo.find('p').text().trim();
        const status = row.find('.status-badge').text().trim().toLowerCase();
        const posts = row.find('.metric-posts span').text().trim();
        const likes = row.find('.metric-likes span').text().trim();
        const comments = row.find('.metric-comments span').text().trim();
        const avatar = row.find('img').attr('src') || '';

        // Generate unique ID based on email
        const id = btoa(email).replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);

        return {
            id,
            name,
            email,
            status,
            posts: parseInt(posts) || 0,
            likes: parseInt(likes) || 0,
            comments: parseInt(comments) || 0,
            avatar
        };
    }

    // View user details
    viewUser(userData) {
        const modalContent = `
            <div class="user-details">
                <div class="text-center mb-4">
                    <img src="${userData.avatar}" class="rounded-circle mb-3" width="80" height="80" alt="Avatar">
                    <h4>${userData.name}</h4>
                    <p class="text-muted">${userData.email}</p>
                    <span class="status-badge status-${userData.status}">${this.capitalizeFirst(userData.status)}</span>
                </div>
                <div class="row">
                    <div class="col-md-4 text-center">
                        <h5 class="text-primary">${userData.posts}</h5>
                        <small class="text-muted">Posts</small>
                    </div>
                    <div class="col-md-4 text-center">
                        <h5 class="text-success">${userData.likes}</h5>
                        <small class="text-muted">Likes</small>
                    </div>
                    <div class="col-md-4 text-center">
                        <h5 class="text-info">${userData.comments}</h5>
                        <small class="text-muted">Comments</small>
                    </div>
                </div>
                <hr>
                <div class="d-flex justify-content-between">
                    <small class="text-muted">User ID: ${userData.id}</small>
                    <small class="text-muted">Joined: ${new Date().toLocaleDateString()}</small>
                </div>
            </div>
        `;

        $('#userModal .modal-title').text('User Details');
        $('#userModal .modal-body').html(modalContent);
        $('#userModal .modal-footer').html(`
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" onclick="userManager.editUser(${JSON.stringify(userData).replace(/"/g, '&quot;')})">Edit User</button>
        `);
        $('#userModal').modal('show');
    }

    // Edit user
    editUser(userData) {
        const modalContent = `
            <form id="editUserForm">
                <div class="mb-3">
                    <label for="editName" class="form-label">Name</label>
                    <input type="text" class="form-control" id="editName" value="${userData.name}" required>
                </div>
                <div class="mb-3">
                    <label for="editEmail" class="form-label">Email</label>
                    <input type="email" class="form-control" id="editEmail" value="${userData.email}" required>
                </div>
                <div class="mb-3">
                    <label for="editStatus" class="form-label">Status</label>
                    <select class="form-control" id="editStatus">
                        <option value="active" ${userData.status === 'active' ? 'selected' : ''}>Active</option>
                        <option value="inactive" ${userData.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                        <option value="pending" ${userData.status === 'pending' ? 'selected' : ''}>Pending</option>
                    </select>
                </div>
                <div class="row">
                    <div class="col-md-4">
                        <label for="editPosts" class="form-label">Posts</label>
                        <input type="number" class="form-control" id="editPosts" value="${userData.posts}">
                    </div>
                    <div class="col-md-4">
                        <label for="editLikes" class="form-label">Likes</label>
                        <input type="number" class="form-control" id="editLikes" value="${userData.likes}">
                    </div>
                    <div class="col-md-4">
                        <label for="editComments" class="form-label">Comments</label>
                        <input type="number" class="form-control" id="editComments" value="${userData.comments}">
                    </div>
                </div>
            </form>
        `;

        $('#userModal .modal-title').text('Edit User');
        $('#userModal .modal-body').html(modalContent);
        $('#userModal .modal-footer').html(`
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" onclick="userManager.saveUserChanges('${userData.id}')">Save Changes</button>
        `);
        $('#userModal').modal('show');
    }

    // Save user changes
    saveUserChanges(userId) {
        const name = $('#editName').val();
        const email = $('#editEmail').val();
        const status = $('#editStatus').val();
        const posts = parseInt($('#editPosts').val()) || 0;
        const likes = parseInt($('#editLikes').val()) || 0;
        const comments = parseInt($('#editComments').val()) || 0;

        if (!name || !email) {
            toastr.error('Name and email are required!');
            return;
        }

        // Update the row in the table
        const userRow = $(`tr`).filter((i, row) => {
            const rowEmail = $(row).find('.user-info p').text().trim();
            return rowEmail === email || this.extractUserDataFromRow($(row)).id === userId;
        }).first();

        if (userRow.length) {
            userRow.find('.user-info h6').text(name);
            userRow.find('.user-info p').text(email);
            userRow.find('.status-badge')
                .removeClass('status-active status-inactive status-pending')
                .addClass(`status-${status}`)
                .text(this.capitalizeFirst(status));
            userRow.find('.metric-posts span').text(posts);
            userRow.find('.metric-likes span').text(likes);
            userRow.find('.metric-comments span').text(comments);
        }

        // Save to localStorage
        const updatedUser = { id: userId, name, email, status, posts, likes, comments };
        this.updateUserInStorage(updatedUser);

        $('#userModal').modal('hide');
        toastr.success('User updated successfully!');
    }

    // Delete user
    deleteUser(userData, userRow) {
        const confirmModal = `
            <div class="text-center">
                <i class="fas fa-exclamation-triangle text-warning" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <h4>Delete User</h4>
                <p>Are you sure you want to delete <strong>${userData.name}</strong>?</p>
                <p class="text-muted">This action cannot be undone.</p>
            </div>
        `;

        $('#userModal .modal-title').text('Confirm Deletion');
        $('#userModal .modal-body').html(confirmModal);
        $('#userModal .modal-footer').html(`
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" onclick="userManager.confirmDelete('${userData.id}', this)">Delete User</button>
        `);
        $('#userModal').modal('show');

        // Store row reference for deletion
        this.pendingDeleteRow = userRow;
    }

    // Confirm delete
    confirmDelete(userId, button) {
        if (this.pendingDeleteRow) {
            // Animate row removal
            this.pendingDeleteRow.fadeOut(300, () => {
                this.pendingDeleteRow.remove();
                // Update pagination after removal
                if (typeof renderTable === 'function') {
                    renderTable();
                }
            });

            // Remove from favorites if exists
            this.favorites = this.favorites.filter(fav => fav.id !== userId);
            this.saveFavoritesToStorage();

            // Remove from storage
            this.removeUserFromStorage(userId);

            $('#userModal').modal('hide');
            toastr.success('User deleted successfully!');
        }
    }

    // Toggle favorite
    toggleFavorite(userData, button) {
        const existingFavorite = this.favorites.find(fav => fav.id === userData.id);

        if (existingFavorite) {
            // Remove from favorites
            this.favorites = this.favorites.filter(fav => fav.id !== userData.id);
            button.removeClass('btn-warning').addClass('btn-outline-warning');
            button.find('i').removeClass('fas').addClass('far');
            toastr.info(`${userData.name} removed from favorites`);
        } else {
            // Add to favorites
            this.favorites.push(userData);
            button.removeClass('btn-outline-warning').addClass('btn-warning');
            button.find('i').removeClass('far').addClass('fas');
            toastr.success(`${userData.name} added to favorites`);
        }

        this.saveFavoritesToStorage();
    }

    // Update favorite buttons
    updateFavoriteButtons() {
        setTimeout(() => {
            $('#tableBody tr').each((index, row) => {
                const userData = this.extractUserDataFromRow($(row));
                const isFavorite = this.favorites.some(fav => fav.id === userData.id);
                
                // Add favorite button if it doesn't exist
                const actionButtons = $(row).find('.action-buttons');
                if (actionButtons.find('.btn-favorite').length === 0) {
                    const favoriteBtn = $(`
                        <button class="btn btn-sm ${isFavorite ? 'btn-warning' : 'btn-outline-warning'} action-btn btn-favorite" title="Toggle Favorite">
                            <i class="${isFavorite ? 'fas' : 'far'} fa-star"></i>
                        </button>
                    `);
                    actionButtons.append(favoriteBtn);
                }
            });
        }, 100);
    }

    // Create modal HTML if it doesn't exist
    createModals() {
        if ($('#userModal').length === 0) {
            const modalHTML = `
                <div class="modal fade" id="userModal" tabindex="-1" aria-labelledby="userModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="userModalLabel">User Details</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <!-- Content will be dynamically inserted here -->
                            </div>
                            <div class="modal-footer">
                                <!-- Footer buttons will be dynamically inserted here -->
                            </div>
                        </div>
                    </div>
                </div>
            `;
            $('body').append(modalHTML);
        }
    }

    // Helper functions
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    updateUserInStorage(user) {
        let users = this.loadUsersFromStorage();
        const index = users.findIndex(u => u.id === user.id);
        if (index !== -1) {
            users[index] = user;
        } else {
            users.push(user);
        }
        localStorage.setItem('usersData', JSON.stringify(users));
    }

    removeUserFromStorage(userId) {
        let users = this.loadUsersFromStorage();
        users = users.filter(u => u.id !== userId);
        localStorage.setItem('usersData', JSON.stringify(users));
    }

    // Get favorites list
    getFavorites() {
        return this.favorites;
    }

    // Export favorites
    exportFavorites() {
        if (this.favorites.length === 0) {
            toastr.warning('No favorites to export!');
            return;
        }

        const csv = [
            ['Name', 'Email', 'Status', 'Posts', 'Likes', 'Comments'],
            ...this.favorites.map(user => [
                user.name,
                user.email,
                user.status,
                user.posts,
                user.likes,
                user.comments
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'favorite-users.csv';
        a.click();
        window.URL.revokeObjectURL(url);

        toastr.success('Favorites exported successfully!');
    }
}

// Initialize the enhanced user manager
let userManager;

// Update the existing document ready function
$(document).ready(function() {
    // Initialize user manager after a short delay to ensure DOM is ready
    setTimeout(() => {
        userManager = new EnhancedUserManager();
    }, 500);

    // Add favorites export button to the interface
    if ($('.table-controls .filter-buttons').length > 0) {
        $('.table-controls .filter-buttons').append(`
            <button class="btn btn-outline-primary btn-sm ms-2" id="exportFavorites">
                <i class="fas fa-star me-1"></i> Export Favorites
            </button>
            <button class="btn btn-outline-info btn-sm ms-2" id="viewFavorites">
                <i class="fas fa-heart me-1"></i> View Favorites (<span id="favoritesCount">0</span>)
            </button>
        `);

        // Bind export favorites button
        $('#exportFavorites').on('click', function() {
            if (userManager) {
                userManager.exportFavorites();
            }
        });

        // Bind view favorites button
        $('#viewFavorites').on('click', function() {
            if (userManager) {
                const favorites = userManager.getFavorites();
                if (favorites.length === 0) {
                    toastr.info('No favorite users yet!');
                    return;
                }

                const favoritesHtml = favorites.map(user => `
                    <div class="card mb-2">
                        <div class="card-body p-2">
                            <div class="d-flex align-items-center">
                                <img src="${user.avatar}" class="rounded-circle me-2" width="40" height="40">
                                <div>
                                    <h6 class="mb-0">${user.name}</h6>
                                    <small class="text-muted">${user.email}</small>
                                </div>
                                <div class="ms-auto">
                                    <span class="status-badge status-${user.status}">${user.status}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('');

                $('#userModal .modal-title').text(`Favorite Users (${favorites.length})`);
                $('#userModal .modal-body').html(`
                    <div class="favorites-list" style="max-height: 400px; overflow-y: auto;">
                        ${favoritesHtml}
                    </div>
                `);
                $('#userModal .modal-footer').html(`
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" onclick="userManager.exportFavorites()">Export List</button>
                `);
                $('#userModal').modal('show');
            }
        });
    }

    // Update favorites count periodically
    setInterval(() => {
        if (userManager) {
            const count = userManager.getFavorites().length;
            $('#favoritesCount').text(count);
        }
    }, 1000);
});


const originalRenderUsersTable = window.renderUsersTable;
window.renderUsersTable = function(users, posts, comments) {
    
    if (originalRenderUsersTable) {
        originalRenderUsersTable(users, posts, comments);
    }
    
    setTimeout(() => {
        if (userManager) {
            userManager.updateFavoriteButtons();
        }
    }, 100);
};