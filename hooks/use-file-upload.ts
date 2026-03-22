import { useState, useCallback, useRef } from "react";

export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

export interface FileWithPreview {
  id: string;
  file: File;
  preview?: string;
}

interface UseFileUploadOptions {
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  multiple?: boolean;
  initialFiles?: FileMetadata[];
  onFilesChange?: (files: FileWithPreview[]) => void;
}

export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function useFileUpload(options: UseFileUploadOptions) {
  const { 
    maxFiles = Infinity, 
    maxSize = Infinity, 
    accept = "*", 
    multiple = true, 
    initialFiles = [], 
    onFilesChange 
  } = options;
  
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((newFiles: File[]) => {
    let validFiles = [...newFiles];
    let newErrors: string[] = [];
    
    // validate quantity
    if (!multiple) {
      validFiles = [validFiles[0]];
    } else if (maxFiles && (files.length + validFiles.length > maxFiles)) {
      newErrors.push(`Cannot exceed ${maxFiles} files.`);
      validFiles = validFiles.slice(0, maxFiles - files.length);
    }

    // validate size
    validFiles = validFiles.filter(f => {
      if (f.size > maxSize) {
        newErrors.push(`File "${f.name}" exceeds size limit of ${formatBytes(maxSize)}.`);
        return false;
      }
      return true;
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
    } else {
      setErrors([]);
    }

    if (validFiles.length > 0) {
      const fileObjects = validFiles.map(f => ({
        id: crypto.randomUUID(),
        file: f,
        preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined
      }));
      const updatedFiles = multiple ? [...files, ...fileObjects] : fileObjects;
      setFiles(updatedFiles);
      if (onFilesChange) onFilesChange(updatedFiles);
    }
  }, [files, multiple, maxFiles, maxSize, onFilesChange]);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => {
      const updated = prev.filter(f => f.id !== id);
      if (onFilesChange) onFilesChange(updated);
      return updated;
    });
  }, [onFilesChange]);

  const clearFiles = useCallback(() => {
    setFiles([]);
    setErrors([]);
    if (onFilesChange) onFilesChange([]);
  }, [onFilesChange]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, [handleFiles]);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
      // reset input value so you can upload the same file again
      e.target.value = '';
    }
  }, [handleFiles]);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const getInputProps = useCallback(() => ({
    type: 'file',
    accept,
    multiple,
    onChange,
    ref: fileInputRef,
    style: { display: 'none' }
  }), [accept, multiple, onChange]);

  return [
    { isDragging, errors, files },
    {
      removeFile,
      clearFiles,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
    }
  ] as const;
}
