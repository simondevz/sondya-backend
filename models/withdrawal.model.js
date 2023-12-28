import { Schema, model } from "mongoose";

const withdrawalSchema = Schema(
  {
    withdrawal_amount: {
      type: Number, // ""
    },
    currency: {
      type: String,
    },
    withdrawal_mode: {
      type: String,
    }, // bank, paypal, payoneer
    withdrawal_account: {
      type: Schema.Types.Mixed,
    },
    user: {
      id: {
        type: String,
      },
      username: {
        type: String,
      },
      email: {
        type: String,
      },
    },
    withdrawal_status: {
      type: String, // pending, success, failed
    },
  },
  { timestamps: true }
);

const Withdrawal = model("withdrawal", withdrawalSchema);
export default Withdrawal;
