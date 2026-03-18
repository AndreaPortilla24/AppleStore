function Footer() {

  return (
    <footer className="container py-5">

      <div className="row">

        <div className="col-12 col-md">

          <small className="d-block mb-3 text-muted">
            © 2017–2026
          </small>

        </div>

        <div className="col-6 col-md">

          <h5>Features</h5>

          <ul className="list-unstyled text-small">
            <li><a className="link-secondary" href="#">Cool stuff</a></li>
            <li><a className="link-secondary" href="#">Random feature</a></li>
            <li><a className="link-secondary" href="#">Team feature</a></li>
          </ul>

        </div>

        <div className="col-6 col-md">

          <h5>Resources</h5>

          <ul className="list-unstyled text-small">
            <li><a className="link-secondary" href="#">Resource</a></li>
            <li><a className="link-secondary" href="#">Another resource</a></li>
          </ul>

        </div>

        <div className="col-6 col-md">

          <h5>About</h5>

          <ul className="list-unstyled text-small">
            <li><a className="link-secondary" href="#">Team</a></li>
            <li><a className="link-secondary" href="#">Locations</a></li>
          </ul>

        </div>

      </div>

    </footer>
  );

}

export default Footer;