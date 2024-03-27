export interface RecordSearchBase {
    code: number
    data: DataRecordSearchBase
    msg: string
  }
  interface DataRecordSearchBase {
    has_more: boolean
    items: ItemDataRecordSearchBase[]
    total: number
  }

  interface ItemDataRecordSearchBase {
    fields: any
    record_id: string
  }