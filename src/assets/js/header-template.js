class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
        <style>
          .nav-icon-hover i {
            color: #f9ad3c;
          }
          .message-body i {
            color: #f9ad3c;
          }
          .message-body p {
            color: #44a5a0; 
          }
          .message-body a:hover {
            background-color: #f8f9fa;
          }
          #logout {
            color: #44a5a0;
            border-color: #44a5a0;
          }
          #logout:hover {
            background-color: #44a5a0;
            color: white;
          }
          #logout i {
            color: inherit;
          }
        </style>
        <header class="app-header">
          <nav class="navbar navbar-expand-lg navbar-light">
            <ul class="navbar-nav">
              <li class="nav-item d-block d-xl-none">
                <a
                  class="nav-link sidebartoggler nav-icon-hover"
                  id="headerCollapse"
                  href="javascript:void(0)"
                >
                  <i class="ti ti-menu-2"></i>
                </a>
              </li>
            </ul>
            <div
              class="navbar-collapse justify-content-end px-0"
              id="navbarNav"
            >
              <ul
                class="navbar-nav flex-row ms-auto align-items-center justify-content-end"
              >
                <li class="nav-item dropdown">
                  <a
                    class="nav-link nav-icon-hover"
                    href="javascript:void(0)"
                    id="drop2"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      src="/src/assets/images/profile/user-1.jpg"
                      alt=""
                      width="35"
                      height="35"
                      class="rounded-circle"
                    />
                  </a>
                  <div
                    class="dropdown-menu dropdown-menu-end dropdown-menu-animate-up"
                    aria-labelledby="drop2"
                  >
                    <div class="message-body">
                      <a
                        href="/src/pages/my-profile.html"
                        class="d-flex align-items-center gap-2 dropdown-item"
                      >
                        <i class="fa fa-user fs-6"></i>
                        <p class="mb-0 fs-3">My Profile</p>
                      </a>
                      <a
                        href="/src/task-pages/home-my-tasks.html"
                        class="d-flex align-items-center gap-2 dropdown-item"
                      >
                        <i class="fa fa-diagram-project fs-6"></i>
                        <p class="mb-0 fs-3">Projects</p>
                      </a>
                      <a
                        href="/src/works/home-work-form.html"
                        class="d-flex align-items-center gap-2 dropdown-item"
                      >
                        <i class="fa fa-laptop-code fs-6"></i>
                        <p class="mb-0 fs-3">Works</p>
                      </a>
                      <a id="logout" type="logout" class="btn btn-outline-success mx-3 mt-2 d-block">
                        <i class="fas fa-sign-out-alt me-2"></i>Logout
                      </a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </nav>
        </header>
      `;
  }
}

customElements.define("header-template", Header);
