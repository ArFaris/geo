export async function getPdfUrl(pdfPath: string): Promise<string | null> {
  try {
    const apiUrl = `/api/pdf?path=${encodeURIComponent(pdfPath)}`;
    return apiUrl;
  } catch (error) {
    console.error('Error generating PDF URL:', error);
    return null;
  }
}
