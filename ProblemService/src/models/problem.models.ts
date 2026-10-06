import mongoose, { Document } from "mongoose";
export interface ITestCase {
  input: string;
  output: string;
}

export interface IProblem extends Document {
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  editorial?: string;
  testCases: ITestCase[];
  createdAt: Date;
  updatedAt: Date;
}

const testCaseSchema = new mongoose.Schema<ITestCase>({
  input: {
    type: String,
    required: [true, "Input is required"],
    trim: true,
  },
  output: {
    type: String,
    required: [true, "Output is required"],
    trim: true,
  },
});

const problemSchema = new mongoose.Schema<IProblem>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      maxlength: [100, "Title cannot exceed 100 characters"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    difficulty: {
      type: String,
      enum: {
        values: ["easy", "medium", "hard"],
        message: "Difficulty must be easy, medium or hard",
      },
      default: "easy",
      required: [true, "Difficulty is required"],
    },
    editorial: {
      type: String,
      trim: true,
    },
    testCases: [testCaseSchema],
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, record: any) => {
        delete record.__v;
        record.id = record._id;
        delete record._id;
        return record;
      },
    },
  },
);
problemSchema.index({ title: 1 }, { unique: true });
problemSchema.index({ difficulty: 1 });

export const Problem = mongoose.model<IProblem>("Problem", problemSchema);
