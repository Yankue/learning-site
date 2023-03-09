import '../styles/globals.css'
import React from 'react'
import Header from '../components/Header'
import { CurrentUser } from '..'

interface AppState {
  currentUser?: CurrentUser|false
}

class App extends React.Component<{Component: React.ComponentClass, pageProps: any}, AppState> {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return <div>
      <Header app={this} />
      <this.props.Component app={this} {...this.props.pageProps} />
    </div>
  }
}

export default App
