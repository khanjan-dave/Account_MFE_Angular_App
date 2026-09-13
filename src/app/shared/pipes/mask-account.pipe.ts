import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskAccount',
  standalone: true,
})
export class MaskAccountPipe implements PipeTransform {
  transform(accountNumber: string | null | undefined): string {
    if (!accountNumber || accountNumber.length < 4) return '****';
    const last4 = accountNumber.slice(-4);
    return `**** **** ${last4}`;
  }
}
