"use client";

import React from "react";

import Image from "next/image";

import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import { Trash } from "lucide-react";
import { Button } from "./ui/button";

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
  //check if there is a value, if so, make sure its an image and then render it
  const fileType = value?.split(".").pop(); //file type
  if (value && fileType !== "pdf") {
    return (
      <div className="flex items-center justify-center">
        <div className="relative rounded-full">
          <Image
            src={value}
            alt={"Image"}
            height={100}
            width={100}
            className="h-[120px] w-[120px] rounded-full"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="rounded-full absolute top-0 right-0 shadow-sm bg-rose-500 text-white h-6 w-6 flex items-center justify-center"
          >
            <Trash size={15} />
          </button>
        </div>
      </div>
    );
  }
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
