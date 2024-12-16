import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css'],
})
export class ConfirmationComponent {
  @Input() title!: string;
  @Input() text!: string;
  @Input() cancel!: string;
  @Input() confirm!: string;

  @Input() showPopup!: boolean;
  @Output() showPopupChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  @Output() confirmPopup = new EventEmitter<string>();

  closePopupClick() {
    this.showPopupChange.emit(false);
  }

  confirmPopupClick() {
    if (this.title == 'Delete Post?') {
      this.confirmPopup.emit('delete post');
    } else if (this.title == 'Discard comment?') {
      this.confirmPopup.emit('discard comment');
    } else if (this.title == 'Delete Comment?') {
      this.confirmPopup.emit('delete comment');
    }
    this.closePopupClick();
  }
}
