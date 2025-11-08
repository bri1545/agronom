import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { insertFieldSchema, type InsertField } from '@shared/schema';
import { parseDMSCoordinate } from '@/lib/coordinates';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddFieldDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const cropTypes = [
  { value: 'wheat', label: { en: 'Wheat', ru: 'Пшеница', kk: 'Бидай' } },
  { value: 'corn', label: { en: 'Corn', ru: 'Кукуруза', kk: 'Жүгері' } },
  { value: 'barley', label: { en: 'Barley', ru: 'Ячмень', kk: 'Арпа' } },
  { value: 'sunflower', label: { en: 'Sunflower', ru: 'Подсолнечник', kk: 'Күнбағыс' } },
  { value: 'potato', label: { en: 'Potato', ru: 'Картофель', kk: 'Картоп' } },
  { value: 'sugar_beet', label: { en: 'Sugar Beet', ru: 'Сахарная свекла', kk: 'Қант қызылшасы' } },
];

export default function AddFieldDialog({ open, onOpenChange }: AddFieldDialogProps) {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [coordinateInput, setCoordinateInput] = useState('');

  const form = useForm<Omit<InsertField, 'userId'>>({
    resolver: zodResolver(insertFieldSchema.omit({ userId: true })),
    defaultValues: {
      name: '',
      latitude: '51.1694',
      longitude: '71.4491',
      area: '10',
      cropType: 'wheat',
    },
  });

  const handleCoordinatePaste = (value: string) => {
    setCoordinateInput(value);
    const parsed = parseDMSCoordinate(value);
    if (parsed) {
      form.setValue('latitude', parsed.latitude.toFixed(7));
      form.setValue('longitude', parsed.longitude.toFixed(7));
      toast({
        title: 'Координаты распознаны',
        description: `Широта: ${parsed.latitude.toFixed(7)}, Долгота: ${parsed.longitude.toFixed(7)}`,
      });
    }
  };

  const createMutation = useMutation({
    mutationFn: async (data: Omit<InsertField, 'userId'>) => {
      const res = await apiRequest('POST', '/api/fields', data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/fields'] });
      toast({
        title: 'Успешно',
        description: 'Поле добавлено успешно',
      });
      form.reset();
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: error.message || 'Не удалось добавить поле',
      });
    },
  });

  const onSubmit = (data: Omit<InsertField, 'userId'>) => {
    createMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="dialog-add-field">
        <DialogHeader>
          <DialogTitle>{t('fields.addNew')}</DialogTitle>
          <DialogDescription>
            Добавьте информацию о новом поле для AI-анализа
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название поля</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Северное поле"
                      {...field}
                      data-testid="input-field-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Координаты Google Maps (или вручную)
              </label>
              <Input
                type="text"
                placeholder={'Вставьте: 54°52\'59.2"N 69°14\'13.8"E'}
                value={coordinateInput}
                onChange={(e) => handleCoordinatePaste(e.target.value)}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Скопируйте координаты из Google Maps и вставьте сюда
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Широта (°N)</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="51.1694"
                        {...field}
                        data-testid="input-field-latitude"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Долгота (°E)</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="71.4491"
                        {...field}
                        data-testid="input-field-longitude"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Площадь ({t('fields.hectares')})</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="10"
                      {...field}
                      data-testid="input-field-area"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cropType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('fields.crop')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    data-testid="select-field-crop"
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите культуру" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cropTypes.map((crop) => (
                        <SelectItem key={crop.value} value={crop.value}>
                          {crop.label[language]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                data-testid="button-cancel"
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                data-testid="button-submit"
              >
                {createMutation.isPending ? t('common.loading') : t('common.save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
