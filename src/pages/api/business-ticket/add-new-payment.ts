import mongoose from 'mongoose'
import connectDb from 'src/backend/DatabaseConnection'
import { guardWrapper } from 'src/backend/auth.guard'
import BusinessModel from 'src/backend/schemas/business.schema'
import { BusinessTicketModel } from 'src/backend/schemas/businessTicket.schema'
import DepartmentModel from 'src/backend/schemas/department.schema'
import NotificationModel from 'src/backend/schemas/notification.schema'
import PaymentHistoryModel from 'src/backend/schemas/paymentHistory.schema'
import PaymentSessionModel from 'src/backend/schemas/paymentSession.schema'
import { Department } from 'src/shared/enums/Department.enum'
import { NotificationType } from 'src/shared/enums/NotificationType.enum'
import { PaymentType } from 'src/shared/enums/PaymentType.enum'
import { SaleType } from 'src/shared/enums/SaleType.enum'
import { UserRole } from 'src/shared/enums/UserRole.enum'

const handler = async (req: any, res: any) => {
  if (req.method === 'PATCH') {
    const session = await mongoose.startSession()

    try {
      session.startTransaction()

      if (!(req.user.role === UserRole.ADMIN || req.user.role === UserRole.SALE_MANAGER))
        return res.status(403).send('Permission denied')
      const { ticketId, total_payment, advance_payment, remaining_payment, closer_id } = req.body
      if (!ticketId || !total_payment || !advance_payment || remaining_payment === undefined || !closer_id)
        return res.status(400).send('Fields Missing')

      const ticket = await BusinessTicketModel.findByIdAndUpdate(
        ticketId,
        { $inc: { current_session: 1 } },
        { new: true, session }
      )

      if (!ticket) throw new Error('No ticket found')

      const newPaymentSession = new PaymentSessionModel({
        total_payment: total_payment,
        advance_payment: advance_payment,
        remaining_payment: total_payment - advance_payment,
        closer_id: closer_id,
        business_id: ticket.business_id,
        sales_type: SaleType.RECURRING_SALE,
        ticket_id: ticket._id,
        session: ticket.current_session
      })

      const savedPaymentSession = await newPaymentSession.save({ session })

      if (!savedPaymentSession) throw new Error('not able to save payment session')

      const newPaymentHistory = new PaymentHistoryModel({
        received_payment: advance_payment,
        payment_type: PaymentType.Credit,
        remaining_payment: total_payment - advance_payment,
        ticket_id: ticket._id,
        payment_session_id: savedPaymentSession._id,
        business_id: ticket.business_id,
        session: ticket.current_session,
        sales_type: SaleType.RECURRING_SALE,
        closer_id
      })
      const savedPaymentHistory = await newPaymentHistory.save({ session })
      if (!savedPaymentHistory) throw new Error('Not able to save payment history')

      const business = await BusinessModel.findById({ _id: ticket.business_id })

      if (!business) throw new Error('Business not found')

      const departments = await DepartmentModel.find({}, {}, { session })

      if (!departments) throw new Error('No departments found')

      const adminDepartment = departments.find(d => d.name === Department.Admin)

      const notificationMsg = `${business.business_name} with ${ticket.work_status} has been recurred for ${ticket.assignee_depart_name}`

      const notification = new NotificationModel({
        message: notificationMsg,
        ticket_id: ticket._id,
        created_by_user_id: new mongoose.Types.ObjectId(req.user._id),
        category: 'Business',
        type: NotificationType.RECURRING_TICKET,
        for_department_ids: [ticket.assignee_depart_id, adminDepartment._id]
      })

      const result4 = await notification.save({ session })

      if (!result4) throw new Error('Not able to create ticket. Please try again')

      await session.commitTransaction()

      return res.send({
        message: `Payment history updated`,
        payload: {}
      })
    } catch (error) {
      console.log(error)
      await session.abortTransaction()
      res.status(500).send('something went wrong')
    } finally {
      if (session) session.endSession()
    }
  } else {
    res.status(500).send('this is a patch request')
  }
}

// Apply the guard wrapper to the original handler
const guardedHandler = guardWrapper(handler)

export default connectDb(guardedHandler)
