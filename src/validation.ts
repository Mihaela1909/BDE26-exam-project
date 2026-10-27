/**
 * Checks the text typed into the todo input.
 * @returns an error message, or `null` if the text is valid
 */
export const validateTodoText = (text: string): string | null => {
  if (!text.trim()) {
    return 'Please enter a todo item.';
  }

  return null;
};
