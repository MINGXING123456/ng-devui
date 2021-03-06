import {
    Component,
    Renderer2,
    OnInit,
    ElementRef,
    HostBinding,
    ChangeDetectionStrategy, Input, ContentChild, ChangeDetectorRef, Host, Optional, SkipSelf
  } from '@angular/core';
import { FormControlComponent } from './form-control.component';
import { FormLabelComponent } from './form-label.component';

  @Component({
    selector: 'd-form-item',
    template: `
    <ng-content></ng-content>
    `,
    styleUrls: ['./form-item.component.scss'],
    preserveWhitespaces: false,
  })
  export class FormItemComponent implements OnInit {
    @HostBinding('class.devui-form-has-error-msg') _hasErrorMsg = false;

    @Input() dFeedbackType: 'label' | 'control';

    @ContentChild(FormControlComponent) controlInstance: FormControlComponent;
    @ContentChild(FormLabelComponent) labelInstance: FormLabelComponent;

    constructor(
      elementRef: ElementRef,
      renderer: Renderer2,
      private cdr: ChangeDetectorRef,
      // FIXME: 循环依赖，打包后将不可用：FormItemComponent -> FormDirective -> DFormControlRuleDirective -> FormItemComponent
      // @Optional() @Host() @SkipSelf() private _dForm: FormDirective,
      ) {
        renderer.addClass(elementRef.nativeElement, 'devui-form-item');
    }

    ngOnInit() {

    }

    updateFeedback(status: 'error' | null, updateMessage: string): void {
      this._hasErrorMsg = !!updateMessage;

      const feedbackType = this.dFeedbackType;
      if (feedbackType === 'label' && this.labelInstance) {
        this.labelInstance.updateFeedbackStatus(status);
      } else if (feedbackType === 'control' && this.controlInstance) {
        this.controlInstance.updateFeedbackStatus(status);
      }

      if (this.controlInstance) {
        this.controlInstance.updateErrorMessage(updateMessage);
      }

      this.cdr.detectChanges();
    }

  }
