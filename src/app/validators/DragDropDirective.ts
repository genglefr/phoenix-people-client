import {Directive, ElementRef, EventEmitter, HostListener, Output, Renderer2} from '@angular/core';

@Directive({
  selector: '[appDragDrop]'
})
export class DragDropDirective {

  @Output() fileDropped = new EventEmitter<any>();

  constructor(private renderer: Renderer2,
              private elementRef: ElementRef) {
  }

  // Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.renderer.addClass(this.elementRef.nativeElement, 'dragover');
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event'])
  public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.renderer.removeClass(this.elementRef.nativeElement, 'dragover');
  }

  // Drop listener
  @HostListener('drop', ['$event'])
  public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.renderer.removeClass(this.elementRef.nativeElement, 'dragover');
    const files = evt.dataTransfer.files;
    if (files && files.length > 0) {
      this.fileDropped.emit(files);
    }
  }

}
