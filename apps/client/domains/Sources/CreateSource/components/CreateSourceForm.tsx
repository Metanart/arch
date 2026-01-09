import { FC } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { CreateSourceClientDTO, CreateSourceClientSchema } from '@arch/contracts'

import { FolderInput } from '@domains/Shared'

import { Button, Card, CardActions, CardContent, Grid, TextField } from '@mui/material'

const DEFAULT_VALUES = {
  name: '',
  path: '',
  comment: ''
}

type Props = {
  onSave: (sourceDto: CreateSourceClientDTO, isDirty: boolean) => void
  onCancel?: () => void
  isDisabled?: boolean
}

const messages = {
  fields: {
    name: {
      label: 'Name',
      placeholder: 'Enter name'
    },
    path: {
      label: 'Path',
      placeholder: 'Select path'
    },
    comment: {
      label: 'Comment',
      placeholder: 'Enter comment'
    }
  },
  actions: {
    cancel: 'Cancel',
    save: 'Save'
  }
}

export const CreateSourceForm: FC<Props> = ({ onSave, onCancel, isDisabled }) => {
  const {
    control,
    handleSubmit,
    formState: { isDirty }
  } = useForm<CreateSourceClientDTO>({
    resolver: zodResolver(CreateSourceClientSchema),
    defaultValues: DEFAULT_VALUES
  })

  const onSubmit = (sourceDto: CreateSourceClientDTO): void => {
    onSave(sourceDto, isDirty)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card variant="outlined">
        <CardContent sx={{ px: 2, py: 4 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="name"
                control={control}
                disabled={isDisabled}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    disabled={isDisabled || field.disabled}
                    label={messages.fields.name.label}
                    placeholder={messages.fields.name.placeholder}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    fullWidth={true}
                    autoFocus={true}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="path"
                control={control}
                disabled={isDisabled}
                render={({ field, fieldState }) => (
                  <FolderInput
                    {...field}
                    isDisabled={isDisabled || field.disabled}
                    label={messages.fields.path.label}
                    placeholder={messages.fields.path.placeholder}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    onChange={(e) => field.onChange(e.target.value)}
                    onSelect={(newPath) => field.onChange(newPath)}
                    fullWidth={true}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name="comment"
                control={control}
                disabled={isDisabled}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    disabled={isDisabled || field.disabled}
                    label={messages.fields.comment.label}
                    placeholder={messages.fields.comment.placeholder}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    rows={3}
                    multiline={true}
                    fullWidth={true}
                  />
                )}
              />
            </Grid>
          </Grid>
        </CardContent>

        <CardActions sx={{ justifyContent: 'flex-end', px: 2, pt: 0, pb: 2 }}>
          {onCancel && (
            <Button onClick={onCancel} color="secondary">
              {messages.actions.cancel}
            </Button>
          )}
          <Button type="submit" variant="contained" color="primary" disabled={isDisabled}>
            {messages.actions.save}
          </Button>
        </CardActions>
      </Card>
    </form>
  )
}
