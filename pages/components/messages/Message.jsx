import React, { useState } from "react";
import { Icon, Popup } from "semantic-ui-react";
import calculateTime from "../../util/calculateTime";

const Message = ({ message, user, deleteMsg, bannerProfilePic, divRef }) => {
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  const isSender = message.sender === user._id;
  return (
    <div className="bubbleWrapper" ref={divRef}>
      <div className={isSender && "own" + " inlineContainer"}>
        <img
          className="inlineIcon"
          src={isSender ? user.profilePicURL : bannerProfilePic}
        />

        <div classname={isSender ? "ownBubble own" : "otherBubble other"}>
          {message.msg}
          </div>
          {show DeleteIcon && (
            <Popup
              triggerRef={
                <Icon
                  name='trash'
                  color='red'
                  style={{cursor: 'pointer'}}
                />
              }
            />
          )}
      </div>
    </div>
  );
};

export default Message;
