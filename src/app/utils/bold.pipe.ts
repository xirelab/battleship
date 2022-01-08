import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bold'
})
export class BoldPipe implements PipeTransform {
  transform(value: string): string {
    const regex = new RegExp(/([*])(?:(?=(\\?))\2.)*?\1/g, 'gi');;
    return value.replace(regex, (match) => `<strong>${match.replace(/\*/g,'')}</strong>`);
  }
}