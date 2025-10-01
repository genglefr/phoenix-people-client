import { Component, Input, OnChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AssetDto } from '../../model';

@Component({
  selector: 'app-hardware-form',
  templateUrl: './hardware-form.component.html',
  styleUrls: ['./hardware-form.component.sass']
})
export class HardwareFormComponent implements OnChanges {

  @Input() form: FormGroup;
  @Input() assets: AssetDto[];
  @Input() disabled: boolean;

  selectedAssets: AssetDto[] = [];

  readonly SCREENS = [0, 1, 2, 3, 4];

  ngOnChanges() {
    this.selectedAssets = this.form.get('assets').value as AssetDto[];
  }

  /**
   * Get assets control
   */
  get assetsControl(): FormControl {
    return this.form.get('assets') as FormControl;
  }

  /**
   * Is asset checked
   * @param asset to check
   */
  isChecked(asset: AssetDto): boolean {
    const assetFound = this.selectedAssets.find(selectedAsset => selectedAsset.name === asset.name);
    return assetFound && assetFound.id > -1;
  }

  /**
   * This method updates the selected / unselected assets
   * @param event the event triggered
   * @param asset the asset to update
   */
  updateAsset(event, asset: AssetDto) {
    if (event.target.checked) {
      this.selectedAssets.push(asset);
    } else {
      const index = this.selectedAssets.findIndex(selectedAsset => selectedAsset.name === asset.name);
      this.selectedAssets.splice(index, 1);
    }
    this.assetsControl.setValue(this.selectedAssets);
  }

}
