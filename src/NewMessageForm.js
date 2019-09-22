import React from "react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

const INSERT_MESSAGE = gql`
  mutation insertMessage($messagetext: String!) {
    insert_message(objects: { messagetext: $messagetext }) {
      affected_rows
    }
  }
`;

const NewMessageForm = () => (
  <Mutation mutation={INSERT_MESSAGE}>
    {insertMessage => {
      const onSubmit = event => {
        event.preventDefault();
        const text = event.target.text.value;
        if (!text) return;
        console.log(text);
        insertMessage({ variables: { messagetext: text } });
        event.target.text.value = "";
      };
      return (
        <form onSubmit={onSubmit}>
          <input name="text" placeholder="Text" />
          <button type="submit">Send</button>
        </form>
      );
    }}
  </Mutation>
);

export default NewMessageForm;
