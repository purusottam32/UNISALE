/**
 * Turns any thrown value into a sentence we are willing to show a student.
 * Field-level validation errors from Zod are surfaced first because they are
 * the ones the user can actually act on.
 */
export const getErrorMessage = (error, fallback = "Something went wrong. Please try again.") => {
  const data = error?.response?.data;

  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors[0].message || data.message || fallback;
  }
  if (data?.message) return data.message;

  if (error?.code === "ERR_NETWORK") {
    return "Cannot reach UniSale right now. Check your connection.";
  }
  if (error?.message && !error.message.startsWith("Request failed")) {
    return error.message;
  }

  return fallback;
};

/** Maps API field errors onto react-hook-form's setError. */
export const applyFieldErrors = (error, setError) => {
  const errors = error?.response?.data?.errors;
  if (!Array.isArray(errors)) return false;

  let applied = false;
  errors.forEach((issue) => {
    if (issue.field) {
      setError(issue.field, { type: "server", message: issue.message });
      applied = true;
    }
  });
  return applied;
};
