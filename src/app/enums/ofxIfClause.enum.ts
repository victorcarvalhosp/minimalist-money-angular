export enum OfxIfClauseEnum {
  NAME =	'NAME',
}

export function getOfxIfClauseLabel(ofxIfClause: OfxIfClauseEnum) {
  if (!ofxIfClause) {
    return null;
  } else if (ofxIfClause === OfxIfClauseEnum.NAME) {
    return 'name';
  }
}

export function getOfxIfClauseObjectField(ofxIfClause: OfxIfClauseEnum) {
  if (!ofxIfClause) {
    return null;
  } else if (ofxIfClause === OfxIfClauseEnum.NAME) {
    return 'name';
  }
}
