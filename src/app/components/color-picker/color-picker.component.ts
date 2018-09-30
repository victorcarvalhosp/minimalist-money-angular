import {Component, Input, OnInit, Output, forwardRef, ElementRef, ViewChild} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, RadioControlValueAccessor} from '@angular/forms';

const customValueProvider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ColorPickerComponent),
  multi: true
};

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ColorPickerComponent),
    multi: true
  }]
})
export class ColorPickerComponent implements OnInit, ControlValueAccessor {

  public colors: String[] = ['#e53935', '#d81b60', '#8e24aa', '#5e35b1', '#3949ab', '#1e88e5', '#039be5', '#00acc1',
    '#00897b', '#43a047', '#7cb342', '#c0ca33', '#fdd835', '#ffb300', '#fb8c00', '#f4511e'];

  private innerValue: any = '';

  constructor() {
  }

  ngOnInit() {
  }

  onChange(e: Event, value: any) {
    this.innerValue = value;
    this.propagateChange(this.innerValue);
  }

  get value(): any {
    return this.innerValue;
  };

  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
    }
  }

  propagateChange = (_: any) => {
  }

  writeValue(value: any) {
    this.innerValue = value;
  }

  registerOnChange(fn: any) {
    console.log(fn);
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) {
  }

}
