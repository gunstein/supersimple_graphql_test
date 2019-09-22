import React from "react";
import gql from "graphql-tag";
import { Query, useSubscription } from "react-apollo";

const query = gql`
  {
    message(order_by: { id: asc }, limit: 20) {
      id
      messagetext
    }
  }
`;

const subscription = gql`
  subscription {
    message {
      id
      messagetext
    }
  }
`;

const MessageItem = ({ message }) => (
  <li style={{ borderTop: "1px solid lightgray" }}>
    <p>{message.messagetext}</p>
  </li>
);

const MessageListView = class extends React.PureComponent {
  componentDidMount() {
    this.props.subscribeToMore();
  }
  render() {
    console.log("messagelistview render");
    const { data } = this.props;
    return (
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {data.message.map(message => (
          <MessageItem key={message.id} message={message} />
        ))}
      </ul>
    );
  }
};
/*
const MessageList = () => {
  const { data, error, loading } = useSubscription(subscription);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error! {error.message}</div>;
  }

  //return <div>{data.newMessagesCount} new messages</div>;
  //return <h4>New comment: {!loading && data.message.message}</h4>;
  console.log(data);
  return <MessageListView data={data} />;
};
*/

const MessageList = () => (
  <Query query={query}>
    {({ loading, error, data, subscribeToMore }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error: {error.message}</p>;
      console.log(data);
      const more = () =>
        subscribeToMore({
          document: subscription,
          updateQuery: (prev, { subscriptionData }) => {
            console.log("updateQuery 1");
            console.log(prev);
            if (!subscriptionData.data) return prev;
            /* 
            const node = subscriptionData.data.message;
            console.log("updateQuery 2");
            console.log(subscriptionData);
            console.log("returning from updateQuery");
            console.log(node);
            console.log(prev.message);
            return Object.assign({}, prev, {
              message: [...prev.message, node.message].slice(0, 20)
            });
            */
            return null;
          }
        });

      return <MessageListView data={data} subscribeToMore={more} />;
    }}
  </Query>
);

export default MessageList;
