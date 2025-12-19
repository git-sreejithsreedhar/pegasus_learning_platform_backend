export const VERIFICATION_TRIGGER = Symbol('VERIFICATION_TRIGGER');

export interface IVerificationTrigger {
  execute(user: { _id: string; email: string; name?: string }): Promise<void>;
}
