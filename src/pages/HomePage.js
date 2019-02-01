import React from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import { searchMarkets } from '../graphql/queries'
import NewMarket from '../components/NewMarket'
import MarketList from '../components/MarketList'

class HomePage extends React.Component {
  state = {
    searchTerm: '',
    searchResults: [],
    isSearching: false
  }

  handleSearchChange = searchTerm => this.setState({ searchTerm })

  handleClearSearch = () => this.setState({ searchTerm: '', searchResults: [] })

  handleSearch = async e => {
    try {
      e.preventDefault()
      this.setState({ isSearching: true })
      const result = await API.graphql(
        graphqlOperation(searchMarkets, {
          filter: {
            or: [
              { name: { match: this.state.searchTerm } },
              { owner: { match: this.state.searchTerm } },
              { tags: { match: this.state.searchTerm } }
            ]
          },
          sort: {
            field: 'createdAt',
            direction: 'desc'
          }
        })
      )
      this.setState({
        searchResults: result.data.searchMarkets.items,
        isSearching: false
      })
    } catch (err) {
      console.error(err)
    }
  }

  render() {
    return (
      <>
        <NewMarket
          handleSearchChange={this.handleSearchChange}
          isSearching={this.state.isSearching}
          handleClearSearch={this.handleClearSearch}
          searchTerm={this.state.searchTerm}
          handleSearch={this.handleSearch}
        />
        <MarketList searchResults={this.state.searchResults} />
      </>
    )
  }
}

export default HomePage