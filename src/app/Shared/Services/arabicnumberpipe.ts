import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'anp' })
export class ArabicNumberPipe implements PipeTransform {

    transform(n: number): string {
        if (n === null || n === undefined) {
            return '';
        }
        return new Intl.NumberFormat('ar-SA', {}).format(n);
    }
}