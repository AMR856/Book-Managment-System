const BASE_URL = window.BASE_API_URL || "http://localhost:5000";

const state = {
  user: null,
  currentView: "books",
};

function getToken() {
  return window.localStorage.getItem("books_token");
}

function setToken(token) {
  if (!token) {
    window.localStorage.removeItem("books_token");
    return;
  }
  window.localStorage.setItem("books_token", token);
}

function authFetch(path, opts = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(opts.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(`${BASE_URL}${path}`, {
    ...opts,
    headers,
  }).then(async (res) => {
    const contentType = res.headers.get("content-type") || "";
    const body = contentType.includes("application/json") ? await res.json() : null;

    if (!res.ok) {
      const message = body?.message || body?.error || res.statusText || "Unknown error";
      throw new Error(typeof message === "string" ? message : JSON.stringify(message));
    }

    return body;
  });
}

function showToast(message, { type = "info", duration = 3000 } = {}) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  toast.style.borderColor = type === "error" ? "var(--danger)" : type === "success" ? "var(--success)" : "rgba(255,255,255,0.14)";

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

function setActiveView(viewId) {
  state.currentView = viewId;
  document.querySelectorAll(".view").forEach((section) => {
    section.hidden = section.dataset.view !== viewId;
  });

  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === viewId);
  });

  if (viewId === "books") {
    loadBooks();
  }
  if (viewId === "authors") {
    loadAuthors();
  }
  if (viewId === "publishers") {
    loadPublishers();
  }
  if (viewId === "orders") {
    loadOrders();
  }
}

function setAuthState(user) {
  state.user = user;
  const authBtn = document.getElementById("auth-btn");
  if (user) {
    authBtn.textContent = `Logout (${user.email})`;
    authBtn.classList.remove("btn-secondary");
    authBtn.classList.add("btn");
  } else {
    authBtn.textContent = "Log in";
    authBtn.classList.remove("btn");
    authBtn.classList.add("btn-secondary");
  }

  const showAdmin = !!user && user.role === "admin";
  document.getElementById("book-crud").hidden = !showAdmin;
  document.getElementById("author-crud").hidden = !showAdmin;
  document.getElementById("publisher-crud").hidden = !showAdmin;
  document.getElementById("order-create").hidden = !user;
}

async function refreshProfile() {
  try {
    const body = await authFetch("/api/auth/profile");
    setAuthState(body.data.user);
  } catch (err) {
    setAuthState(null);
  }
}

function createCard({ title, subtitle, body, actions = [] }) {
  const card = document.createElement("div");
  card.className = "card";

  const titleEl = document.createElement("h3");
  titleEl.textContent = title;
  card.appendChild(titleEl);

  if (subtitle) {
    const subtitleEl = document.createElement("p");
    subtitleEl.textContent = subtitle;
    card.appendChild(subtitleEl);
  }

  if (body) {
    const bodyEl = document.createElement("p");
    bodyEl.textContent = body;
    card.appendChild(bodyEl);
  }

  if (actions.length) {
    const actionsWrap = document.createElement("div");
    actionsWrap.className = "actions";
    actions.forEach((action) => {
      const btn = document.createElement("button");
      btn.className = "btn";
      btn.textContent = action.label;
      btn.addEventListener("click", action.onClick);
      if (action.variant === "danger") {
        btn.style.background = "rgba(255, 92, 106, 0.16)";
        btn.style.borderColor = "rgba(255, 92, 106, 0.28)";
      }
      actionsWrap.appendChild(btn);
    });
    card.appendChild(actionsWrap);
  }

  return card;
}

