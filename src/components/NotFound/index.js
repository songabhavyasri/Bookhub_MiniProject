import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <div className="notFoundContainer">
    <img
      className="notFoundImage"
      alt="not found"
      src="https://res.cloudinary.com/dgonqoet4/image/upload/v1686887648/pagenotfound_cpctcf.png"
    />
    <h1 className="notFoundTitle">Page Not Found</h1>
    <p className="notFound-desc">
      we are sorry, the page you requested could not be found, Please go back to
      the homepage.
    </p>
    <Link className="link" to="/">
      <button className="goBackBtn" type="button">
        Go Back To Home
      </button>
    </Link>
  </div>
)

export default NotFound
