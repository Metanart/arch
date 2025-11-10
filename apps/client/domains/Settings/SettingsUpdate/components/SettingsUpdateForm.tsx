import { FC, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import {
  UpdateSettingsClientSchema,
  TSettingsClientDTO,
  TUpdateSettingsClientDTO
} from '@arch/contracts'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  FormControlLabel,
  Grid,
  Switch,
  TextField
} from '@mui/material'
import { FolderInput } from '@shared/components'

import { SettingsUpdateFormDataQa } from './SettingsUpdateForm.testid'

const DEFAULT_VALUES = {
  outputFolder: '',
  tempFolder: '',
  maxThreads: 1,
  autoProcessOnScan: false,
  autoArchiveOnComplete: false,
  useMultithreading: false,
  debugMode: false
}

type Props = {
  settingsDto?: TSettingsClientDTO
  isDisabled?: boolean
  onSave: (updateSettingsDto: TUpdateSettingsClientDTO, isDirty: boolean) => void
}

export const SettingsUpdateForm: FC<Props> = ({ settingsDto, isDisabled, onSave }) => {
  const {
    control,
    reset,
    handleSubmit,
    formState: { isDirty }
  } = useForm<TUpdateSettingsClientDTO>({
    resolver: zodResolver(UpdateSettingsClientSchema),
    defaultValues: DEFAULT_VALUES
  })

  useEffect(() => {
    if (settingsDto) {
      reset(settingsDto)
    }
  }, [settingsDto, reset])

  const onSubmit = (updateSettingsFormDto: TUpdateSettingsClientDTO): void => {
    onSave(updateSettingsFormDto, isDirty)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card variant="outlined">
        <CardContent sx={{ px: 2, py: 4 }}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Controller
                name="outputDir"
                control={control}
                disabled={isDisabled}
                render={({ field, fieldState }) => (
                  <FolderInput
                    name={field.name}
                    value={field.value || ''}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    label={'Output Directory'}
                    placeholder={'Select output directory'}
                    onChange={(e) => field.onChange(e.target.value)}
                    onSelect={(newPath) => field.onChange(newPath)}
                    fullWidth={true}
                    isDisabled={isDisabled || field.disabled}
                    slotProps={{
                      htmlInput: { 'data-testid': SettingsUpdateFormDataQa.outputFolderInput }
                    }}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, lg: 5 }}>
              <Controller
                name="tempDir"
                control={control}
                disabled={isDisabled}
                render={({ field, fieldState }) => (
                  <FolderInput
                    name={field.name}
                    value={field.value || ''}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    label={'Temp Directory'}
                    placeholder={'Select temp directory'}
                    onChange={(e) => field.onChange(e.target.value)}
                    onSelect={(newPath) => field.onChange(newPath)}
                    fullWidth={true}
                    isDisabled={isDisabled || field.disabled}
                    slotProps={{
                      htmlInput: { 'data-testid': SettingsUpdateFormDataQa.tempFolderInput }
                    }}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, lg: 2 }}>
              <Controller
                name="maxThreads"
                control={control}
                disabled={isDisabled}
                render={({ field, fieldState }) => (
                  <TextField
                    type="number"
                    name={field.name}
                    value={field.value as unknown as string}
                    disabled={isDisabled || field.disabled}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    label={'Max Threads'}
                    onChange={(e) =>
                      field.onChange(e.target.value === '' ? 1 : Number(e.target.value))
                    }
                    fullWidth={true}
                    slotProps={{
                      htmlInput: { 'data-testid': SettingsUpdateFormDataQa.maxThreadsInput }
                    }}
                  />
                )}
              />
            </Grid>

            <Grid container spacing={0} size={{ xs: 12 }}>
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Controller
                  name="autoProcessOnScan"
                  control={control}
                  disabled={isDisabled}
                  render={({ field }) => (
                    <FormControlLabel
                      label={'Auto Process on Scan'}
                      control={
                        <Switch
                          disabled={isDisabled || field.disabled}
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          slotProps={{
                            input: {
                              // @ts-expect-error - TODO: add type for data-testid
                              'data-testid': SettingsUpdateFormDataQa.autoProcessOnScanSwitch
                            }
                          }}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Controller
                  name="autoArchiveOnComplete"
                  control={control}
                  disabled={isDisabled}
                  render={({ field }) => (
                    <FormControlLabel
                      label={'Auto Archive on Complete'}
                      control={
                        <Switch
                          disabled={isDisabled || field.disabled}
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          slotProps={{
                            input: {
                              // @ts-expect-error - TODO: add type for data-testid
                              'data-testid': SettingsUpdateFormDataQa.autoArchiveOnCompleteSwitch
                            }
                          }}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Controller
                  name="useMultithreading"
                  control={control}
                  disabled={isDisabled}
                  render={({ field }) => (
                    <FormControlLabel
                      label={'Use Multithreading'}
                      control={
                        <Switch
                          disabled={isDisabled || field.disabled}
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          slotProps={{
                            input: {
                              // @ts-expect-error - TODO: add type for data-testid
                              'data-testid': SettingsUpdateFormDataQa.useMultithreadingSwitch
                            }
                          }}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Controller
                  name="debugMode"
                  control={control}
                  disabled={isDisabled}
                  render={({ field }) => (
                    <FormControlLabel
                      label={'Debug Mode'}
                      control={
                        <Switch
                          disabled={isDisabled || field.disabled}
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          slotProps={{
                            input: {
                              // @ts-expect-error - TODO: add type for data-testid
                              'data-testid': SettingsUpdateFormDataQa.debugModeSwitch
                            }
                          }}
                        />
                      }
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
        </CardContent>

        <CardActions sx={{ justifyContent: 'flex-end', px: 2, pt: 0, pb: 2 }}>
          <Button
            type="submit"
            variant="contained"
            sx={{ alignSelf: 'flex-start' }}
            disabled={isDisabled}
            data-testid={SettingsUpdateFormDataQa.submitButton}
          >
            Save
          </Button>
        </CardActions>
      </Card>
    </form>
  )
}
