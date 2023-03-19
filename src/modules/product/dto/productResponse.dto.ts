export class ProductResponseDto<T> {
  id?: string;
  name?: string;
  items: T[];
  count: number;
}
