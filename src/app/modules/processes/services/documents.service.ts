import { Injectable } from '@angular/core';
import { NotificationService } from '@shared/components/notification/notification.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {
  maxSizeOfFileAsByte = environment.maxSizeOfFileAsByte;

  constructor(private notificationService: NotificationService) {}

  getSelectedFiles($event: Event): FileList {
    let files;

    if ($event.target) {
      files = ($event.target as HTMLInputElement).files;
    } else {
      const file: File = $event[0];
      const dT = new ClipboardEvent('').clipboardData || new DataTransfer();
      dT.items.add(file);
      files = dT.files;
    }

    if (!files || files.length === 0) {
      this.notificationService.warn('No seleccionó ningun elemento.');
    } else {
      if (this.areThereCorrectFiles(files)) {
        return files;
      } else {
        this.notificationService.warn(
          'Solo se permite subir documentos tipo PDF de un tamaño máximo de 80MB.'
        );
      }
    }
  }

  areThereCorrectFiles(selectedFiles: FileList | null): boolean {
    let countCorrectFiles = 0;
    Array.from(selectedFiles).forEach((file) => {
      if (
        file.type === 'application/pdf' &&
        file.size < this.maxSizeOfFileAsByte
      ) {
        countCorrectFiles++;
      }
    });
    return countCorrectFiles > 0;
  }
}
