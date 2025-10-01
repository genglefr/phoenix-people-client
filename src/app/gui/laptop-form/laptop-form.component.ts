import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-laptop-form',
  templateUrl: './laptop-form.component.html',
  styleUrls: ['./laptop-form.component.sass']
})
export class LaptopFormComponent {

  @Input() form: FormGroup;
  @Input() laptopModelList: string[];
  @Input() keyboardModels: string[];
  @Input() operatingSystems: string[];

  @Output() changeHardware = new EventEmitter<void>();

  emitChange(): void {
    this.changeHardware.emit();
  }

}
