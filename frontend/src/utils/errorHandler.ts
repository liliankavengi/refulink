export interface AppError {
  message: string;
  code?: string;
  status?: number;
}

export function handleApiError(error: any): AppError {
  if (error.response) {
    // Server responded with error
    return {
      message: error.response.data?.message || "Server error occurred",
      code: error.response.data?.code,
      status: error.response.status,
    };
  } else if (error.request) {
    // Request made but no response
    return {
      message: "Network error. Please check your connection.",
      code: "NETWORK_ERROR",
    };
  } else {
    // Something else happened
    return {
      message: error.message || "An unexpected error occurred",
      code: "UNKNOWN_ERROR",
    };
  }
}