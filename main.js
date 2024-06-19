export const API_URL = "http://localhost:8080";

/**
 *
 * @param {string} url
 * @param {RequestInit} options
 * @return {Promise<{status: number, statusText: string, error: boolean, data: any}>}
 */
async function useFetch(url, options) {
  if (!url) throw new Error("URL is required");

  try {
    const response = await fetch(url, options);
    if (!response.ok)
      throw new Error(`${response.status}-${response.statusText}`);

    const data = await response.json();
    if (typeof data !== "object") throw new Error("Invalid data type");

    return {
      status: response.status,
      statusText: response.statusText,
      error: false,
      data,
    };
  } catch (error) {
    return { status: 500, statusText: error.message, error: true };
  }
}

function removeLoading() {
  document.getElementById("loading").style.display = "none";
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { useFetch, sleep, toast, removeLoading };
