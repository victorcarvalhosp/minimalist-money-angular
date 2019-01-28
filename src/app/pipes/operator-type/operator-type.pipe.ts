import { Pipe, PipeTransform } from '@angular/core';
import {getOperatorTypeLabel, OperatorTypeEnum} from "../../enums/operator-type.enum";

@Pipe({
  name: 'operatorType'
})
export class OperatorTypePipe implements PipeTransform {

  transform(value: OperatorTypeEnum, args?: any): any {
    return getOperatorTypeLabel(value);
  }

}
