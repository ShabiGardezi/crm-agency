import { ChildDesignerFormType } from 'src/interfaces/childTicketForms.interface'

export const mapResponseForChildDesigner = (data: any): ChildDesignerFormType => {
  return {
    priority: data.priority,
    due_date: new Date(data.due_date),
    designerFormTypeDetails: {
      notes: data?.notes,
      task_details: data?.task_details
    }
  }
}
