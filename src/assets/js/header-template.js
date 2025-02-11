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
          /* New dark mode toggle styles */
          .theme {
            display: flex;
            align-items: center;
            -webkit-tap-highlight-color: transparent;
          }

          .theme__fill,
          .theme__icon {
            transition: 0.3s;
          }

          .theme__fill {
            background-color: var(--bg);
            display: block;
            mix-blend-mode: difference;
            position: fixed;
            inset: 0;
            height: 100%;
            transform: translateX(-100%);
          }

          .theme__icon,
          .theme__toggle {
            z-index: 1;
          }

          .theme__icon,
          .theme__icon-part {
            position: absolute;
          }

          .theme__icon {
            display: block;
            top: 0.25em;  /* Adjusted from 0.5em */
            left: 0.25em; /* Adjusted from 0.5em */
            width: 2.5em; /* Adjusted from 1.5em */
            height: 2.5em; /* Adjusted from 1.5em */
            pointer-events: none; /* Prevent icon from interfering with click */
          }

          .theme__icon-part {
            border-radius: 50%;
            box-shadow: 0.4em -0.4em 0 0.5em hsl(0,0%,100%) inset;
            top: calc(50% - 0.5em);
            left: calc(50% - 0.5em);
            width: 1em;
            height: 1em;
            transition: box-shadow var(--transDur) ease-in-out,
                opacity var(--transDur) ease-in-out,
                transform var(--transDur) ease-in-out;
            transform: scale(0.7);
          }

          .theme__icon-part ~ .theme__icon-part {
            background-color: hsl(0,0%,100%);
            border-radius: 0.05em;
            top: 50%;
            left: calc(50% - 0.05em);
            transform: rotate(0deg) translateY(0.5em);
            transform-origin: 50% 0;
            width: 0.1em;
            height: 0.2em;
          }

          .theme__icon-part:nth-child(3) {
            transform: rotate(45deg) translateY(0.45em);
          }

          .theme__icon-part:nth-child(4) {
            transform: rotate(90deg) translateY(0.45em);
          }

          .theme__icon-part:nth-child(5) {
            transform: rotate(135deg) translateY(0.45em);
          }

          .theme__icon-part:nth-child(6) {
            transform: rotate(180deg) translateY(0.45em);
          }

          .theme__icon-part:nth-child(7) {
            transform: rotate(225deg) translateY(0.45em);
          }

          .theme__icon-part:nth-child(8) {
            transform: rotate(270deg) translateY(0.5em);
          }

          .theme__icon-part:nth-child(9) {
            transform: rotate(315deg) translateY(0.5em);
          }

          .theme__toggle,
          .theme__toggle:before {
            display: block;
          }

          .theme__toggle {
            background-color: hsl(48,90%,85%);
            border-radius: 25% / 50%;
            box-shadow: 0 0 0 0.125em var(--primaryT);
            padding: 0.25em;
            width: 6em;
            height: 3em;
            -webkit-appearance: none;
            appearance: none;
            transition: background-color var(--transDur) ease-in-out,
                box-shadow 0.15s ease-in-out,
                transform var(--transDur) ease-in-out;
            position: relative; /* Added for pseudo-element positioning */
            cursor: pointer;
          }

          .theme__toggle:before {
            background-color: hsl(48,90%,55%);
            border-radius: 50%;
            content: "";
            width: 2.5em;
            height: 2.5em;
            transition: 0.3s;
            position: absolute; /* Added for precise positioning */
            top: 0.25em; /* Added to center vertically */
            left: 0.25em; /* Added to position from left */
          }

          .theme__toggle:checked {
            background-color: hsl(198,90%,15%);
          }

          .theme__toggle:checked:before {
            transform: translateX(3em);
            background-color: hsl(198,90%,55%);
          }

          /* Adjust icon position when toggle is checked */
          .theme__toggle:checked ~ .theme__icon {
            transform: translateX(3em);
          }

          .theme-container {
            margin-right: auto; /* Push everything else to the right */
            margin-left: 1rem; /* Add some spacing from the left edge */
          }

          .theme__toggle-wrap {
            margin: 0 0.75em;
            position: relative; /* Added to contain absolutely positioned elements */
          }

          /* CSS Variables for transitions */
          :root {
            --transDur: 0.3s;
            --primaryT: rgba(68, 165, 160, 0.5);
            --primary: rgb(68, 165, 160);
          }
        </style>
        <header class="app-header">
          <nav class="navbar navbar-expand-lg navbar-light">
            <ul class="navbar-nav">
              <!-- Dark Mode Toggle Button -->
              <li class="nav-item">
                <label for="theme" class="theme">
                  <span class="theme__toggle-wrap">
                    <input id="theme" class="theme__toggle" type="checkbox" role="switch" name="theme" value="dark">
                    <span class="theme__fill"></span>
                    <span class="theme__icon">
                      <span class="theme__icon-part"></span>
                      <span class="theme__icon-part"></span>
                      <span class="theme__icon-part"></span>
                      <span class="theme__icon-part"></span>
                      <span class="theme__icon-part"></span>
                      <span class="theme__icon-part"></span>
                      <span class="theme__icon-part"></span>
                      <span class="theme__icon-part"></span>
                      <span class="theme__icon-part"></span>
                    </span>
                  </span>
                </label>
              </li>
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
                <!-- Profile Dropdown -->
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
                      width="40"
                      height="40"
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
