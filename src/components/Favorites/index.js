import './index.css'
import {Link} from 'react-router-dom'
import {AiOutlineDelete} from 'react-icons/ai'
import Header from '../Header'
import BookshelvesContext from '../../context/BookshelvesContext'

const Favorites = () => (
  <BookshelvesContext.Consumer>
    {value => {
      const {myFav, themeMode, onClickDeleteFav} = value

      const onClickDelete = book => {
        onClickDeleteFav(book)
      }
      return (
        <>
          <Header favorites />
          <div className={`fav-container ${themeMode && 'favContainerBlack'}`}>
            {myFav.length !== 0 ? (
              <>
                <h1 className={`favHeading ${themeMode && 'colorWhite'}`}>
                  My Favorites:
                </h1>
              </>
            ) : (
              ''
            )}
            {myFav.length === 0 ? (
              <div className="NoFavContainer">
                <img
                  alt="no favorite"
                  className="noFavImage"
                  src="https://res.cloudinary.com/dy1lfg1dp/image/upload/v1678435225/Group_nd68ei.png"
                />
                <h1 className={`noFavTitle ${themeMode && 'colorWhite'}`}>
                  No Favorites
                </h1>
              </div>
            ) : (
              <ul className="fav-ul">
                {myFav.map(eachItem => (
                  <div className="col" key={eachItem.id}>
                    <Link to={`/books/${eachItem.id}`} className="link">
                      <li className="favList">
                        <img
                          alt={eachItem.title}
                          className="favImage"
                          src={eachItem.coverPic}
                        />
                        <h1 className={`favTitle ${themeMode && 'colorWhite'}`}>
                          {eachItem.title}
                        </h1>
                        <p className={`favStatus ${themeMode && 'colorWhite'}`}>
                          Status: <span>{eachItem.readStatus}</span>
                        </p>
                      </li>
                    </Link>
                    <div className="row">
                      <div className="deleteBtnContainer">
                        <button
                          type="button"
                          className="deleteBtn"
                          onClick={() => onClickDelete(eachItem)}
                        >
                          Delete
                        </button>
                        <AiOutlineDelete />
                      </div>
                    </div>
                  </div>
                ))}
              </ul>
            )}
          </div>
        </>
      )
    }}
  </BookshelvesContext.Consumer>
)

export default Favorites
