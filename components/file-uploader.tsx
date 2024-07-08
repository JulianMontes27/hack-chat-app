"use client";

import React from "react";

import Image from "next/image";

import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import { FileIcon, Trash } from "lucide-react";
import Link from "next/link";

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
  if (value && fileType === "pdf") {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md flex-row gap-4 ">
        <FileIcon className="h-10 w-10" />
        <Link
          href={value}
          target="_blank"
          rel="noopener noreferer"
          className="hover:text-blue-900"
        >
          {value}
        </Link>
        <Trash
          className="absolute top-0 right-0 text-red-600 transition duration-300 ease-in-out transform hover:scale-110  cursor-pointer"
          onClick={() => onChange("")}
        />
      </div>
    );
  }
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url); //this is the field.onchange from the modal-form
      }}
      onUploadError={(error: Error) => {
        alert(`ERROR! ${error.message}`);
      }}
    />
  );
};

export default FileUploader;