async function loadBooks() {
  const list = document.getElementById("books-list");
  list.innerHTML = "<div class='card'>Loading books…</div>";

  try {
    const body = await authFetch("/books");
    const items = Array.isArray(body.data) ? body.data : [];

    list.innerHTML = "";
    if (!items.length) {
      list.innerHTML = "<div class='card'>No books available.</div>";
      return;
    }

    items.forEach((book) => {
      const subtitle = `Author: ${book.authorId} • Publisher: ${book.publisherId}`;
      const bodyText = `Price: $${book.price?.toFixed(2) ?? "-"} • Stock: ${book.quantity ?? 0}`;
      const actions = [];

      if (state.user?.role === "admin") {
        actions.push({
          label: "Delete",
          variant: "danger",
          onClick: async () => {
            if (!confirm("Delete this book?")) return;
            try {
              await authFetch(`/books/${book.id}`, { method: "DELETE" });
              showToast("Book deleted", { type: "success" });
              loadBooks();
            } catch (err) {
              showToast(err.message, { type: "error" });
            }
          },
        });
      }

      list.appendChild(
        createCard({
          title: book.title || "Untitled",
          subtitle,
          body: bodyText,
          actions,
        }),
      );
    });
  } catch (err) {
    list.innerHTML = "<div class='card'>Failed to load books.</div>";
    showToast(err.message, { type: "error" });
  }
}

async function loadAuthors() {
  const list = document.getElementById("authors-list");
  list.innerHTML = "<div class='card'>Loading authors…</div>";

  try {
    const body = await authFetch("/authors");
    const items = Array.isArray(body.data) ? body.data : [];

    list.innerHTML = "";
    if (!items.length) {
      list.innerHTML = "<div class='card'>No authors available.</div>";
      return;
    }

    items.forEach((author) => {
      const actions = [];
      if (state.user?.role === "admin") {
        actions.push({
          label: "Delete",
          variant: "danger",
          onClick: async () => {
            if (!confirm("Delete this author?")) return;
            try {
              await authFetch(`/authors/${author.id}`, { method: "DELETE" });
              showToast("Author deleted", { type: "success" });
              loadAuthors();
            } catch (err) {
              showToast(err.message, { type: "error" });
            }
          },
        });
      }

      list.appendChild(
        createCard({
          title: author.name || "Unnamed",
          body: author.bio || "",
          actions,
        }),
      );
    });
  } catch (err) {
    list.innerHTML = "<div class='card'>Failed to load authors.</div>";
    showToast(err.message, { type: "error" });
  }
}

async function loadPublishers() {
  const list = document.getElementById("publishers-list");
  list.innerHTML = "<div class='card'>Loading publishers…</div>";

  try {
    const body = await authFetch("/publishers");
    const items = Array.isArray(body.data) ? body.data : [];

    list.innerHTML = "";
    if (!items.length) {
      list.innerHTML = "<div class='card'>No publishers available.</div>";
      return;
    }

    items.forEach((publisher) => {
      const actions = [];
      if (state.user?.role === "admin") {
        actions.push({
          label: "Delete",
          variant: "danger",
          onClick: async () => {
            if (!confirm("Delete this publisher?")) return;
            try {
              await authFetch(`/publishers/${publisher.id}`, { method: "DELETE" });
              showToast("Publisher deleted", { type: "success" });
              loadPublishers();
            } catch (err) {
              showToast(err.message, { type: "error" });
            }
          },
        });
      }

      const subtitle = publisher.address ? `Address: ${publisher.address}` : "";
      list.appendChild(
        createCard({
          title: publisher.name || "Unnamed",
          subtitle,
          actions,
        }),
      );
    });
  } catch (err) {
    list.innerHTML = "<div class='card'>Failed to load publishers.</div>";
    showToast(err.message, { type: "error" });
  }
}

async function loadOrders() {
  const list = document.getElementById("orders-list");
  list.innerHTML = "<div class='card'>Loading orders…</div>";

  try {
    const body = await authFetch("/orders");
    const items = Array.isArray(body.data) ? body.data : [];

    list.innerHTML = "";
    if (!items.length) {
      list.innerHTML = "<div class='card'>You have no orders.</div>";
      return;
    }

    items.forEach((order) => {
      const subtitle = `Book: ${order.bookId} • Quantity: ${order.quantity}`;
      const bodyText = `Created at: ${new Date(order.createdAt).toLocaleString()}`;
      const actions = [
        {
          label: "Cancel",
          variant: "danger",
          onClick: async () => {
            if (!confirm("Cancel this order?")) return;
            try {
              await authFetch(`/orders/${order.id}`, { method: "DELETE" });
              showToast("Order cancelled", { type: "success" });
              loadOrders();
            } catch (err) {
              showToast(err.message, { type: "error" });
            }
          },
        },
      ];

      list.appendChild(
        createCard({
          title: `Order #${order.id}`,
          subtitle,
          body: bodyText,
          actions,
        }),
      );
    });
  } catch (err) {
    list.innerHTML = "<div class='card'>Failed to load orders.</div>";
    showToast(err.message, { type: "error" });
  }
}

