import { Directive, Output, EventEmitter, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: '[ktDragDrop]'
})
export class DragDropDirective {
  @Output() fileDropped = new EventEmitter<any>();

  // Para cambiar estilos según la acción
  @HostBinding('style.borderStyle')  border = 'none';
  @HostBinding('style.borderWidth')  borderWidth = '0px';
  @HostBinding('style.borderColor')  borderColor = 'transparent';


  // Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.border = 'dashed';
    this.borderWidth = '1px';
    this.borderColor = '#C1C1C1';
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  // Drop listener
  @HostListener('drop', ['$event']) public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.border = 'none';
    this.borderWidth = '0px';
    this.borderColor = 'transparent';
    const files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.fileDropped.emit(files);
    }
  }
}
