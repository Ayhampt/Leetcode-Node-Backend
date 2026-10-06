import { IProblem, Problem } from "../models/problem.models";

export interface IProblemRepository {
  createProblem(problem: IProblem): Promise<IProblem>;
  getProblemById(id: string): Promise<IProblem | null>;
  updateProblem(
    id: string,
    updateData: Partial<IProblem>,
  ): Promise<IProblem | null>;
  deleteProblem(id: string): Promise<IProblem | null>;
  getAllProblems(): Promise<IProblem[]>;
  findByDifficulty(difficulty: "easy" | "medium" | "hard"): Promise<IProblem[]>;
  searchProblems(query: string): Promise<IProblem[]>;
}

export class ProblemRepository implements IProblemRepository {
  constructor() {
    console.log("Problem Repository constructor called");
  }

  async createProblem(problem: IProblem): Promise<IProblem> {
    const newProblem = new Problem(problem);
    return await newProblem.save();
  }

  async getProblemById(id: string): Promise<IProblem | null> {
    return await Problem.findById(id);
  }

  async updateProblem(
    id: string,
    updateData: Partial<IProblem>,
  ): Promise<IProblem | null> {
    return await Problem.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteProblem(id: string): Promise<IProblem | null> {
    return await Problem.findByIdAndDelete(id);
  }

  async getAllProblems(): Promise<IProblem[]> {
    return await Problem.find();
  }

  async findByDifficulty(
    difficulty: "easy" | "medium" | "hard",
  ): Promise<IProblem[]> {
    return await Problem.find({ difficulty });
  }

  async searchProblems(query: string): Promise<IProblem[]> {
    const regex = new RegExp(query, "i");
    return await Problem.find({
      $or: [{ title: regex }, { description: regex }],
    }).sort({ createdAt: -1 });
  }
}
