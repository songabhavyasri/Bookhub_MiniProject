import './index.css'
import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import Footer from '../Footer'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import BookshelvesContext from '../../context/BookshelvesContext'

const settings = {
  dots: false,
  infinite: false,
  autoplay: true,
  slidesToScroll: 1,
  slidesToShow: 4,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 786,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ],
}

const apiStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {topRatedBooks: [], topRatedApiStatus: apiStatus.initial}

  componentDidMount() {
    this.getTopRatedBooks()
  }

  getTopRatedBooks = async () => {
    this.setState({topRatedApiStatus: apiStatus.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/book-hub/top-rated-books'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok) {
      const updateState = data.books.map(eachBook => ({
        id: eachBook.id,
        authorName: eachBook.author_name,
        coverPic: eachBook.cover_pic,
        title: eachBook.title,
      }))
      this.setState({
        topRatedBooks: updateState,
        topRatedApiStatus: apiStatus.success,
      })
    } else {
      this.setState({topRatedApiStatus: apiStatus.failure})
    }
  }

  onClickTryAgain = () => {
    this.getTopRatedBooks()
  }

  onClickFindBooks = () => {
    const {history} = this.props
    history.push('/shelf')
  }

  renderSlider = () => {
    const {topRatedBooks} = this.state
    return (
      <BookshelvesContext.Consumer>
        {value => {
          const {themeMode} = value

          return (
            <Slider {...settings}>
              {topRatedBooks.map(eachTopBook => {
                const {id, title, coverPic, authorName} = eachTopBook
                const onClickedTopRatedBook = () => {
                  const {history} = this.props
                  history.push(`/books/${id}`)
                }
                return (
                  <div key={id} className={themeMode ? 'darkMode' : ''}>
                    <button
                      className="sliderBtn"
                      type="button"
                      onClick={onClickedTopRatedBook}
                    >
                      <div className="slick-item">
                        <img
                          className="cover-image"
                          src={coverPic}
                          alt={title}
                        />
                        <h1
                          className={`slider-title ${
                            themeMode && 'colorWhite'
                          }`}
                        >
                          {title}
                        </h1>
                        <p
                          className={`slider-authorName ${
                            themeMode && 'colorWhite'
                          }`}
                        >
                          {authorName}
                        </p>
                      </div>
                    </button>
                  </div>
                )
              })}
            </Slider>
          )
        }}
      </BookshelvesContext.Consumer>
    )
  }

  renderLoaderView = () => (
    <>
      <div className="loader-container" testid="loader">
        <Loader type="TailSpin" color="#0284C7" height={50} width={50} />
      </div>
    </>
  )

  renderFailureView = () => (
    <div className="failureViewContainer">
      <div className="failureContainer">
        <img
          alt="failure view"
          src="https://res.cloudinary.com/dgonqoet4/image/upload/v1686887648/somethingwrong_l7pyto.png"
          className="failureImg"
        />
        <p className="failureViewPara">
          Something went wrong, Please try again.
        </p>
        <button
          type="button"
          className="failureViewRetryBtn"
          onClick={this.onClickTryAgain}
        >
          Try Again
        </button>
      </div>
    </div>
  )

  renderComponentBasedOnTheApiStatus = () => {
    const {topRatedApiStatus} = this.state

    switch (topRatedApiStatus) {
      case apiStatus.success:
        return <>{this.renderSlider()}</>
      case apiStatus.inProgress:
        return <>{this.renderLoaderView()}</>
      case apiStatus.failure:
        return <>{this.renderFailureView()}</>
      default:
        return null
    }
  }

  render() {
    const token = Cookies.get('jwt_token')
    if (token === undefined) {
      return <Redirect to="/login" />
    }

    return (
      <BookshelvesContext.Consumer>
        {value => {
          const {themeMode} = value

          return (
            <div>
              <Header />
              <div className={`home-container ${themeMode && 'darkTheme'}`}>
                <div className="hero-text">
                  <h1 className={`hero-title ${themeMode && 'colorWhite'}`}>
                    Find Your Next Favorite Books?
                  </h1>
                  <p className="hero-desc">
                    You are in the right place. Tell us what titles or genres
                    you have enjoyed in the past, and we will give you
                    surprisingly insightful recommendations.
                  </p>
                  <button
                    type="button"
                    className="topRatedFindBooksMobile"
                    onClick={this.onClickFindBooks}
                  >
                    Find Books
                  </button>
                </div>
                <div
                  className={`topRatedBooksContainer ${
                    themeMode && 'boxColor'
                  }`}
                >
                  <div className="top-rated-row">
                    <h1
                      className={`top-rated-title ${themeMode && 'colorWhite'}`}
                    >
                      Top Rated Books
                    </h1>
                    <button
                      type="button"
                      className="topRatedFindBooks"
                      onClick={this.onClickFindBooks}
                    >
                      Find Books
                    </button>
                  </div>
                  <div className="slick-container">
                    {this.renderComponentBasedOnTheApiStatus()}
                  </div>
                </div>
              </div>
              <Footer />
            </div>
          )
        }}
      </BookshelvesContext.Consumer>
    )
  }
}

export default Home
