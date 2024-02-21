import mongoose from 'mongoose'
import { PriorityType } from 'src/shared/enums/PriorityType.enum'
import { SaleType } from 'src/shared/enums/SaleType.enum'
import { TicketStatus } from 'src/shared/enums/TicketStatus.enum'
import { WorkStatusValues } from 'src/shared/enums/WorkStatusType.enum'

export const paymentHistorySchema = new mongoose.Schema(
  {
    total_payment: { type: Number, required: true },
    advance_payment: { type: Number, required: true },
    remaining_payment: { type: Number, required: true },
    payment_method: { type: String, required: false },
    refunds: {
      type: [
        {
          refund_amount: { type: Number, required: true },
          refund_date: { type: Date, required: true },
          reason: { type: String, required: false }
        }
      ],
      required: false
    }
  },
  { timestamps: true, validateBeforeSave: true }
)

const businessTicketSchema = new mongoose.Schema(
  {
    status: { type: String, enum: TicketStatus, default: TicketStatus.NOT_STARTED_YET },
    priority: { type: String, enum: PriorityType, default: PriorityType.MEDIUM },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignee_employee_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: '' },
    assignee_depart_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    assignee_depart_name: { type: String, required: true },
    assignor_depart_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    assignor_depart_name: { type: String, required: true },
    outsourced_work: { type: Boolean, default: false },
    client_reporting_date: { type: Date, required: false },
    due_date: { type: Date, required: true },
    fronter: {
      type: String,
      trim: true,
      required: function () {
        return this.sales_type === SaleType.NEW_SALE
      }
    },
    fronter_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: function () {
        return this.sales_type === SaleType.NEW_SALE
      }
    },
    closer: { type: String, required: true, trim: true },
    closer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    business_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Business' },
    sales_type: { type: String, enum: SaleType, required: true },
    work_status: { type: String, required: true, enum: WorkStatusValues },
    payment_history: { type: [paymentHistorySchema], required: true, ref: 'PaymentHistory' },
    notes: { type: String, required: false, default: '', trim: true },
    gmb_url: { type: String, required: false, trim: true },
    social_profile: { type: String, required: false, trim: true },
    website_url: { type: String, required: false, trim: true },
    service_name: { type: String, required: false, trim: true },
    service_area: { type: String, required: false, trim: true },
    referral_website: { type: String, required: false, trim: true },
    service_location: { type: String, required: false, trim: true },
    key_words: { type: String, required: false, trim: true },
    login_credentials: { type: String, required: false, trim: true },
    console_access: { type: String, required: false, trim: true },
    analytics_access: { type: String, required: false, trim: true },
    paid_marketing_location: { type: String, required: false, trim: true },
    ad_account_access: { type: String, required: false, trim: true },
    budget: { type: String, required: false, trim: true },
    budget_price: { type: Number, required: false },
    clients_objectives: { type: String, required: false, trim: true },
    facebook_url: { type: String, required: false, trim: true }
  },
  { timestamps: true }
)

export const BusinessTicketModel =
  mongoose.models.BusinessTicket || mongoose.model('BusinessTicket', businessTicketSchema)