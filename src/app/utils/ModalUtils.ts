import {Injectable} from '@angular/core';
import {ConfirmModalComponent} from "../gui/modal/confirm-modal/confirm-modal.component";

@Injectable()
export class ModalUtils {

  static readonly DO_NOTHING_ON_DISMISS = () => {};

  /**
   * Method to check if a form is pristine or return window to prevent discard changes
   * @param pristine
   */
  static beforeDismiss(pristine: boolean) {
    return pristine || window.confirm('Are you sure you want to discard your changes ?');
  }

  /**
   * Show a confim modal with given title and message. Resolve promise if users confirm, reject otherwise.
   * @param title of the modal
   * @param message of the modal
   * @param modalService service to manage modal
   */
  static async openConfirmModal(title: string, message: string, modalService): Promise<any>{
    const modalRef = modalService.open(ConfirmModalComponent, ModalUtils.getGenericParams(ModalUtils.DO_NOTHING_ON_DISMISS,'md'));

    modalRef.componentInstance.confirmationTitle = title;
    modalRef.componentInstance.confirmationMessage = message;

    if (await modalRef.result) {
      return Promise.resolve();
    } else {
      return Promise.reject();
    }
  }

  /**
   * Show a confim modal with given title and message. Resolve promise if users confirm, reject otherwise.
   * @param title of the modal
   * @param message of the modal
   * @param modalService service to manage modal
   * @param confirmAction action to execute if user confirm
   * @param rejectAction action to execute if user do reject
   * @param that this
   */
  static confirm(title: string,
                       message: string,
                       modalService,
                       confirmAction: Function,
                       rejectAction?: Function,
                       that: any = this){
    ModalUtils.openConfirmModal(title, message, modalService)
      .then(() => confirmAction.call(that))
      .catch(() => {
        if(rejectAction) {
          rejectAction.call(that)
        }
      })
  }

  /**
   * Return an object with common parameters for modals
   * @param dismissFunction function to execute when model is dismissed
   * default: doesn't do anythings
   * @param size of the modal
   * default: xl
   * @param backdrop of the modal
   * default: 'static'
   */
  static getGenericParams(dismissFunction: Function = ModalUtils.DO_NOTHING_ON_DISMISS,
                   size: string = 'xl',
                   backdrop: string = 'static',
                   ): Object{
    return {
      centered: true,
      keyboard: false,
      backdrop: backdrop,
      size: size,
      beforeDismiss: dismissFunction,
    };
  }

}
