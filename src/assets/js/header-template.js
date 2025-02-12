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
          
          /* Theme Toggle Styles */
          .theme-toggle {
            background-color: hsl(48, 90%, 85%);
            border-radius: 25px;
            box-shadow: 0 0 0 2px rgba(68, 165, 160, 0.5);
            padding: 4px;
            width: 60px;
            height: 30px;
            position: relative;
            cursor: pointer;
            transition: background-color 0.3s;
            margin-right: 1rem; /* Add some margin */
        }

          .theme-toggle.dark {
            background-color: hsl(198,90%,15%);
          }

          .toggle-handle {
            position: absolute;
            top: 2px;
            left: 2px;
            width: 26px;
            height: 26px;
            background-color: hsl(48,90%,55%);
            border-radius: 50%;
            transition: transform 0.3s, background-color 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .theme-toggle.dark .toggle-handle {
            transform: translateX(30px);
            background-color: hsl(198,90%,55%);
          }

          .toggle-handle i {
            color: #ffffff;
            font-size: 14px;
          }

          .theme-toggle input {
            display: none;
          }
        </style>
        <header class="app-header">
          <nav class="navbar navbar-expand-lg navbar-light">
            <ul class="navbar-nav">
              <!-- Dark Mode Toggle Button -->
              <li class="nav-item">
                <label class="theme-toggle" id="themeToggle">
                  <input type="checkbox" id="theme">
                  <div class="toggle-handle">
                    <i class="fas fa-sun"></i>
                    <i class="fas fa-moon" style="display: none;"></i>
                  </div>
                </label>
              </li>
              <li class="nav-item d-block d-xl-none">
                <a class="nav-link sidebartoggler nav-icon-hover" id="headerCollapse" href="javascript:void(0)">
                  <i class="ti ti-menu-2"></i>
                </a>
              </li>
            </ul>
            <!-- Rest of the navbar content remains the same -->
            <div class="navbar-collapse justify-content-end px-0" id="navbarNav">
              <ul class="navbar-nav flex-row ms-auto align-items-center justify-content-end">
                <li class="nav-item dropdown">
                  <a class="nav-link nav-icon-hover" href="javascript:void(0)" id="drop2" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src="/src/assets/images/profile/user-1.jpg" alt="" width="40" height="40" class="rounded-circle" />
                  </a>
                  <div class="dropdown-menu dropdown-menu-end dropdown-menu-animate-up" aria-labelledby="drop2">
                    <div class="message-body">
                      <a href="/src/pages/my-profile.html" class="d-flex align-items-center gap-2 dropdown-item">
                        <i class="fa fa-user fs-6"></i>
                        <p class="mb-0 fs-3">My Profile</p>
                      </a>
                      <a href="/src/task-pages/home-my-tasks.html" class="d-flex align-items-center gap-2 dropdown-item">
                        <i class="fa fa-diagram-project fs-6"></i>
                        <p class="mb-0 fs-3">Projects</p>
                      </a>
                      <a href="/src/works/home-work-form.html" class="d-flex align-items-center gap-2 dropdown-item">
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
