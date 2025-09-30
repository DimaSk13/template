import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="app">
      <Header />
      <main className="main-content-area">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// === Header Component ===
function Header() {
  return (
    <nav className="nav-bar">
      <div className="header-logo">
        <a href="/" className="logo-anchor">
          Last.fm
        </a>
      </div>

      <div className="nav-wrap">
        <a className="search-icon-link" href="/search" aria-label="Search">
          {/* Search icon handled via CSS */}
        </a>

        <div className="header-nav">
          <ul className="nav-menu-list" role="menubar">
            <NavItem label="Live" />
            <NavItem label="Music" />
            <NavItem label="Charts" />
            <NavItem label="Events" />
          </ul>
        </div>

        <a className="user-avatar-link" aria-label="User profile">
          <img className="avatar-image" src="img/avatar.png" loading="eager" {...{ fetchpriority: 'high' }} />
        </a>
      </div>
    </nav>
  );
}

function NavItem({ label }: { label: string }) {
  return (
    <li className="nav-menu-item" role="menuitem">
      <a className="nav-menu-link">{label}</a>
    </li>
  );
}

// === Footer Component ===
function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-wrapper">
        <div className="footer-upper">
          <FooterSection title="Company">
            <FooterLink>About Last.fm</FooterLink>
            <FooterLink>Contact Us</FooterLink>
            <FooterLink>Jobs</FooterLink>
            <FooterLink>Features</FooterLink>
          </FooterSection>

          <FooterSection title="Help">
            <FooterLink>Track My Music</FooterLink>
            <FooterLink>Community Support</FooterLink>
            <FooterLink>Community Guidelines</FooterLink>
            <FooterLink>Help</FooterLink>
          </FooterSection>

          <FooterSection title="Goodies">
            <FooterLink>Download Scrobbler</FooterLink>
            <FooterLink>Developer API</FooterLink>
            <FooterLink>Free Music Downloads</FooterLink>
            <FooterLink>Merchandise</FooterLink>
          </FooterSection>

          <FooterSection title="Account">
            <FooterLink>Inbox</FooterLink>
            <FooterLink>Settings</FooterLink>
            <FooterLink>Last.fm Pro</FooterLink>
            <FooterLink>Logout</FooterLink>
          </FooterSection>

          <FooterSection title="Follow Us">
            <FooterLink>Facebook</FooterLink>
            <FooterLink>Bluesky</FooterLink>
            <FooterLink>Instagram</FooterLink>
            <FooterLink>YouTube</FooterLink>
          </FooterSection>
        </div>

        <div className="footer-bottom-bar">
          <div className="footer-info-block">
            <div className="language-switcher">
              <a className="language-option language-option--active">English</a>
              <a className="language-option">Deutsch</a>
              <a className="language-option">Español</a>
              <a className="language-option">Français</a>
              <a className="language-option">Italiano</a>
              <a className="language-option">日本語</a>
              <a className="language-option">Polski</a>
              <a className="language-option">Português</a>
              <a className="language-option">Русский</a>
              <a className="language-option">Svenska</a>
              <a className="language-option">Türkçe</a>
              <a className="language-option">简体中文</a>
            </div>

            <div className="timezone-display">Time zone: Europe/Moscow</div>

            <div className="legal-notice">
              CBS Interactive © 2025 Last.fm Ltd. All rights reserved · Terms of Use · Privacy Policy · Legal Policies · California Notice · Your Privacy Choices · Jobs at Paramount · Last.fm Music
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// === Reusable Components for Footer ===
function FooterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="footer-column">
      <h4 className="footer-column-title">{title}</h4>
      <ul className="footer-links-list">{children}</ul>
    </div>
  );
}

function FooterLink({ children }: { children: React.ReactNode }) {
  return (
    <li className="footer-link-item">
      <a className="footer-link">{children}</a>
    </li>
  );
}