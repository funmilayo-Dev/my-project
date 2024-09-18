export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  return IDL.Service({
    'addCandidate' : IDL.Func([IDL.Text], [Result], []),
    'getCandidates' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'getResults' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))],
        ['query'],
      ),
    'getVoterCount' : IDL.Func([], [IDL.Nat], ['query']),
    'initializeSystem' : IDL.Func([], [Result], []),
    'reset' : IDL.Func([], [Result], []),
    'vote' : IDL.Func([IDL.Text], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
