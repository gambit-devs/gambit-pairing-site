export class GitHubDataError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "GitHubDataError"
  }
}
