'use client';

import { useForm } from 'react-hook-form';
import { Input } from '@app/components/ui/input';
import { Label } from '@app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { Button } from '@app/components/ui/button';
import { FormControl, FormLabel } from '@chakra-ui/react';
import { FormEvent, useEffect } from 'react';

type TCreateInfoProps = {
  onPressNext: (formData: TVideoMetaForm) => void;
};

export type TVideoMetaForm = {
  title: string;
  description: string;
  location?: string;
  category?: string;
  tokenGateVideo: boolean;
};

const CreateInfo = ({ onPressNext }: TCreateInfoProps) => {
  const {
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    register,
  } = useForm<TVideoMetaForm>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      location: '',
      category: '',
      tokenGateVideo: false,
    },
  });

  const onSubmit = (data: TVideoMetaForm) => {
    onPressNext(data);
  };

  const handleSelectCategory = (value: string) => setValue('category', value);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-6 flex justify-center">
        <h4 className="stepper_step_heading">Details</h4>
      </div>
      <div className="my-4">
        <Label htmlFor="title" className="text-sm">
          Title
        </Label>
        <Input
          id="title"
          placeholder="Rick Astley - Never Gonna Give You Up (Official Music Video)"
          className="mt-2 h-12 w-full rounded-md border border-[#444752] p-2 text-gray-600 placeholder:text-gray-400 focus:outline-none"
          data-testid="create-info-title"
          {...register('title', {
            required: true,
          })}
        />
      </div>
      <Label className="mt-10">Description</Label>
      <textarea
        placeholder="Never Gonna Give You Up was a global smash on its release in July 1987, topping the charts in 25 countries including Rick's native UK and the US Billboard Hot 100.  It also won the Brit Award for Best single in 1988. Stock Aitken and Waterman wrote and produced the track which was the lead-off single and lead track from Rick's debut LP "
        className="mt-2 h-32 w-full rounded-md border border-[#444752] p-2 text-gray-600 placeholder:text-gray-400 focus:outline-none"
        data-testid="create-info-description"
        {...register('description', {
          required: true,
        })}
      />
      <div className="mt-10 flex w-full flex-col justify-between lg:flex-row">
        <div className="mb-4 flex w-full flex-col lg:mb-0 lg:w-2/5">
          <Label className="text-sm">Location</Label>
          <Input
            type="text"
            placeholder="New York - United States"
            className="mt-2 h-12 w-full rounded-md border border-[#444752] p-2 text-gray-600 placeholder:text-gray-400 focus:outline-none"
            data-testid="create-info-location"
            {...register('location', {
              required: false,
            })}
          />
        </div>
        <div className="flex w-full flex-col lg:w-2/5">
          <FormLabel className="text-sm">Category</FormLabel>
          <Select
            {...register('category', {
              required: false,
            })}
            onValueChange={handleSelectCategory}
          >
            <FormControl>
              <SelectTrigger data-testid="create-info-category">
                <SelectValue placeholder="Select a Category" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="Music">Music</SelectItem>
              <SelectItem value="Sports">Sports</SelectItem>
              <SelectItem value="Gaming">Gaming</SelectItem>
              <SelectItem value="News">News</SelectItem>
              <SelectItem value="Entertainment">Entertainment</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              <SelectItem value="Sci-tech">Science & Technology</SelectItem>
              <SelectItem value="Travel">Travel</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-10 flex w-full flex-col justify-start lg:flex-row">
        <div className="mb-4 flex w-full flex-col justify-start lg:mb-0 lg:w-2/5">
          <Label className="text-sm">Token Gate Video?</Label>
          <Input
            type="checkbox"
            className="mt-2 h-12 w-full rounded-md border border-[#444752] focus:outline-none"
            data-testid="create-info-token-gate-video"
            {...register('tokenGateVideo', {
              required: false,
            })}
          />
        </div>
      </div>
      <div className="mt-6 flex justify-center">
        <Button 
          type="submit" 
          className="w-[100px]" 
          disabled={!isValid}
          data-testid="create-info-next"
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default CreateInfo;
