import React, { useEffect, useState } from 'react'
import { Typography, Paper, Grid, Card, CardHeader, CardContent, Divider } from '@mui/material'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import axios from 'axios'
import moment from 'moment'
import LocalSeoView from 'src/layouts/components/ticket-view-department-wise/LocalSeoView'
import { Department } from 'src/shared/enums/Department.enum'
import WordPressView from 'src/layouts/components/ticket-view-department-wise/WordPressView'
import WebSeoView from 'src/layouts/components/ticket-view-department-wise/WebSeoView'
import PaidMarketingView from 'src/layouts/components/ticket-view-department-wise/PaidMarketingView'
import SocialMediaView from 'src/layouts/components/ticket-view-department-wise/SocialMediaView'

const BoldText = ({ children }: any) => (
  <Typography variant='subtitle1' sx={{ fontWeight: 'bold', display: 'inline' }}>
    {children}
  </Typography>
)

const ViewPage = () => {
  const router = useRouter()
  const { ticketId, depart } = router.query
  const [apiLoading, setApiLoading] = useState(false)
  const [data, setData] = useState<any>({})

  const { business_id } = data
  const fetchTicket = async () => {
    axios
      .post(
        `/api/business-ticket/get-single-full`,
        { ticketId },
        {
          headers: { authorization: localStorage.getItem('token') }
        }
      )
      .then(res => {
        console.log(res.data)
        setData(res.data.payload.ticket)
      })
      .catch((error: any) => {
        console.log(error)
        toast.error(error?.response?.data)
      })
  }
  useEffect(() => {
    fetchTicket()
  }, [ticketId])

  return (
    <>
      <Card>
        <CardHeader
          title={
            <Typography variant='h5' color={'primary'}>
              Business Details
            </Typography>
          }
        />
        <Divider sx={{ m: '0 !important' }} />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <BoldText>Name:</BoldText> {business_id?.business_name}
            </Grid>

            <Grid item xs={6}>
              <BoldText>Email:</BoldText> {business_id?.business_email}
            </Grid>

            <Grid item xs={6}>
              <BoldText>Number:</BoldText> {business_id?.business_number}
            </Grid>

            <Grid item xs={6}>
              <BoldText>Hours:</BoldText> {business_id?.business_hours}
            </Grid>

            <Grid item xs={6}>
              <BoldText>Country:</BoldText> {business_id?.country}
            </Grid>

            <Grid item xs={6}>
              <BoldText>State:</BoldText> {business_id?.state}
            </Grid>

            <Grid item xs={6}>
              <BoldText>Street:</BoldText> {business_id?.street}
            </Grid>

            <Grid item xs={6}>
              <BoldText>ZipCode:</BoldText> {business_id?.zip_code}
            </Grid>

            <Grid item xs={6}>
              <BoldText>Website Url:</BoldText> {business_id?.website_url}
            </Grid>

            <Grid item xs={6}>
              <BoldText>Social Profile:</BoldText> {business_id?.social_profile}
            </Grid>

            <Grid item xs={6}>
              <BoldText>Gmb Url:</BoldText> {business_id?.gmb_url}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mt: 6 }}>
        <CardHeader
          title={
            <Typography variant='h5' color={'primary'}>
              Sale Department
            </Typography>
          }
        />
        <Divider sx={{ m: '0 !important' }} />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <BoldText>Sale Type:</BoldText> {data?.sales_type}
            </Grid>

            <Grid item xs={6}>
              <BoldText>Closer:</BoldText> {data?.closer}
            </Grid>
            <Grid item xs={6}>
              <BoldText>Fronter:</BoldText> {data?.fronter}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {/* Sale Department Section */}

      <Card sx={{ mt: 6 }}>
        <CardHeader
          title={
            <Typography variant='h5' color={'primary'}>
              Ticket Details
            </Typography>
          }
        />
        <Divider sx={{ m: '0 !important' }} />
        <CardContent>
          {' '}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <BoldText>Priority Level:</BoldText> {data?.priority}
            </Grid>

            <Grid item xs={6}>
              <BoldText>Status:</BoldText> {data?.status}
            </Grid>

            <Grid item xs={6}>
              <BoldText>Due Date:</BoldText> {moment(data?.due_date).format('MMMM Do YYYY')}
            </Grid>

            <Grid item xs={6}>
              <BoldText>Client Reporting Date:</BoldText>{' '}
              {data?.client_reporting_date && moment(data?.client_reporting_date).format('MMMM Do YYYY')}
            </Grid>

            <Grid item xs={6}>
              <BoldText>Assignor Department:</BoldText> {data?.assignor_depart_name}
            </Grid>

            <Grid item xs={6}>
              <BoldText>Assignee Department:</BoldText> {data?.assignee_depart_name}
            </Grid>

            <Grid item xs={6}>
              <BoldText>Assignee Employee:</BoldText> {data?.assignee_employee_id?.user_name}
            </Grid>

            <Grid item xs={6}>
              <BoldText>Created By:</BoldText> {data?.created_by?.user_name}
            </Grid>

            <Grid item xs={6}>
              <BoldText>Date Of Creation:</BoldText> {moment(data?.createdAt).format('MMMM Do YYYY')}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Department Specific Details Section */}

      <Card sx={{ mt: 6 }}>
        <CardHeader
          title={
            <Typography variant='h5' color={'primary'}>
              Department Specific Details
            </Typography>
          }
        />
        <Divider sx={{ m: '0 !important' }} />
        <CardContent>
          {depart === Department.LocalSeo && <LocalSeoView data={data} />}
          {depart === Department.WordPress && <WordPressView data={data} />}
          {depart === Department.WebSeo && <WebSeoView data={data} />}
          {depart === Department.PaidMarketing && <PaidMarketingView data={data} />}
          {depart === Department.SocialMedia && <SocialMediaView data={data} />}
        </CardContent>
      </Card>
    </>
  )
}

export default ViewPage
