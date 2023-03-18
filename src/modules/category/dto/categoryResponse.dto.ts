export class CategoriesResponseDto<T> {
  id?: string;
  name?: string;
  items: T[];
  count: number;
}
