import React from "react";
import { Message, Button } from "semantic-ui-react";

export const NoProfilePost = () => {
  return (
    <>
      <Message
        info
        icon="meh"
        header="Sorry!"
        content="This person hasn't posted anything yet! You should follow them to see if they do!"
      />
      <Button
        icon="long arrow alternate left"
        content="Go Back"
        as="a"
        href="/"
      />
    </>
  );
};

export const NoFollowData = ({
  profileName,
  followersComponent = false,
  followingComponent = false,
}) => {
  <>
    {followersComponent && (
      <Message
        icon="user outline"
        info
        content={`${profileName.split(" ")[0]} has no followers.`}
      />
    )}
    {followingComponent && (
      <Message
        icon="user outline"
        info
        content={`${profileName.split(" ")[0]} isn't following anyone.`}
      />
    )}
  </>;
};

export const NoMessages = () => {
  return (
    <Message
      info
      icon="telegram plane"
      header="Sorry!"
      content="You haven't messaged anyone yet! Search above to talk to a new friend!"
    />
  );
};

export const NoPosts = () => {
  return (
    <Message
      info
      icon="meh"
      header="Hey!"
      content="No posts! Make sure you've followed someone!"
    />
  );
};
