import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'onlyInteger'
})
export class OnlyIntegerPipePipe implements PipeTransform {

  transform(value: number, args?: any): number {
    return Math.floor(value);
  }

}
