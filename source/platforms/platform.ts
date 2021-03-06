import { Env, CISource } from "../ci_source/ci_source"
import { GitDSL } from "../dsl/GitDSL"
import { GitHub } from "./GitHub"
import { GitHubAPI } from "./github/GitHubAPI"

/** A type that represents the downloaded metadata about a code review session */
export type Metadata = any

/** A type that represents a comment */
export type Comment = {
  /**
   *  UUID for the comment
   *
   * @type {string}
   */
  id: string;
  /**
   * Textual representation of comment
   *
   * @type {string} body string
   */
  body: string;
  /**
   * Was this posted by the account Danger has access to?
   *
   * @type {boolean} true if Danger can edit
   */
  ownedByDanger: boolean;
}

export interface Platform {
  /** Mainly for logging and error reporting */
  readonly name: string
  /** Pulls in the platform specific metadata for inspection */
  getPlatformDSLRepresentation: () => Promise<any>
  /** Pulls in the Code Review Diff, and offers a succinct user-API for it */
  getReviewDiff: () => Promise<GitDSL>
  /** Creates a comment on the PR */
  createComment: (body: string) => Promise<any>
  /** Delete the main Danger comment */
  deleteMainComment: () => Promise<boolean>
  /** Replace the main Danger comment */
  editMainComment: (newComment: string) => Promise<any>
  /** Replace the main Danger comment */
  updateOrCreateComment: (newComment: string) => Promise<any>
}

//     /** Download all the comments in a PR */
//     async downloadComments: (id: string) => Promise<Comment[]>;

//     /** Create a comment on a PR */
//     async  createComment: (body: string) => Promise<?Comment>;

//     /** Delete comments on a PR */
//     async deleteComment: (env: any) => Promise<booleanean>;

//     /** Edit an existing comment */
//     async editComment: (comment: Comment, newBody: string) => Promise<booleanean>;

/**
 * Pulls out a platform for Danger to communicate on based on the environment
 * @param {Env} env The environment.
 * @param {CISource} source The existing source, to ensure they can run against each other
 * @returns {Platform} returns a platform if it can be supported
 */
export function getPlatformForEnv(env: Env, source: CISource): Platform {
  const token = env["DANGER_GITHUB_API_TOKEN"]
  if (!token) {
    console.error("The DANGER_GITHUB_API_TOKEN environmental variable is missing")
    console.error("Without an api token, danger will be unable to comment on a PR")
    throw new Error("Cannot use authenticated API requests.")
  }

  const api = new GitHubAPI(token, source)
  const github = new GitHub(api)
  return github
}
