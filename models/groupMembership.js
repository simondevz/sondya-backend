import { Schema, model } from "mongoose";

const groupMembershipSchema = Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    group_id: {
      type: Schema.Types.ObjectId,
      ref: "groupChats",
    },
  },
  { timestamps: true }
);

const GroupMembership = model("groupMembership", groupMembershipSchema);
export default GroupMembership;
