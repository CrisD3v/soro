export class DocumentEntity {
  id: string;
  name: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  projectId?: string;
  uploadedBy: string;
  companyId: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<DocumentEntity>) {
    Object.assign(this, partial);
  }

  get fileExtension(): string {
    return this.fileName.split('.').pop() || '';
  }

  get isImage(): boolean {
    return this.mimeType.startsWith('image/');
  }

  get isPDF(): boolean {
    return this.mimeType === 'application/pdf';
  }
}
