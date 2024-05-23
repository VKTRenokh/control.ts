import { createComment } from '../utils/create-comment';

const comments: Comment[] = [];

// still thinking what to do with this.
// i want to create something like v-if
// v-if creates comment when element is not rendered
const falseCaseOrCreateComment: {
  (falseCase?: undefined): Comment;
  <T>(falseCase?: () => T): T;
} = <T>(falseCase?: () => T): Comment | T => {
  // @ts-expect-error 123
  return falseCase ? falseCase() : comments.push(createComment('ct-when'));
};

export const when = <T, F>(condition: boolean, trueCase: () => T, falseCase?: () => F) => {
  condition ? trueCase() : falseCaseOrCreateComment(falseCase);
};
