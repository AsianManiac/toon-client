import { axios } from "./axiosClient";

async function uploadFile(file: File, fileldName: string): Promise<string> {
  const formData = new FormData();
  formData.append(fileldName, file);

  try {
    const response = await axios.post<{ url: string }>(
      "/user/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-Custom-Header": fileldName,
        },
      }
    );

    if (response.status === 200 && response.data) {
      return response.data.url;
    } else {
      throw new Error("Failed to upload file: " + response);
    }
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}

export { uploadFile };
