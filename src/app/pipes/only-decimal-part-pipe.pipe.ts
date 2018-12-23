import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'onlyDecimalPart'
})
export class OnlyDecimalPartPipePipe implements PipeTransform {

  transform(value: number, args?: any): any {
    if (value < 0) {
      value = value * -1;
    }
    const valueFormated: string = ((value % 1) * 100).toFixed(0);
    if (parseInt(valueFormated) < 10) {
      return '0' + valueFormated;
    }
    return valueFormated;
  }

}
