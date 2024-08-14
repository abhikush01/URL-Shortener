function isValidUrl(url) {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" +
      "((([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,})|" +
      "localhost|" +
      "\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}|" +
      "\\[?[a-fA-F0-9:]+\\]?)" +
      "(\\:\\d+)?" +
      "(\\/[-a-zA-Z0-9@:%._\\+~#=]*)*" +
      "(\\?[;&a-zA-Z0-9%_.~+=-]*)?" +
      "(\\#[-a-zA-Z0-9_]*)?$",
    "i"
  );
  try {
    return !!pattern.test(url) && new URL(url);
  } catch (_) {
    return false;
  }
}

async function isReachableUrl(url) {
  try {
    const response = await fetch(url, { method: "HEAD", mode: "no-cors" });
    return response.ok;
  } catch (_) {
    return false;
  }
}

module.exports = { isReachableUrl, isValidUrl };
