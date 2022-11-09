

export type ChildrenType = Pick<DataType, "title" | "key">;

export interface DataType {
  title: string;
  key: string;
  children?: ChildrenType[] | null;
}

const arr: DataType[] = [{ title: '12', key: '23', children: [{ title: '44', key: '232' }, { title: '44', key: '232' }] }];