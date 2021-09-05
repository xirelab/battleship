import {Directive,ElementRef, HostListener} from '@angular/core'

@Directive({
	selector:'alphaNumeric'
})
export class AlphaNumericDirective {

	private regExpr = new RegExp(/^[A-J|a-j|0-9]+$/);

	constructor(
		private elementRef: ElementRef
	){}

	@HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    console.log(event);
		const keyCode = event.keyCode || event.which;    
		console.log('event code: '+keyCode);
		
		if (keyCode === 80) {
			event.preventDefault();
			return;
		}

		return;
  }
}
