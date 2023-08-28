import './index.css'
import {Component} from 'react'
import {Link} from 'react-router-dom'
import {BsFillStarFill, BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import Footer from '../Footer'
import BookshelvesContext from '../../context/BookshelvesContext'

const bookshelvesList = [
  {
    id: '22526c8e-680e-4419-a041-b05cc239ece4',
    value: 'ALL',
    label: 'All',
  },
  {
    id: '37e09397-fab2-46f4-9b9a-66b2324b2e22',
    value: 'READ',
    label: 'Read',
  },
  {
    id: '2ab42512-3d05-4fba-8191-5122175b154e',
    value: 'CURRENTLY_READING',
    label: 'Currently Reading',
  },
  {
    id: '361d5fd4-9ea1-4e0c-bd47-da2682a5b7c8',
    value: 'WANT_TO_READ',
    label: 'Want to Read',
  },
]

const apiStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Bookshelves extends Component {
  state = {
    booksShelvesDetails: [],
    bookshelfName: bookshelvesList[0].value,
    bookShelvesApiStatus: apiStatus.initial,
    sidebarLabel: bookshelvesList[0].label,
    userSearchInput: '',
  }

  componentDidMount() {
    this.getBookShelvesDetails()
  }

  getBookShelvesDetails = async () => {
    this.setState({bookShelvesApiStatus: apiStatus.inProgress})
    const token = Cookies.get('jwt_token')
    const {bookshelfName, userSearchInput} = this.state
    const apiUrl = `https://apis.ccbp.in/book-hub/books?shelf=${bookshelfName}&search=${userSearchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok) {
      const updateState = data.books.map(each => ({
        id: each.id,
        authorName: each.author_name,
        coverPic: each.cover_pic,
        rating: each.rating,
        readStatus: each.read_status,
        title: each.title,
      }))
      this.setState({
        booksShelvesDetails: updateState,
        bookShelvesApiStatus: apiStatus.success,
      })
    } else {
      this.setState({bookShelvesApiStatus: apiStatus.failure})
    }
  }

  onChangeUserSearchInput = event => {
    this.setState({userSearchInput: event.target.value})
  }

  onClickSearchData = () => {
    this.getBookShelvesDetails()
  }

  onKeyDown = event => {
    if (event.key === 'Enter') {
      this.getBookShelvesDetails()
    }
  }

  onClickRetryRequestBtn = () => {
    this.getBookShelvesDetails()
  }

  renderBookShelvesList = () => {
    const {booksShelvesDetails, userSearchInput} = this.state
    return (
      <BookshelvesContext.Consumer>
        {value => {
          const {themeMode} = value

          return (
            <>
              {booksShelvesDetails.length === 0 ? (
                <div className="notFoundContainer">
                  <img
                    className="noResultsImage"
                    alt="no books"
                    src="https://res.cloudinary.com/dgonqoet4/image/upload/v1687407824/Asset_1_1chj_xdjtgy.png"
                  />
                  <p className="notFoundText">
                    Your search for
                    <span className={`userSearch ${themeMode && 'colorWhite'}`}>
                      {' '}
                      {userSearchInput}
                    </span>{' '}
                    did not find any matches.
                  </p>
                </div>
              ) : (
                <div className="booksList">
                  {booksShelvesDetails.map(eachBook => (
                    <Link
                      className="link"
                      key={eachBook.id}
                      to={`/books/${eachBook.id}`}
                    >
                      <li className="bookShelvesDetails">
                        <img
                          className="shelvesCoverImage"
                          alt={eachBook.title}
                          src={eachBook.coverPic}
                        />
                        <div className="shelvesDetails">
                          <h1
                            className={`shelves-title ${
                              themeMode && 'colorWhite'
                            }`}
                          >
                            {eachBook.title}
                          </h1>
                          <p
                            className={`shelves-author ${
                              themeMode && 'colorWhite'
                            }`}
                          >
                            {eachBook.authorName}
                          </p>
                          <p
                            className={`shelves-rating ${
                              themeMode && 'colorWhite'
                            }`}
                          >
                            Avg Rating <BsFillStarFill className="star-icon" />
                            <span> {eachBook.rating}</span>
                          </p>
                          <p
                            className={`shelves-status ${
                              themeMode && 'colorWhite'
                            }`}
                          >
                            Status:
                            <span className="span-status">
                              {eachBook.readStatus}
                            </span>
                          </p>
                        </div>
                      </li>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )
        }}
      </BookshelvesContext.Consumer>
    )
  }

  renderFailureView = () => (
    <div className="bookShelvesFailureViewContainer">
      <img
        className="failureMobileImage"
        alt="failure view"
        src="https://res.cloudinary.com/dgonqoet4/image/upload/v1686887648/somethingwrong_l7pyto.png"
      />
      <p className="bookShelvesFailureText">
        Something went wrong, Please try again.
      </p>
      <button
        className="bookShelvesFailureRetryBtn"
        type="button"
        onClick={this.onClickRetryRequestBtn}
      >
        Try Again
      </button>
    </div>
  )

  renderLoaderView = () => (
    <div className="loader-spinner-container" testid="loader">
      <Loader type="TailSpin" color="#0284C7" height={50} width={50} />
    </div>
  )

  renderBookSliverData = () => {
    const {bookShelvesApiStatus} = this.state
    switch (bookShelvesApiStatus) {
      case apiStatus.success:
        return <>{this.renderBookShelvesList()}</>
      case apiStatus.inProgress:
        return <>{this.renderLoaderView()}</>
      case apiStatus.failure:
        return <>{this.renderFailureView()}</>
      default:
        return null
    }
  }

  render() {
    const {sidebarLabel, userSearchInput} = this.state
    return (
      <BookshelvesContext.Consumer>
        {value => {
          const {themeMode} = value

          return (
            <div className="bookshelvesHome">
              <Header bookShelvesList />
              <div
                className={`main-bookshelves-container ${
                  themeMode && 'bgDark'
                }`}
              >
                <div className={`sidebar ${themeMode && 'sidebarBgBlack'}`}>
                  <h1 className={`sidebar-title ${themeMode && 'colorWhite'}`}>
                    Bookshelves
                  </h1>
                  <div className="sidebar-ul">
                    {bookshelvesList.map(each => {
                      const activeList =
                        sidebarLabel === each.label ? 'activeTab' : ''
                      const onClickUpdateData = () => {
                        this.setState(
                          {
                            bookshelfName: each.value,
                            sidebarLabel: each.label,
                          },
                          this.getBookShelvesDetails,
                        )
                      }
                      return (
                        <div key={each.id} className="d-sidebar">
                          <button
                            type="button"
                            className="sidebarListBtn"
                            onClick={onClickUpdateData}
                          >
                            <li
                              key={each.id}
                              value={each.value}
                              className={
                                themeMode
                                  ? `shelves-list-white ${activeList}`
                                  : `shelves-list ${activeList}`
                              }
                            >
                              {each.label}
                            </li>
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="bookShelvesList">
                  <div className="searchContainer">
                    <h1
                      className={`searchContainer-Title ${
                        themeMode && 'colorWhite'
                      }`}
                    >
                      {sidebarLabel} Books
                    </h1>
                    <div className="searchElement">
                      <input
                        value={userSearchInput}
                        type="search"
                        placeholder="Search"
                        className={`searchInput ${
                          themeMode && 'searchBgWhite'
                        }`}
                        onChange={this.onChangeUserSearchInput}
                        onKeyDown={this.onKeyDown}
                      />
                      <button
                        testid="searchButton"
                        className="searchBtn"
                        type="button"
                        onClick={this.onClickSearchData}
                      >
                        <BsSearch
                          className={`search-icon ${themeMode && 'icon-White'}`}
                        />
                      </button>
                    </div>
                  </div>
                  <div className="mobileResponsiveBtn">
                    <h1 className="mHeading">Bookshelves</h1>
                    <div className="mobile-shelves-list">
                      {bookshelvesList.map(each => {
                        const activeList =
                          sidebarLabel === each.label ? 'activeColor' : ''
                        const onClickUpdateData = () => {
                          this.setState(
                            {
                              bookshelfName: each.value,
                              sidebarLabel: each.label,
                            },
                            this.getBookShelvesDetails,
                          )
                        }
                        return (
                          <div key={each.id}>
                            <button
                              className={`mListBtn ${activeList}`}
                              type="button"
                              onClick={onClickUpdateData}
                            >
                              <li
                                className={`mobileButtonList ${
                                  themeMode && 'mobileButtonListBlack'
                                }`}
                              >
                                {each.label}
                              </li>
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  {this.renderBookSliverData()}
                  <div className={`footer-section ${themeMode && 'bgDark'}`}>
                    <Footer />
                  </div>
                </div>
              </div>
            </div>
          )
        }}
      </BookshelvesContext.Consumer>
    )
  }
}

export default Bookshelves
