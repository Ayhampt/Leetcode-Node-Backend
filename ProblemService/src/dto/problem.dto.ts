import { ITestCase } from "../models/problem.models";

export interface CreateProblemDTO {
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  editorial?: string;
  testCases: ITestCase[];
}

export interface UpdateProblemDTO {
  title?: string;
  description?: string;
  difficulty?: "easy" | "medium" | "hard";
  editorial?: string;
  testCases?: ITestCase[];
}
