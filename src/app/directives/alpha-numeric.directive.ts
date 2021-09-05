import {AfterViewInit, Directive,ElementRef, HostListener} from '@angular/core'

@Directive({
	selector:'alphaNumeric'
})
export class AlphaNumericDirective {

	constructor(
		private elementRef: ElementRef
	){}

	@HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const keyCode = event.keyCode || event.which
    console.log(event);
  }
}
