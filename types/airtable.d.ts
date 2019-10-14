declare module "airtable" {
  function configure({ apiKey: string }): void;

  function base(baseId: string): BaseGetter;
  type BaseGetter = (baseName: string) => Base;

  // TODO: Maybe this can be typed w/ generics, i.e. Base<RecordType>
  class Base {
    select: () => BaseSelection;
    update: (
      updates: Array<{ id: string; fields: object }>,
      callback: UpdateCallback
    ) => void;
  }

  type SelectionCallback = (err: Error, records: Array<Record>) => void;
  type UpdateCallback = (err: Error) => void;

  class BaseSelection {
    firstPage: (callback: SelectionCallback) => void;
  }

  class Record {
    id: string;
    get: (key: string) => any;
  }
}
