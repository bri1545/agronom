import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, Edit, Trash2 } from 'lucide-react';

interface FieldCardProps {
  id: string;
  name: string;
  area: number;
  crop: string;
  location: string;
  status?: 'healthy' | 'attention' | 'critical';
  testId?: string;
}

const statusColors = {
  healthy: 'bg-green-500',
  attention: 'bg-yellow-500',
  critical: 'bg-red-500',
};

export default function FieldCard({
  id,
  name,
  area,
  crop,
  location,
  status = 'healthy',
  testId,
}: FieldCardProps) {
  const { t } = useLanguage();

  return (
    <Card className="hover-elevate" data-testid={testId}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg" data-testid={`${testId}-name`}>{name}</CardTitle>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="h-3 w-3" />
              <span data-testid={`${testId}-location`}>{location}</span>
            </div>
          </div>
          <div className={`h-2 w-2 rounded-full ${statusColors[status]}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('fields.area')}:</span>
            <span className="font-medium" data-testid={`${testId}-area`}>
              {area} {t('fields.hectares')}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('fields.crop')}:</span>
            <Badge variant="secondary" data-testid={`${testId}-crop`}>{crop}</Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => console.log('Edit field:', id)}
          data-testid={`${testId}-edit`}
        >
          <Edit className="h-4 w-4 mr-1" />
          {t('common.edit')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => console.log('Delete field:', id)}
          data-testid={`${testId}-delete`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
