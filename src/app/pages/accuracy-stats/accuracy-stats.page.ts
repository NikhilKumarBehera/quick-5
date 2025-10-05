import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { NavController } from '@ionic/angular';
import { Chart, registerables } from 'chart.js';
import { CategoryProgressService } from 'src/app/services/category-progress-service/category-progress-service';

Chart.register(...registerables);

interface CategoryStat {
  name: string;
  icon: string;
  accuracy: number;
  attempted: number;
  correct: number;
  type: string;
}

@Component({
  selector: 'app-accuracy-stats',
  templateUrl: './accuracy-stats.page.html',
  styleUrls: ['./accuracy-stats.page.scss'],
  standalone: false,
})
export class AccuracyStatsPage implements OnInit, AfterViewInit {
  @ViewChild('accuracyChart', { static: false }) chartCanvas!: ElementRef;

  chart: any;
  isScrolled = false;
  overallAccuracy = 0;
  selectedPeriod = '7days';

  periods = [
    { label: '7D', value: '7days' },
    { label: '30D', value: '30days' },
    { label: 'All', value: 'all' },
  ];

  categoryStats: CategoryStat[] = [];

  totalAttempted = 0;
  totalCorrect = 0;
  bestStreak = 0;

  constructor(
    private navCtrl: NavController,
    private categoryProgressService: CategoryProgressService
  ) {}

  ngOnInit() {
    this.loadAccuracyData();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.createChart();
    }, 100);
  }

  loadAccuracyData() {
    // Load overall accuracy
    this.overallAccuracy = this.categoryProgressService.getOverallAccuracy();

    // Load category stats
    const categories = ['Math', 'Memory', 'Logic', 'Riddle', 'Pattern'];
    const icons = ['🧮', '🧠', '🎯', '💡', '🔷'];

    this.categoryStats = categories.map((category, index) => {
      const progress =
        this.categoryProgressService.getCategoryProgress(category);
      return {
        name: category,
        icon: icons[index],
        accuracy: progress?.accuracy || 0,
        attempted: progress?.totalAttempts || 0,
        correct: progress?.correctAnswers || 0,
        type: category,
      };
    });

    // Calculate totals
    this.totalAttempted = this.categoryStats.reduce(
      (sum, cat) => sum + cat.attempted,
      0
    );
    this.totalCorrect = this.categoryStats.reduce(
      (sum, cat) => sum + cat.correct,
      0
    );
    this.bestStreak = parseInt(localStorage.getItem('bestStreak') || '0');
  }

  createChart() {
    if (!this.chartCanvas) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');

    // Generate sample data (replace with actual data from localStorage)
    const data = this.generateChartData();

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'Accuracy %',
            data: data.values,
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#667eea',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#667eea',
            borderWidth: 1,
            displayColors: false,
            callbacks: {
              label: (context) => `Accuracy: ${context.parsed.y}%`,
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              font: {
                size: 11,
              },
            },
          },
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: (value) => value + '%',
              font: {
                size: 11,
              },
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
            },
          },
        },
      },
    });
  }

  generateChartData() {
    // Generate data based on selected period
    let labels: string[] = [];
    let values: number[] = [];

    if (this.selectedPeriod === '7days') {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      labels = days;
      // Get actual data from localStorage or generate sample
      values = this.getWeeklyData();
    } else if (this.selectedPeriod === '30days') {
      labels = Array.from({ length: 30 }, (_, i) => `${i + 1}`);
      values = this.getMonthlyData();
    } else {
      labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      values = this.getAllTimeData();
    }

    return { labels, values };
  }

  getWeeklyData(): number[] {
    // Get actual weekly accuracy data from localStorage
    const weekData = JSON.parse(localStorage.getItem('weeklyAccuracy') || '[]');
    if (weekData.length === 7) return weekData;

    // Sample data if no real data
    return [65, 72, 68, 75, 80, 78, 82];
  }

  getMonthlyData(): number[] {
    // Generate or fetch monthly data
    return Array.from(
      { length: 30 },
      () => Math.floor(Math.random() * 30) + 60
    );
  }

  getAllTimeData(): number[] {
    return [68, 72, 75, 78];
  }

  selectPeriod(period: string) {
    this.selectedPeriod = period;
    if (this.chart) {
      this.chart.destroy();
    }
    this.createChart();
  }

  onScroll(event: any) {
    const scrollTop = event.detail.scrollTop;

    // Use threshold with buffer to prevent flickering
    if (scrollTop > 180 && !this.isScrolled) {
      this.isScrolled = true;
    } else if (scrollTop < 150 && this.isScrolled) {
      this.isScrolled = false;
    }
  }

  getAccuracyColor(accuracy: number): string {
    if (accuracy >= 80) return '#10b981';
    if (accuracy >= 70) return '#06d6a0';
    if (accuracy >= 50) return '#fbbf24';
    if (accuracy >= 30) return '#f97316';
    return '#ef4444';
  }

  getCircleOffset(accuracy: number): number {
    const circumference = 2 * Math.PI * 85;
    return circumference - (accuracy / 100) * circumference;
  }

  getAccuracyMessage(accuracy: number): string {
    if (accuracy >= 80) return 'Excellent performance! Keep it up!';
    if (accuracy >= 60) return "Good work! You're improving!";
    if (accuracy >= 40) return 'Keep practicing to get better!';
    return "Don't give up! Practice makes perfect!";
  }

  getAccuracyLevel(accuracy: number): string {
    if (accuracy >= 70) return 'High';
    if (accuracy >= 40) return 'Medium';
    return 'Low';
  }

  getAccuracyClass(accuracy: number): string {
    if (accuracy >= 70) return 'badge-high';
    if (accuracy >= 40) return 'badge-medium';
    return 'badge-low';
  }

  getAccuracyGradient(accuracy: number): string {
    if (accuracy >= 70)
      return 'linear-gradient(90deg, #10b981 0%, #06d6a0 100%)';
    if (accuracy >= 40)
      return 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)';
    return 'linear-gradient(90deg, #ef4444 0%, #f97316 100%)';
  }

  viewCategoryDetails(category: CategoryStat) {
    // Navigate to category details or show modal
    console.log('View details for:', category.name);
  }

  goBack() {
    this.navCtrl.back();
  }
}
