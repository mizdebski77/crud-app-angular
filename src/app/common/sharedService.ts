import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class SharedService {
    private value: number = 0; 

    setValue(value: number) {
        this.value = value;
    }

    getValue(): number {
        return this.value;
    }
}
