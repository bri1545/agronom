import { useLanguage } from '@/contexts/LanguageContext';
import WeatherWidget from '@/components/WeatherWidget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CloudRain, Snowflake, AlertTriangle } from 'lucide-react';

// TODO: remove mock functionality - this will be replaced with real OpenWeather API data
const mockWeatherInsights = [
  {
    title: 'Прогноз осадков',
    description: 'Ожидаются дожди в течение следующих 3 дней. Рекомендуется отложить полевые работы.',
    icon: CloudRain,
  },
  {
    title: 'Подготовка к зиме',
    description: 'Первые заморозки прогнозируются через 45 дней. Начните заготовку кормов и утепление помещений.',
    icon: Snowflake,
  },
  {
    title: 'Погодные риски',
    description: 'Низкий риск экстремальных погодных условий на следующие 14 дней.',
    icon: AlertTriangle,
  },
];

export default function Weather() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="title-weather">
          {t('weather.title')}
        </h1>
        <p className="text-muted-foreground mt-1">
          Прогноз погоды и климатический анализ для Казахстана
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <WeatherWidget />
        </div>
        <div className="lg:col-span-2 space-y-4">
          {mockWeatherInsights.map((insight, i) => (
            <Card key={i} data-testid={`weather-insight-${i}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <insight.icon className="h-5 w-5 text-primary" />
                  {insight.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
