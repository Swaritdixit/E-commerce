export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <h3>ShopSphere</h3>
          <p>Everything you need, delivered to your door.</p>
        </div>
        <p>© {new Date().getFullYear()} ShopSphere</p>
      </div>
    </footer>
  );
}