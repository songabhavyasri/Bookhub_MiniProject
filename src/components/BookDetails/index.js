import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsFillStarFill} from 'react-icons/bs'
import Header from '../Header'
import Footer from '../Footer'
import BookshelvesContext from '../../context/BookshelvesContext'

const apiStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class BookDetails extends Component {
  state = {bookDetailsList: [], bookDetailsApiStatus: apiStatus.initial}

  componentDidMount() {
    this.getBookDetails()
  }

  getBookDetails = async () => {
    this.setState({bookDetailsApiStatus: apiStatus.inProgress})
    const token = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/book-hub/books/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok) {
      const updateState = {
        id: data.book_details.id,
        aboutAuthor: data.book_details.about_author,
        aboutBook: data.book_details.about_book,
        authorName: data.book_details.author_name,
        coverPic: data.book_details.cover_pic,
        rating: data.book_details.rating,
        readStatus: data.book_details.read_status,
        title: data.book_details.title,
      }
      this.setState({
        bookDetailsList: updateState,
        bookDetailsApiStatus: apiStatus.success,
      })
    } else {
      this.setState({bookDetailsApiStatus: apiStatus.failure})
    }
  }

  onCLickFetchBookDetails = () => {
    this.getBookDetails()
  }

  renderLoaderView = () => (
    <BookshelvesContext.Consumer>
      {value => {
        const {themeMode} = value

        return (
          <div
            className={`spinner-loader-container ${
              themeMode && 'spinner-dark'
            }`}
            testid="loader"
          >
            <Loader type="TailSpin" color="#0284C7" height={50} width={50} />
          </div>
        )
      }}
    </BookshelvesContext.Consumer>
  )

  renderBookDetails = () => {
    const {bookDetailsList} = this.state
    const {
      aboutAuthor,
      aboutBook,
      authorName,
      coverPic,
      rating,
      readStatus,
      title,
    } = bookDetailsList

    return (
      <BookshelvesContext.Consumer>
        {value => {
          const {themeMode, onClickAddToFav, myFav} = value

          const onClickAddToFavData = () => {
            onClickAddToFav({...bookDetailsList})
          }

          const isBookInFavorites = myFav.some(
            book => book.id === bookDetailsList.id,
          )

          return (
            <div className={`bookDetailsContainer ${themeMode && 'bgDark'}`}>
              <div className={`bookDetailsBox ${themeMode && 'boxBgDark'}`}>
                <div className="imgDetails">
                  <img className="detailsImage" alt={title} src={coverPic} />
                  <div className="detailsContainer">
                    <h1
                      className={`details-title ${themeMode && 'colorWhite'}`}
                    >
                      {title}
                    </h1>
                    <p className={`detailsAuthor ${themeMode && 'colorWhite'}`}>
                      {authorName}
                    </p>
                    <p className={`detailsRating ${themeMode && 'colorWhite'}`}>
                      Avg Rating <BsFillStarFill className="star-icon" />
                      <span
                        className={`details-rating ${
                          themeMode && 'colorWhite'
                        }`}
                      >
                        {rating}
                      </span>
                    </p>
                    <p className={`detailsStatus ${themeMode && 'colorWhite'}`}>
                      Status:
                      <span className="details-status"> {readStatus}</span>
                    </p>
                    {isBookInFavorites ? (
                      <button
                        onClick={onClickAddToFavData}
                        type="button"
                        className={
                          isBookInFavorites ? 'disabled' : 'addedFavbtn'
                        }
                        disabled={isBookInFavorites}
                      >
                        Added To Favorite
                      </button>
                    ) : (
                      <button
                        onClick={onClickAddToFavData}
                        type="button"
                        className="favBtn"
                      >
                        Add To Favorite
                      </button>
                    )}
                  </div>
                </div>
                <hr />
                <div>
                  <h1 className={`aboutHeading ${themeMode && 'colorWhite'}`}>
                    About Author
                  </h1>
                  <p className={`aboutAuthor ${themeMode && 'colorWhite'}`}>
                    {aboutAuthor}
                  </p>
                </div>
                <div className="aboutContainer">
                  <h1 className={`aboutHeading ${themeMode && 'colorWhite'}`}>
                    About Book
                  </h1>
                  <p className={`aboutBook ${themeMode && 'colorWhite'}`}>
                    {aboutBook}
                  </p>
                </div>
              </div>
            </div>
          )
        }}
      </BookshelvesContext.Consumer>
    )
  }

  renderFailureView = () => (
    <BookshelvesContext.Consumer>
      {value => {
        const {themeMode} = value

        return (
          <div className={`detailsFailureView ${themeMode && 'bgDark'}`}>
            <img
              className="detailsFailureImage"
              alt="failure view"
              src="https://res.cloudinary.com/dgonqoet4/image/upload/v1686887648/somethingwrong_l7pyto.png"
            />
            <p className="detailsFailureHeading">
              Something went wrong, Please try again.
            </p>
            <button
              type="button"
              className="failureRetryBtn"
              onClick={this.onCLickFetchBookDetails}
            >
              Try Again
            </button>
          </div>
        )
      }}
    </BookshelvesContext.Consumer>
  )

  renderDetailsBasedOnApiStatus = () => {
    const {bookDetailsApiStatus} = this.state

    switch (bookDetailsApiStatus) {
      case apiStatus.success:
        return <>{this.renderBookDetails()}</>
      case apiStatus.inProgress:
        return <>{this.renderLoaderView()}</>
      case apiStatus.failure:
        return <>{this.renderFailureView()}</>

      default:
        return null
    }
  }

  render() {
    const {bookDetailsApiStatus} = this.state
    return (
      <div>
        <Header />
        <div>{this.renderDetailsBasedOnApiStatus()}</div>
        {bookDetailsApiStatus === 'IN_PROGRESS' ? '' : <Footer />}
      </div>
    )
  }
}

export default BookDetails
