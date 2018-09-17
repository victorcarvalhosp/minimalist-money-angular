import { OnlyIntegerPipePipe } from './only-integer-pipe.pipe';

describe('OnlyIntegerPipePipe', () => {
  it('create an instance', () => {
    const pipe = new OnlyIntegerPipePipe();
    expect(pipe).toBeTruthy();
  });
});
