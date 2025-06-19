'use client';
import * as React from 'react';
import { Upload, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const FileUploadComponent: React.FC = () => {
  const [isUploading, setIsUploading] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const handleFileUploadButtonClick = () => {
    const el = document.createElement('input');
    el.setAttribute('type', 'file');
    el.setAttribute('accept', 'application/pdf');
    el.addEventListener('change', async () => {
      if (el.files && el.files.length > 0) {
        const file = el.files.item(0);
        if (file) {
          setSelectedFile(file);
        }
      }
    });
    el.click();
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append('pdf', selectedFile);

      const response = await fetch('http://localhost:8000/upload/pdf', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast.success('File uploaded successfully!');
        setSelectedFile(null);
      } else {
        toast.error('Failed to upload file');
      }
    } catch (error) {
      toast.error('Error uploading file');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-card text-card-foreground shadow-md p-6 rounded-lg border border-border flex flex-col gap-4 transition-all hover:shadow-lg">
      {!selectedFile ? (
        <div
          onClick={handleFileUploadButtonClick}
          className="flex justify-center items-center flex-col gap-3 p-8 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted transition-colors"
        >
          <Upload className="w-10 h-10 text-primary opacity-80" />
          <h3 className="text-lg font-medium mt-2">Upload PDF File</h3>
          <p className="text-sm text-muted-foreground">Click to browse files</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-md">
                <Upload className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium truncate max-w-[200px]">{selectedFile.name}</span>
                <span className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedFile(null)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={uploadFile}
              disabled={isUploading}
              className="gap-2"
            >
              {isUploading ? 'Uploading...' : 'Upload'}
              {!isUploading && <Check className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadComponent;
