import { File, Image, Video, Music, FileText, Archive, Folder } from "lucide-react";

const FileIcon = ({ mimeType }) => {
  const baseClass = "w-7 h-7";
  if (!mimeType) return <File className={`${baseClass} text-[var(--accent-pink)]`} />;
  if (mimeType.startsWith("image/")) return <Image className={`${baseClass} text-indigo-500`} />;
  if (mimeType.startsWith("video/")) return <Video className={`${baseClass} text-rose-500`} />;
  if (mimeType.startsWith("audio/")) return <Music className={`${baseClass} text-emerald-500`} />;
  if (mimeType.includes("pdf")) return <FileText className={`${baseClass} text-red-500`} />;
  if (mimeType.includes("word") || mimeType.includes("document")) return <FileText className={`${baseClass} text-blue-600`} />;
  if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) return <FileText className={`${baseClass} text-green-600`} />;
  if (mimeType.includes("powerpoint") || mimeType.includes("presentation")) return <FileText className={`${baseClass} text-orange-500`} />;
  if (mimeType.includes("zip") || mimeType.includes("rar") || mimeType.includes("compressed")) return <Archive className={`${baseClass} text-amber-600`} />;
  if (mimeType.includes("text")) return <FileText className={`${baseClass} text-gray-500`} />;
  if (mimeType.includes("folder")) return <Folder className={`${baseClass} text-amber-600`} />;
  return <File className={`${baseClass} text-[var(--accent-pink)]`} />;
};

export default FileIcon;
