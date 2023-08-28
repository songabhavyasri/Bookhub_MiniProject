import React from 'react'

const BookshelvesContext = React.createContext({
  onClickTheme: () => {},
  onClickAddToFav: () => {},
  onClickBtn: () => {},
  onClickDeleteFav: () => {},
})

export default BookshelvesContext
