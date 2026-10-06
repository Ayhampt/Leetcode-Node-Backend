import { CreateProblemDTO, UpdateProblemDTO } from "../dto/problem.dto";
import { IProblem } from "../models/problem.models";
import { ProblemRepository } from "../repositories/problem.repository";
import { NotFoundError } from "../utils/errors/app.error";
import { sanitizeMarkdown } from "../utils/markdown.sanitizer";

export interface IProblemService {
  createProblem(problem: any): Promise<any>;
  getProblemById(id: string): Promise<any>;
  updateProblem(id: string, updateData: any): Promise<any>;
  deleteProblem(id: string): Promise<any>;
  getAllProblems(): Promise<{ problems: IProblem[]; total: number }>;
  findByDifficulty(difficulty: "easy" | "medium" | "hard"): Promise<any[]>;
  searchProblems(query: string): Promise<any[]>;
}

export class ProblemService implements IProblemService {
  private problemRepository: ProblemRepository;

  constructor(problemRepository: ProblemRepository) {
    this.problemRepository = problemRepository;
    console.log("problemService constructor called");
  }

  async createProblem(problem: CreateProblemDTO): Promise<IProblem> {
    console.log("problem service", problem);
    const sanitizedPayload = {
      ...problem,
      description: await sanitizeMarkdown(problem.description),
      editorial:
        problem.editorial && (await sanitizeMarkdown(problem.editorial)),
    };
    return await this.problemRepository.createProblem(sanitizedPayload);
  }

  async getProblemById(id: string): Promise<any> {
    const problem = await this.problemRepository.getProblemById(id);
    if (problem) {
      throw new NotFoundError("Problem not found");
    }
    return problem;
  }

  async updateProblem(id: string, updateData: UpdateProblemDTO): Promise<any> {
    const problem = await this.problemRepository.getProblemById(id);
    if (!problem) {
      throw new NotFoundError("Problem not found");
    }

    const sanitizedPayload: Partial<IProblem> = {
      ...updateData,
    };
    if (updateData.description) {
      sanitizedPayload.description = await sanitizeMarkdown(
        updateData.description,
      );
    }
    if (updateData.editorial) {
      sanitizedPayload.editorial = await sanitizeMarkdown(updateData.editorial);
    }

    return await this.problemRepository.updateProblem(id, sanitizedPayload);
  }

  async deleteProblem(id: string): Promise<boolean> {
    const result = await this.problemRepository.deleteProblem(id);
    if (!result) {
      throw new NotFoundError("Problem not found");
    }
    return result;
  }

  async getAllProblems(): Promise<{ problems: IProblem[]; total: number }> {
    return await this.problemRepository.getAllProblems();
  }

  async findByDifficulty(
    difficulty: "easy" | "medium" | "hard",
  ): Promise<IProblem[]> {
    return await this.problemRepository.findByDifficulty(difficulty);
  }

  async searchProblems(query: string): Promise<any[]> {
    return await this.problemRepository.searchProblems(query);
  }
}
