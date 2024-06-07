"use client";

import React from "react";

import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import { error } from "console";

interface FileUploaderProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage";
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onChange,
  value,
  endpoint,
}) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
    />
  );
};

export default FileUploader;
