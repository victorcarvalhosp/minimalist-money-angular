import { Pipe, PipeTransform } from '@angular/core';
import {getOfxIfClauseLabel, OfxIfClauseEnum} from "../../enums/ofxIfClause.enum";

@Pipe({
  name: 'ofxIfClausePipe'
})
export class OfxIfClausePipe implements PipeTransform {

  transform(value: OfxIfClauseEnum, args?: any): any {
    return getOfxIfClauseLabel(value);
  }

}
