// nameof operator for typescript
export const nameof = <T>(name: keyof T): keyof T => name;