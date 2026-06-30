export interface PagedResponse<T> {
  data: T[];
  next: number | null | undefined;
  prev: number | null | undefined;
  pages: number | undefined;
}
