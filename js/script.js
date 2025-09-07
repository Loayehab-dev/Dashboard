$(document).ready(function () {
  const rowsPerPage = 5;
  let currentPage = 1;


  function loadData() {
    return $.when(
      $.getJSON("https://jsonplaceholder.typicode.com/users"),
      $.getJSON("https://jsonplaceholder.typicode.com/posts"),
      $.getJSON("https://jsonplaceholder.typicode.com/comments")
    )
      .done(function (usersResponse, postsResponse, commentsResponse) {
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

// Enhanced Table Functionality
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
