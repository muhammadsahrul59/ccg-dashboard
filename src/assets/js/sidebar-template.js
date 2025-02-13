class Sidebar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <aside class="left-sidebar">
        <div>
          <div class="brand-logo d-flex align-items-center justify-content-between">
            <a href="/index.html" class="text-nowrap logo-img">
              <img
                src="/src/assets/images/logos/Bank_Syariah_Indonesia.svg"
                width="180"
                alt="Bank Syariah Indonesia Logo"
                loading="lazy"
              />
            </a>
            <div class="close-btn d-xl-none d-block sidebartoggler cursor-pointer" id="sidebarCollapse">
              <i class="ti ti-x fs-8"></i>
            </div>
          </div>
          <nav class="sidebar-nav scroll-sidebar" data-simplebar="">
            <ul id="sidebarnav" class="list-unstyled">
              <li class="nav-small-cap">
                <i class="ti ti-dots nav-small-cap-icon fs-4"></i>
                <span class="hide-menu">Home</span>
              </li>
              <li class="sidebar-item">
                <a class="sidebar-link" href="#devSubmenu" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="devSubmenu">
                  <span><i class="ti ti-layout-dashboard"></i></span>
                  <span class="hide-menu">Dev Dashboard</span>
                  <i class="fa-solid fa-chevron-down ms-auto"></i>
                </a>
                <div class="collapse" id="devSubmenu">
                  <ul class="list-unstyled">
                    <li><a class="sidebar-link ps-4" href="/src/pages/nitanoreko-dashboard.html"><i class="fa-solid fa-chart-pie"></i><span class="ms-2">Nita Noreko</span></a></li>
                    <li><a class="sidebar-link ps-4" href="/src/pages/syariefhidayat-dashboard.html"><i class="fa-solid fa-chart-pie"></i><span class="ms-2">Syarief Hidayat</span></a></li>
                    <li><a class="sidebar-link ps-4" href="/src/pages/sahrul-dashboard.html"><i class="fa-solid fa-chart-pie"></i><span class="ms-2">Muhammad Sahrul</span></a></li>
                    <li><a class="sidebar-link ps-4" href="/src/pages/akmal-dashboard.html"><i class="fa-solid fa-chart-pie"></i><span class="ms-2">Muhamad Akmal A.</span></a></li>
                    <li><a class="sidebar-link ps-4" href="/src/pages/herlina-dl-dashboard.html"><i class="fa-solid fa-chart-pie"></i><span class="ms-2">Herlina Dwi Lestari</span></a></li>
                  </ul>
                </div>
              </li>
              <li class="sidebar-item"><a class="sidebar-link" href="/src/pages/support-dashboard.html"><i class="ti ti-layout-dashboard"></i><span class="hide-menu">Support Dashboard</span></a></li>
              <li class="sidebar-item"><a class="sidebar-link" href="/src/pages/ch-dashboard.html"><i class="ti ti-layout-dashboard"></i><span class="hide-menu">CH Dashboard</span></a></li>
              <li class="sidebar-item"><a class="sidebar-link" href="/src/pages/sq-dashboard.html"><i class="ti ti-layout-dashboard"></i><span class="hide-menu">SQ Dashboard</span></a></li>
              <hr class="sidebar-divider d-none d-md-block" />
              <li class="nav-small-cap">
                <i class="ti ti-dots nav-small-cap-icon fs-4"></i>
                <span class="hide-menu">Table</span>
              </li>
              <li class="sidebar-item"><a class="sidebar-link" href="/src/dev-table-pages/home-ccg-table.html"><i class="fa fa-table"></i><span class="hide-menu">CCG Project Table Data</span></a></li>
              <li class="sidebar-item"><a class="sidebar-link" href="/src/dev-table-pages/home-ccg-work-table.html"><i class="fa fa-table"></i><span class="hide-menu">CCG Work Table Data</span></a></li>
            </ul>
          </nav>
        </div>
      </aside>
    `;
  }
}

customElements.define("sidebar-template", Sidebar);
