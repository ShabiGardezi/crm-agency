import React, { useEffect, useState } from 'react'

import { useForm, FormProvider } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import { useAuth } from 'src/hooks/useAuth'
import { Department } from 'src/shared/enums/Department.enum'
import toast from 'react-hot-toast'

import { useRouter } from 'next/router'
import Spinner from 'src/@core/components/spinner'
import Common from './Common'
import { Box, Card, CardContent, CardHeader, Divider, Stack, Typography } from '@mui/material'
import FormsHeader from '../newTicketForm/Header'
import LocalSeoSpecificDetails from '../newTicketForm/Departments/LocalSeo/LocalSeoSpecificDetails'
import SubmitButton from '../newTicketForm/SharedField/FormButton'
import { ChildLocalSeoYupSchema } from 'src/yupSchemas/childTickets/childLocalSeoYupSchema'
import { ChildLocalSeoDefaultValues, ChildLocalSeoFormType } from 'src/interfaces/childTicketForms.interface'
import { mapResponseForChildLocalSeo } from 'src/utils/childTickets/mapResponseForChildLocalSeo'

const schema = ChildLocalSeoYupSchema

const ChildLocalSeoFormComponent = () => {
  const router = useRouter()
  const { ticketId, parentId, businessId } = router.query
  const [apiLoading, setApiLoading] = useState(false)
  const [update, setUpdate] = useState(false)
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false)

  const methods = useForm({
    defaultValues: ChildLocalSeoDefaultValues,
    resolver: yupResolver(schema),
    mode: 'onChange'
  })
  const { departments } = useAuth()

  const fetchTicket = async () => {
    try {
      setUpdate(true)
      setApiLoading(true)
      const res = await axios.get(`/api/department-ticket/${ticketId}`, {
        headers: { authorization: localStorage.getItem('token') }
      })
      const mapResult = mapResponseForChildLocalSeo(res.data.payload.ticket)
      methods.reset(mapResult)
    } catch (error: any) {
      toast.error(error?.response?.data)
    } finally {
      setApiLoading(false)
    }
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      methods.reset(ChildLocalSeoDefaultValues)
    }
  }, [isSubmitSuccessful])

  useEffect(() => {
    if (ticketId) {
      fetchTicket()
    }
  }, [ticketId])

  const onSubmit = async (data: ChildLocalSeoFormType) => {
    const { priority, due_date, localSeoDetails } = data

    // Create a new object with the destructured properties
    const depart: any = departments.find((d: any) => d.name === Department.LocalSeo)

    const requestData = {
      priority: priority,
      assignee_depart_id: depart._id,
      assignee_depart_name: depart.name,
      due_date: due_date,
      work_status: localSeoDetails.work_status,
      notes: localSeoDetails.notes,
      ticketId: ticketId,
      parentId,
      business_id: businessId
    }
    if (update) {
      const apiUrl = '/api/department-ticket/update'

      await axios
        .put(apiUrl, requestData, { headers: { authorization: localStorage.getItem('token') } })
        .then(() => {
          toast.success('Ticket updated successfully')
        })
        .catch(error => {
          console.error('Error:', error)
          toast.error(error?.response?.data || 'Network error')
        })
    } else {
      setIsSubmitSuccessful(false)
      const apiUrl = '/api/department-ticket/create-child'

      await axios
        .post(apiUrl, requestData, { headers: { authorization: localStorage.getItem('token') } })
        .then(() => {
          toast.success('Ticket created successfully')
          setIsSubmitSuccessful(true)
        })
        .catch(error => {
          console.error('Error:', error)
          toast.error(error?.response?.data || 'Network error')
        })
    }
  }

  return (
    <>
      <FormProvider {...methods}>
        <form noValidate autoComplete='off' onSubmit={methods.handleSubmit(onSubmit)}>
          {false ? (
            <Spinner />
          ) : (
            <>
              <Card>
                <CardHeader
                  title={
                    <Typography variant='h5' color={'primary'}>
                      Generate New Linked Ticket For LocalSeo
                    </Typography>
                  }
                />
                <Divider sx={{ m: '0 !important' }} />
                <CardContent>
                  <FormsHeader title='Ticket Details'>
                    <LocalSeoSpecificDetails />
                  </FormsHeader>
                  <Box mt={6}></Box>
                  <Common />

                  <Box sx={{ my: '2rem ' }} />

                  <SubmitButton
                    beforeText={update ? 'Update' : 'Submit'}
                    afterText={update ? 'Updating' : 'Submitting'}
                    fullWidth
                    variant='contained'
                  />
                </CardContent>
              </Card>
            </>
          )}
        </form>
      </FormProvider>
    </>
  )
}

export default ChildLocalSeoFormComponent