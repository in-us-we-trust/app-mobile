// Convierte una imageUri (local, tipo file://, o remota, tipo https://) al
// base64 plano que espera el backend (sin el prefijo "data:image/...;base64,").
// fetch + Blob + FileReader funciona para ambos esquemas de URI en Expo/React
// Native, así que sirve tanto para fotos de la galería como para capturas del
// timbre.
export const imageUriToBase64 = async (uri: string): Promise<string> => {
  const response = await fetch(uri);
  const blob = await response.blob();

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error ?? new Error('No se pudo leer la imagen'));
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1] ?? '');
    };
    reader.readAsDataURL(blob);
  });
};
