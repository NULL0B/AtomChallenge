// nameof operator for typescript
import { FormControl, FormGroup } from "@angular/forms";

export const nameof = <T>(name: keyof T): keyof T => name;

export type PartialFormGroupOf<T> = {
    [P in keyof T]: T[P] extends object ? FormGroup<PartialFormGroupOf<T[P]>> : FormControl<T[P]>;
};
