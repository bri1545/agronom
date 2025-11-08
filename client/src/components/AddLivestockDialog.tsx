import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { insertLivestockSchema, type InsertLivestock } from '@shared/schema';
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

interface AddLivestockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const livestockTypes = [
  { value: 'dairy_cattle', label: { en: 'Dairy Cattle', ru: 'Молочные коровы', kk: 'Сүт сиырлары' } },
  { value: 'beef_cattle', label: { en: 'Beef Cattle', ru: 'Мясные коровы', kk: 'Ет сиырлары' } },
  { value: 'sheep', label: { en: 'Sheep', ru: 'Овцы', kk: 'Қойлар' } },
  { value: 'goats', label: { en: 'Goats', ru: 'Козы', kk: 'Ешкілер' } },
  { value: 'horses', label: { en: 'Horses', ru: 'Лошади', kk: 'Жылқылар' } },
  { value: 'pigs', label: { en: 'Pigs', ru: 'Свиньи', kk: 'Шошқалар' } },
  { value: 'chickens', label: { en: 'Chickens', ru: 'Куры', kk: 'Тауықтар' } },
];

export default function AddLivestockDialog({ open, onOpenChange }: AddLivestockDialogProps) {
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const form = useForm<Omit<InsertLivestock, 'userId'>>({
    resolver: zodResolver(insertLivestockSchema.omit({ userId: true })),
    defaultValues: {
      type: 'dairy_cattle',
      count: 10,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<InsertLivestock, 'userId'>) => {
      const res = await apiRequest('POST', '/api/livestock', data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/livestock'] });
      toast({
        title: 'Успешно',
        description: 'Группа скота добавлена успешно',
      });
      form.reset();
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: error.message || 'Не удалось добавить скот',
      });
    },
  });

  const onSubmit = (data: Omit<InsertLivestock, 'userId'>) => {
    createMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="dialog-add-livestock">
        <DialogHeader>
          <DialogTitle>{t('livestock.addNew')}</DialogTitle>
          <DialogDescription>
            Добавьте информацию о группе животных для AI-анализа
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('livestock.type')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    data-testid="select-livestock-type"
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {livestockTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label[language]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('livestock.count')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="10"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      data-testid="input-livestock-count"
                    />
                  </FormControl>
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
