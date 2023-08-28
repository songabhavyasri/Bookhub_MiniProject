import {Route, Switch, Redirect} from 'react-router-dom'
import {Component} from 'react'
import './App.css'
import Login from './components/Login'
import Home from './components/Home'
import Bookshelves from './components/Bookshelves'
import BookshelvesContext from './context/BookshelvesContext'
import BookDetails from './components/BookDetails'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import ContactUs from './components/Footer'
import Favorites from './components/Favorites'

// use the below bookshelvesList for rendering read status of book items in Bookshelves Route

class App extends Component {
  state = {themeMode: false, myFav: [], showBtn: false}

  onClickTheme = () => {
    const {themeMode} = this.state
    this.setState({themeMode: !themeMode})
  }

  onClickAddToFav = data => {
    const {showBtn} = this.state
    if (data !== '') {
      this.setState(prevState => ({
        myFav: [...prevState.myFav, data],
        showBtn: !showBtn,
      }))
    }
  }

  onClickDeleteFav = favList => {
    const {myFav, showBtn} = this.state
    const filterData = myFav.filter(each => each.id !== favList.id)
    this.setState({myFav: [...filterData], showBtn: !showBtn})
  }

  render() {
    const {themeMode, myFav, showBtn} = this.state
    return (
      <BookshelvesContext.Provider
        value={{
          showBtn,
          myFav,
          themeMode,
          onClickTheme: this.onClickTheme,
          onClickAddToFav: this.onClickAddToFav,
          onClickBtn: this.onClickBtn,
          onClickDeleteFav: this.onClickDeleteFav,
        }}
      >
        <Switch>
          <Route exact path="/login" component={Login} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/shelf" component={Bookshelves} />
          <ProtectedRoute exact path="/books/:id" component={BookDetails} />
          <ProtectedRoute exact path="/contact" component={ContactUs} />
          <ProtectedRoute exact path="/myfavorite" component={Favorites} />
          <Route path="/not-found" component={NotFound} />
          <Redirect to="/not-found" />
        </Switch>
      </BookshelvesContext.Provider>
    )
  }
}

export default App
