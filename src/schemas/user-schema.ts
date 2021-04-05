export const UsersSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    name: { type: 'string' },
    city: { type: 'string' },
    country: { type: 'string' },
  },
  required: ['email', 'name', 'city', 'country'],
  additionalProperties: false,
};
