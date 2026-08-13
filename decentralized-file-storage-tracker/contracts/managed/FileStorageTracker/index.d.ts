import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type FileRecord = {
  cid: Uint8Array;
  owner: Uint8Array;
  timestamp: bigint;
  size: bigint;
  mime_type: Uint8Array;
  version: bigint;
  content_hash_commitment: Uint8Array;
};

export type State = {
  files: Map<Uint8Array, FileRecord>;
  total_files: bigint;
};

export type Circuits = {
  register_file(
    context: __compactRuntime.CircuitContext<State>,
    cid: Uint8Array,
    size: bigint,
    mime_type: Uint8Array,
    content_hash_commitment: Uint8Array,
    content_hash: Uint8Array
  ): __compactRuntime.CircuitResults<State, void>;
  
  verify_ownership(
    context: __compactRuntime.CircuitContext<State>,
    cid: Uint8Array,
    content: Uint8Array,
    content_len: bigint
  ): __compactRuntime.CircuitResults<State, boolean>;

  update_file(
    context: __compactRuntime.CircuitContext<State>,
    cid: Uint8Array,
    new_cid: Uint8Array,
    new_size: bigint,
    new_mime_type: Uint8Array,
    new_content_hash_commitment: Uint8Array,
    new_content_hash: Uint8Array
  ): __compactRuntime.CircuitResults<State, void>;

  get_file(
    context: __compactRuntime.CircuitContext<State>,
    cid: Uint8Array
  ): __compactRuntime.CircuitResults<State, FileRecord>;

  get_my_files(
    context: __compactRuntime.CircuitContext<State>
  ): __compactRuntime.CircuitResults<State, [Uint8Array[], bigint]>;
};

export type Witnesses = {
  init_state(context: __compactRuntime.WitnessContext<State>): State;
};

export declare class Contract implements __compactRuntime.Contract<State, Circuits, Witnesses> {
  constructor(witnesses: Witnesses);
  initialState(context: __compactRuntime.ConstructorContext<State>): State;
  circuits: Circuits;
  witnesses: Witnesses;
}

export declare const contract: Contract;
export default contract;
