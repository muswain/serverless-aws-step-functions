import * as ajv from 'ajv';
import { UsersSchema } from '../schemas/user-schema';

export const validateUser = (user: User) => {
  const Ajv = new ajv();
  const valid = Ajv.validate(UsersSchema, user);
  if (!valid) throw new Error(Ajv.errorsText(Ajv.errors));
};
