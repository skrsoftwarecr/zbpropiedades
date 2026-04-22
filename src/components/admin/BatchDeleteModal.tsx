
'use client';

import * as React from 'react';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import { useFirestore, useUser } from '@/firebase/provider';
import { useToast } from '@/hooks/use-toast';
import { processBatchDelete } from '@/lib/firestore-service';
import type { Property } from '@/lib/types';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface BatchDeleteModalProps {
  selectedProperties: Property[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function BatchDeleteModal({ selectedProperties, isOpen, onOpenChange, onSuccess }: BatchDeleteModalProps) {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [reason, setReason] = React.useState('');

  const handleBatchDelete = async () => {
    if (!reason.trim()) {
      toast({ variant: 'destructive', title: 'Motivo Requerido', description: 'Debe ingresar un motivo para la eliminación masiva.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await processBatchDelete(
        firestore, 
        selectedProperties, 
        reason, 
        user?.uid || 'system', 
        user?.displayName || user?.email || 'Admin'
      );

      toast({ 
        title: 'Procesamiento de Eliminación Completo', 
        description: `Exitosos: ${result.exitosos}, Fallidos: ${result.fallidos}.`,
        variant: result.fallidos > 0 ? 'destructive' : 'default'
      });

      if (result.exitosos > 0) {
        onSuccess();
        onOpenChange(false);
        setReason('');
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Ocurrió un error al intentar eliminar los registros.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-6 w-6" />
            Eliminar {selectedProperties.length} registros
          </DialogTitle>
          <DialogDescription className="pt-2">
            Esta acción es irreversible y afectará a las siguientes propiedades:
            <ul className="mt-2 max-h-24 overflow-y-auto bg-muted p-2 rounded text-xs">
              {selectedProperties.map(p => <li key={p.id} className="border-b last:border-0 py-1">• {p.title}</li>)}
            </ul>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo de la eliminación (Auditoría)</Label>
            <Textarea 
              id="reason"
              placeholder="Ej: Registros duplicados, error en carga de datos, retiro de inventario..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="h-24"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button 
            className="bg-destructive hover:bg-destructive/90"
            onClick={handleBatchDelete}
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
            Confirmar Eliminación Masiva
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
