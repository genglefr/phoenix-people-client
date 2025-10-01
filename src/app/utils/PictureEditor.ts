import loadImage from 'blueimp-load-image';
enum ORIENTATION{
  UP = 1,
  RIGHT = 8,
  DOWN = 3,
  LEFT = 6
}

export class PictureEditor {
  static readonly orientations = [
    ORIENTATION.UP,
    ORIENTATION.LEFT,
    ORIENTATION.DOWN,
    ORIENTATION.RIGHT
  ];
  static readonly ROTATE_LEFT = true;
  static readonly ROTATE_RIGHT = false;

  currentOrientation = 0;
  image: string;

  constructor(picture: string) {
    this.image = picture;
  }

  /**
   * Apply a rotation to the image to the right orientation
   * @toLeft specify if picture has to move left, if false, move to right
   * @Return promise with the rotated image
   */
  async rotate(toLeft: boolean): Promise<string>{
    if (toLeft) {
      this.currentOrientation = (this.currentOrientation - 1 < 0)
        ? this.currentOrientation = PictureEditor.orientations.length - 1
        : this.currentOrientation - 1;
    } else {
      this.currentOrientation = (this.currentOrientation + 1) % PictureEditor.orientations.length
    }

    return loadImage(this.image,
      {
        meta: true,
        canvas: true,
        orientation: PictureEditor.orientations[this.currentOrientation],
        noRevoke: true
      }).then((data) => {
      return data.image.toDataURL();
    });
  }

}
