export interface ApiError {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
}

export const processApiError = (error: ApiError): string => {
  if (error.detail) {
    return error.detail;
  }

  switch (error.status) {
    case 400:
      return "Solicitud inválida. Verifica los datos ingresados.";
    case 401:
      return "Credenciales inválidas. Verifica tu email y contraseña.";
    case 403:
      return "No tienes permisos para realizar esta acción.";
    case 404:
      return "Recurso no encontrado.";
    case 409:
      return "Conflicto. El recurso ya existe.";
    case 422:
      return "Datos de entrada inválidos.";
    case 500:
      return "Error interno del servidor. Inténtalo más tarde.";
    default:
      return "Ocurrió un error inesperado. Inténtalo más tarde.";
  }
};

export const handleApiError = (axiosError: any): string => {
  if (
    axiosError?.response?.data &&
    typeof axiosError.response.data === "object" &&
    axiosError.response.data.status &&
    axiosError.response.data.detail
  ) {
    return processApiError(axiosError.response.data as ApiError);
  }

  if (
    axiosError?.code === "NETWORK_ERROR" ||
    axiosError?.message?.includes("Network Error")
  ) {
    return "Error de conexión. Verifica tu conexión a internet.";
  }

  if (axiosError?.code === "ECONNABORTED") {
    return "La solicitud tardó demasiado. Inténtalo más tarde.";
  }

  return "Ocurrió un error inesperado. Inténtalo más tarde.";
};
