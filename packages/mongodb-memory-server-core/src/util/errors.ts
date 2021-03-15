export class StateError extends Error {
  constructor(public wantedStates: [string], public gotState: string) {
    super(
      `Incorrect State for operation: "${gotState}", allowed States: "[${wantedStates.join(',')}]"`
    );
  }
}
