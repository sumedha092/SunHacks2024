import * as React from "react";
import { cn } from "../lib/utils";
import { Button1 } from "./Button";
import { UploadCloud } from "lucide-react";

export interface FileInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onFileSelect?: (file: File | null) => void;
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, onFileSelect, ...props }, ref) => {
    const [fileName, setFileName] = React.useState<string | null>(null);
    const innerRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => innerRef.current!);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null;
      setFileName(file ? file.name : null);
      if (onFileSelect) {
        onFileSelect(file);
      }
    };

    const handleButtonClick = () => {
      innerRef.current?.click();
    };

    return (
      <div className={cn("flex flex-col items-center", className)}>
        <Button1
          type="button"
          variant="outline"
          onClick={handleButtonClick}
          className="mb-2"
        >
          <UploadCloud className="mr-2 h-4 w-4" />
          Choose File
        </Button1>
        {fileName && (
          <p className="text-sm text-gray-500 mt-2">Selected: {fileName}</p>
        )}
        <input
          type="file"
          className="hidden"
          ref={innerRef}
          onChange={handleFileChange}
          {...props}
        />
      </div>
    );
  }
);

FileInput.displayName = "FileInput";

export { FileInput };