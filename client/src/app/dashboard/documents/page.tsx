'use client';

/**
 * Documents Page
 * Página principal de gestión de documentos
 */

import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { DataTable } from '@/components/organisms/DataTable';
import { Button } from '@/components/ui/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import type { Document } from '@/lib/api/document.types';
import {
  useDeleteDocument,
  useDocuments,
} from '@/lib/queries/document.queries';
import type { ColDef } from 'ag-grid-community';
import { Download, ExternalLink, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function DocumentsPage() {
  const { data: documents, isLoading } = useDocuments();
  const deleteMutation = useDeleteDocument();

  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);

  // Columnas de la tabla
  const columns: ColDef<Document>[] = [
    {
      field: 'name',
      headerName: 'Nombre',
      flex: 2,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-400" />
          <span>{params.value}</span>
        </div>
      ),
    },
    {
      field: 'type',
      headerName: 'Tipo',
      flex: 1,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'size',
      headerName: 'Tamaño',
      flex: 1,
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) => {
        const bytes = params.value;
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
      },
    },
    {
      field: 'uploadedById',
      headerName: 'Subido por',
      flex: 1,
      filter: 'agTextColumnFilter',
      valueFormatter: (params) => params.value.substring(0, 8) + '...',
    },
    {
      field: 'createdAt',
      headerName: 'Fecha de Subida',
      flex: 1,
      filter: 'agDateColumnFilter',
      valueFormatter: (params) =>
        new Date(params.value).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
    },
  ];

  // Handlers
  const handleDelete = () => {
    if (!documentToDelete) return;

    deleteMutation.mutate(documentToDelete.id, {
      onSuccess: () => {
        toast.success('Documento eliminado exitosamente');
        setDocumentToDelete(null);
      },
      onError: (error: any) => {
        toast.error(error.message || 'Error al eliminar documento');
      },
    });
  };

  const handleDownload = (document: Document) => {
    window.open(document.url, '_blank');
    toast.success('Descargando documento...');
  };

  const handleView = (document: Document) => {
    window.open(document.url, '_blank');
  };

  const handleContextMenu = (document: Document) => {
    setSelectedDocument(document);
  };

  // Stats
  const totalDocuments = documents?.length || 0;
  const totalSize = documents?.reduce((sum, doc) => sum + doc.size, 0) || 0;
  const pdfCount = documents?.filter((d) => d.type.includes('pdf')).length || 0;
  const imageCount = documents?.filter((d) => d.type.includes('image')).length || 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold">Documentos</h1>
          <p className="text-gray-400 mt-1">Gestiona los archivos y documentos del sistema</p>
        </div>
        <Button disabled>
          Subir Documento
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <p className="text-gray-400 text-sm">Total de Documentos</p>
          <p className="text-3xl font-bold mt-2">{totalDocuments}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <p className="text-gray-400 text-sm">Tamaño Total</p>
          <p className="text-3xl font-bold mt-2">
            {totalSize < 1024 * 1024
              ? `${(totalSize / 1024).toFixed(2)} KB`
              : `${(totalSize / (1024 * 1024)).toFixed(2)} MB`}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <p className="text-gray-400 text-sm">PDFs</p>
          <p className="text-3xl font-bold mt-2">{pdfCount}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.25 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <p className="text-gray-400 text-sm">Imágenes</p>
          <p className="text-3xl font-bold mt-2">{imageCount}</p>
        </motion.div>
      </div>

      {/* Table con Context Menu */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div>
              <DataTable<Document>
                data={documents || []}
                columnDefs={columns}
                loading={isLoading}
                onRowContextMenu={handleContextMenu}
                pagination={true}
                pageSize={20}
                enableFilters={true}
                enableSorting={true}
                height={600}
                darkMode={true}
              />
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem
              onClick={() => selectedDocument && handleView(selectedDocument)}
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Ver Documento
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => selectedDocument && handleDownload(selectedDocument)}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Descargar
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              className="text-red-500"
              onClick={() => selectedDocument && setDocumentToDelete(selectedDocument)}
            >
              Eliminar
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </motion.div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!documentToDelete}
        onOpenChange={(open) => !open && setDocumentToDelete(null)}
        onConfirm={handleDelete}
        title="¿Eliminar documento?"
        description={`¿Estás seguro de que deseas eliminar el documento "${documentToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
