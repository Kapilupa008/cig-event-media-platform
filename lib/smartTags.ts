export function generateSmartTags({
  title,
  fileName,
  mediaType,
  eventName,
  category,
}: {
  title: string;
  fileName: string;
  mediaType: string;
  eventName?: string;
  category?: string;
}) {
  const baseText = [
    title,
    fileName.replace(/\.[^/.]+$/, ""),
    eventName || "",
    category || "",
    mediaType,
    "uploaded",
    "cloudinary",
  ]
    .join(" ")
    .toLowerCase();

  const words = baseText
    .split(/[\s_\-.,()]+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 2);

  const smartTags: string[] = [];

  if (baseText.includes("freshers")) smartTags.push("freshers", "students", "campus");
  if (baseText.includes("group")) smartTags.push("group", "people");
  if (baseText.includes("night")) smartTags.push("night", "event");
  if (baseText.includes("cultural")) smartTags.push("cultural", "fest");
  if (baseText.includes("sports")) smartTags.push("sports", "competition");
  if (baseText.includes("certificate")) smartTags.push("certificate", "achievement");
  if (baseText.includes("workshop")) smartTags.push("workshop", "learning");
  if (baseText.includes("trip")) smartTags.push("trip", "travel");
  if (baseText.includes("photo")) smartTags.push("photo");
  if (baseText.includes("video")) smartTags.push("video");

  return [...new Set([...words, ...smartTags])];
}