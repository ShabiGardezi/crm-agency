export enum TicketStatus {
  NOT_STARTED_YET = 'NOT STARTED YET',
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN PROGRESS',
  COMPLETED = 'COMPLETED'
}

export const TicketStatusValues: TicketStatus[] = Object.values(TicketStatus)
