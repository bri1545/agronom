import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LivestockCard from '@/components/LivestockCard';
import AddLivestockDialog from '@/components/AddLivestockDialog';
import { Plus, Sprout } from 'lucide-react';
import type { Livestock } from '@shared/schema';

export default function LivestockPage() {
  const { t } = useLanguage();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: livestock = [], isLoading } = useQuery<Livestock[]>({
    queryKey: ['/api/livestock'],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="title-livestock">
            {t('livestock.title')}
          </h1>
          <p className="text-muted-foreground mt-1">
            Учет и мониторинг поголовья скота
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} data-testid="button-add-livestock">
          <Plus className="h-4 w-4 mr-2" />
          {t('livestock.addNew')}
        </Button>
      </div>

      {livestock.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sprout className="h-5 w-5" />
              Нет добавленных животных
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Добавьте информацию о вашем скоте (коровы, овцы, лошади и т.д.). 
              AI будет анализировать данные и давать рекомендации по кормам для увеличения производительности.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)} data-testid="button-add-first-livestock">
              <Plus className="h-4 w-4 mr-2" />
              Добавить первую группу
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {livestock.map((item) => (
            <LivestockCard
              key={item.id}
              id={item.id}
              type={item.type}
              count={item.count}
              healthStatus="healthy"
              testId={`livestock-card-${item.id}`}
            />
          ))}
        </div>
      )}

      <AddLivestockDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
}
