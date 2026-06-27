export const createQueryErrorHandler = ({
  showNotification,
  messages = {},
  onUnauthorized = null,
  onNetworkError = null,
  onSetupError = null,
}) => {
  return (error) => {
    if (error.response) {
      const status = error.response.status;

      // 401 Unauthorized
      if (status === 401) {
        showNotification(messages.unauthorized || "Please log in again.", true);

        onUnauthorized?.();
        return;
      }

      // 4xx (client errors except 401)
      if (status >= 400 && status < 500) {
        showNotification(
          messages.client || "Invalid request. Please check your input.",
          true,
        );
        return;
      }

      // 5xx (server errors)
      if (status >= 500) {
        showNotification(
          messages.server || "Server error. Please try again later.",
          true,
        );
        return;
      }

      // fallback for unknown status
      showNotification("Unexpected error occurred.", true);
    } else if (error.request) {
      // no response
      showNotification(
        messages.network || "No response from server. Check your connection.",
        true,
      );
      onNetworkError?.();
    } else {
      // request setup error
      showNotification(messages.setup || error.message, true);
      onSetupError?.();
    }
  };
};
