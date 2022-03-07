const mongoose = require("mongoose");
const schema = mongoose.Schema;

const ChatSchema = new mongoose.Schema({
  user: { type: schema.Types.ObjectId, ref: "User" },
  chats: [
    {
      messagesWith: { type: schema.Types.ObjectId, ref: "User" },
      messages: [
        {
          msg: { type: String, required: true },
          sender: { type: schema.Types.ObjectId, ref: "User", required: true },
          receiver: {
            type: schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          date: { type: Date },
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Chat", ChatSchema);
