import type { Principal } from '@dfinity/principal';
export type Result = { 'ok' : null } |
  { 'err' : string };
export interface _SERVICE {
  'addCandidate' : (arg_0: string) => Promise<Result>,
  'getCandidates' : () => Promise<Array<string>>,
  'getResults' : () => Promise<Array<[string, bigint]>>,
  'getVoterCount' : () => Promise<bigint>,
  'initializeSystem' : () => Promise<Result>,
  'reset' : () => Promise<Result>,
  'vote' : (arg_0: string) => Promise<Result>,
}
