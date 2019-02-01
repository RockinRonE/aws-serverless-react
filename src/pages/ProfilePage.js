import React from 'react'
// prettier-ignore
import { Table, Button, Notification, MessageBox, Message, Tabs, Icon, Form, Dialog, Input, Card, Tag } from 'element-react'
import { API, graphqlOperation } from 'aws-amplify'
import { convertCentsToDollars } from '../utils'

export const getUser = `query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    username
    email
    registered
    orders {
      items {
        id
        createdAt
        product {
          id
          owner
          price
          createdAt
          description
        }
        shippingAddress {
          city
          country
          address_line1
          address_state
          address_zip
        }
      }
      nextToken
    }
  }
}
`

class ProfilePage extends React.Component {
  state = {
    orders: []
  }

  componentDidMount() {
    if (this.props.user) {
      this.getUserOrders(this.props.user.attributes.sub)
    }
  }

  getUserOrders = async userId => {
    const input = { id: userId }
    const result = await API.graphql(graphqlOperation(getUser, input))
    this.setState({ orders: result.data.getUser.orders.items })
  }

  render() {
    const { orders } = this.state
    return (
      <>
        <Tabs activeName="1" className="profile-tabs">
          <Tabs.Pane
            label={
              <>
                <Icon name="document" className="icon" />
                Summary
              </>
            }
          >
            <h2 className="header">Profile Summary</h2>
          </Tabs.Pane>
          <Tabs.Pane
            label={
              <>
                <Icon name="message" className="icon" />
                Orders
              </>
            }
            name="2"
          >
            <h2 className="header">Order History</h2>
            {orders.map(order => (
              <div className="mb-1" key={order.id}>
                <Card>
                  <pre>
                    <p>Order Id: {order.id}</p>
                    <p>Product description: {order.product.description}</p>
                    <p>$ {convertCentsToDollars(order.product.price)}</p>
                    <p>Purchased on {order.createdAt}</p>
                    {order.shippingAddress && (
                      <>
                        Shipping Address
                        <div className="m1-2">
                          <p>{order.shippingAddress.address_line1}</p>
                          <p>
                            {order.shippingAddress.city},{' '}
                            {order.shippingAddress.address_state}{' '}
                            {order.shippingAddress.country}
                          </p>
                        </div>
                      </>
                    )}
                  </pre>
                </Card>
              </div>
            ))}
          </Tabs.Pane>
        </Tabs>
      </>
    )
  }
}

export default ProfilePage
