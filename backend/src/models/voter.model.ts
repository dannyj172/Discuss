import { Schema, model } from "mongoose";

export interface Voter {
  voterId: string;
}

export const VoterSchema: Schema<Voter> = new Schema<Voter>(
  {
    voterId: { type: String, required: true },
  },
  { _id: false }
);

export const VoterModel = model<Voter>("voter", VoterSchema);