function openAuthModal(type = "login") {
  const modal = document.getElementById("auth-modal");
  const title = document.getElementById("auth-title");
  const submit = document.getElementById("auth-submit");
  const switchText = document.getElementById("auth-switch-text");
  const switchBtn = document.getElementById("auth-switch");

  modal.setAttribute("aria-hidden", "false");

  if (type === "register") {
    title.textContent = "Sign up";
    submit.textContent = "Create account";
    switchText.textContent = "Already have an account?";
    switchBtn.textContent = "Log in";
    switchBtn.dataset.mode = "register"; // current mode
  } else {
    title.textContent = "Log in";
    submit.textContent = "Log in";
    switchText.textContent = "New here?";
    switchBtn.textContent = "Create account";
    switchBtn.dataset.mode = "login"; // current mode
  }

  document.getElementById("auth-email").focus();
}

function closeAuthModal() {
  const modal = document.getElementById("auth-modal");
  modal.setAttribute("aria-hidden", "true");
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const email = formData.get("email").toString().trim();
  const password = formData.get("password").toString().trim();
  if (!email || !password) {
    showToast("Email & password are required", { type: "error" });
    return;
  }

  const mode = document.getElementById("auth-switch").dataset.mode || "login";
  const endpoint = mode === "register" ? "/api/auth/register" : "/api/auth/login";

  try {
    const body = await authFetch(endpoint, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    setToken(body.data.token);
    await refreshProfile();
    closeAuthModal();
    showToast(`Logged in as ${body.data.user.email}`, { type: "success" });
  } catch (err) {
    showToast(err.message, { type: "error" });
  }
}

function handleAuthButton() {
  if (state.user) {
    setToken(null);
    setAuthState(null);
    showToast("Logged out", { type: "success" });
    setActiveView("books");
    return;
  }

  openAuthModal("login");
}

function installEventListeners() {
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => setActiveView(btn.dataset.view));
  });

  document.getElementById("auth-btn").addEventListener("click", handleAuthButton);
  document.getElementById("auth-close").addEventListener("click", closeAuthModal);
  document.getElementById("auth-switch").addEventListener("click", (e) => {
    const current = e.target.dataset.mode || "login";
    const next = current === "login" ? "register" : "login";
    openAuthModal(next);
  });
  document.getElementById("auth-form").addEventListener("submit", handleAuthSubmit);

  document.getElementById("book-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target));
    try {
      await authFetch("/books", {
        method: "POST",
        body: JSON.stringify(data),
      });
      showToast("Book created", { type: "success" });
      event.target.reset();
      loadBooks();
    } catch (err) {
      showToast(err.message, { type: "error" });
    }
  });

  document.getElementById("author-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target));
    try {
      await authFetch("/authors", {
        method: "POST",
        body: JSON.stringify(data),
      });
      showToast("Author created", { type: "success" });
      event.target.reset();
      loadAuthors();
    } catch (err) {
      showToast(err.message, { type: "error" });
    }
  });

  document.getElementById("publisher-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target));
    try {
      await authFetch("/publishers", {
        method: "POST",
        body: JSON.stringify(data),
      });
      showToast("Publisher created", { type: "success" });
      event.target.reset();
      loadPublishers();
    } catch (err) {
      showToast(err.message, { type: "error" });
    }
  });

  document.getElementById("order-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target));
    try {
      await authFetch("/orders", {
        method: "POST",
        body: JSON.stringify(data),
      });
      showToast("Order placed", { type: "success" });
      event.target.reset();
      loadOrders();
    } catch (err) {
      showToast(err.message, { type: "error" });
    }
  });
}

function init() {
  installEventListeners();
  refreshProfile();
  setActiveView(state.currentView);
}

init();
