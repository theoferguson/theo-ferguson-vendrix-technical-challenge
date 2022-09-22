import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
// Schemas
import {
  createUserSchema,
  defaultValuesUser,
  updateUserSchema,
  User,
} from '../../schemas/users';
// Hooks
import useCreateUser from '../../hooks/users/useCreateUser';
import useUpdateUser from '../../hooks/users/useUpdateUser';
// Components
import { LoadingButton } from '@mui/lab';
import { Stack, Button, Box, Container, Typography } from '@mui/material';
import StringInput from '../input/StringInput';
// ----------------------------------------------------------------
// ----------------------------------------------------------------

/**
 * ! !!!!!!! ATTENTION !!!!!!!!
 * The below form has been started to help demonstrate how to work with these packages.
 *
 * TODO: Add missing fields/inputs to the form
 * TODO: Ensure all input fields are being validated correctly per the "zod" schema
 * TODO: Submit valid data to the API
 * TODO: Style/rearrange the form to maximize UI/UX
 *
 * ! !!!!!!!!!!!!!!!!!!!!!!!!!!
 */

// ***** Define Component ***** //
interface Props {
  user?: User;
  onClose?: VoidFunction;
}
export default function UserCreateUpdateForm({ user, onClose }: Props) {
  // HOOKS
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser(String(user?._id));

  // CONFIG
  const defaultValues = user ? user : defaultValuesUser();

  // FORM
  /**
   * @docs  https://react-hook-form.com/api/useform/
   */
  const formMethods = useForm<User>({
    mode: 'onTouched',
    resolver: zodResolver(user ? updateUserSchema : createUserSchema),
    defaultValues,
  });
  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty, isSubmitting, isValid },
  } = formMethods;

  // HANDLERS
  const handleSave: SubmitHandler<User> = (data) => {
    try {
      if (user) {
        console.info('updating user...');
        updateUserMutation.mutate(data, {
          onSuccess: () => {
            reset({ ...data });
          },
          onError: (error: any) => {
            window.alert(JSON.stringify(error));
          },
        });
      } else {
        console.info('creating new user...');
        createUserMutation.mutate(data, {
          onSuccess: () => {
            reset();
          },
          onError: (error: any) => {
            window.alert(JSON.stringify(error));
          },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Container sx={{ p: 1 }}>
        <Typography variant='h4'>
          {user ? `${user.name.givenName}` : 'Create User'}
        </Typography>
      </Container>
      <Box>
        <Stack spacing={3} sx={{ p: 3, pb: 0 }}>
          <FormProvider {...formMethods}>
            <form
              onSubmit={handleSubmit((data) => {
                handleSave(data)
              })}
              className='form'
            >
              <Stack spacing={2}>
                <StringInput
                  fieldName='name.givenName'
                  label='Given Name'
                  control={control}
                />
              </Stack>
              <Stack spacing={2}>
                <StringInput
                  fieldName='name.middleName'
                  label='Middle Name (optional)'
                  control={control}
                />
              </Stack>
              <Stack spacing={2}>
                <StringInput
                  fieldName='name.familyName'
                  label='Family Name'
                  control={control}
                />
              </Stack>
              <Stack spacing={2}>
                <StringInput
                  fieldName='name.suffix'
                  label='Suffix (optional)'
                  control={control}
                />
              </Stack>
              <Stack spacing={2}>
                <StringInput
                  fieldName='name.title'
                  label='Title (optional)'
                  control={control}
                />
              </Stack>
              <Stack spacing={2}>
                <StringInput
                  fieldName='role'
                  label='Role'
                  control={control}
                />
              </Stack>
              <Stack spacing={2}>
                <StringInput
                  fieldName='email'
                  label='Email'
                  control={control}
                />
              </Stack>
              <Stack spacing={2}>
                <StringInput
                  fieldName='phone'
                  label='Phone (optional)'
                  control={control}
                />
              </Stack>
              <Stack spacing={2}>
                <StringInput
                  fieldName='password'
                  label='New Password'
                  control={control}
                  type="password"
                />
              </Stack>
              <Stack spacing={2}>
                <StringInput
                  fieldName='confirmPassword'
                  label='Confirm Password'
                  control={control}
                  type="password"
                />
              </Stack>

              {/* Submit Buttons */}
              <Stack direction='row' sx={{ justifyContent: 'flex-end', mt: 2 }}>
                <LoadingButton
                  color='primary'
                  size='large'
                  type='submit'
                  variant='contained'
                  loading={
                    isSubmitting ||
                    createUserMutation.isLoading ||
                    updateUserMutation.isLoading
                  }
                  disabled={!isDirty || !isValid}
                >
                  Save
                </LoadingButton>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                  onClick={() => {
                    reset();
                  }}
                >
                  Reset
                </Button>
              </Stack>
            </form>
            <DevTool control={control} />
          </FormProvider>
        </Stack>
      </Box>
    </>
  );
}
