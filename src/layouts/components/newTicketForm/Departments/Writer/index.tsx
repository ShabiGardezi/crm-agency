import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  Stack,
  Typography
} from '@mui/material'
import FormsHeader from '../../Header'
import BusinessDetails from '../../SharedField/BusinessDetails'
import SubmitButton from '../../SharedField/FormButton'
import SaleDepartment from '../../SharedField/SaleDepartment'
import TicketDetails from '../../SharedField/TicketDetails'
import WriterSpecificDetails from './WriterSpecificDetails'
import { Controller, useFormContext } from 'react-hook-form'
import { CommonFormType } from 'src/interfaces/forms.interface'
import { UserRole } from 'src/shared/enums/UserRole.enum'
import { useAuth } from 'src/hooks/useAuth'

const WriterForm = (props: any) => {
  const { update } = props
  const { control } = useFormContext<CommonFormType>()
  const { user } = useAuth()

  return (
    <>
      <Card>
        <CardHeader
          title={
            <Typography variant='h5' color={'primary'}>
              {update ? 'Update Ticket' : ' Generate New Ticket For Writer'}
            </Typography>
          }
        />
        <Divider sx={{ m: '0 !important' }} />
        <CardContent>
          <Stack spacing={6}>
            <FormsHeader title='Business Details'>
              <BusinessDetails update={update} />
            </FormsHeader>
            {!update && (
              <FormsHeader title='Sale Department'>
                <SaleDepartment />
              </FormsHeader>
            )}
            <FormsHeader title='Ticket Details'>
              <TicketDetails update={update} />
            </FormsHeader>

            <FormsHeader title='Department Specific Details'>
              <WriterSpecificDetails />
            </FormsHeader>
          </Stack>

          {(user?.role === UserRole.ADMIN || user?.role === UserRole.SALE_MANAGER) && (
            <>
              <Box sx={{ my: '2rem ' }} />
              <Controller
                name={`ticketDetails.otherSales`}
                control={control}
                defaultValue={false}
                render={({ field }: any) => {
                  return (
                    <FormControlLabel
                      style={{ marginBottom: '20px' }}
                      control={<Checkbox {...field} checked={field.value} />}
                      label='Other Sales'
                    />
                  )
                }}
              />
            </>
          )}

          <SubmitButton
            beforeText={update ? 'Update' : 'Submit'}
            afterText={update ? 'Updating' : 'Submitting'}
            fullWidth
            variant='contained'
          />
        </CardContent>
      </Card>
    </>
  )
}

export default WriterForm
