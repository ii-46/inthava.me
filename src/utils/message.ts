export function getSuccessfulMessage(subject: string): {
  [key: string]: string;
} {
  return {
    create: `create ${subject} successful`,
    delete: `delete ${subject} successful`,
    update: `update ${subject} successful`,
  };
}
