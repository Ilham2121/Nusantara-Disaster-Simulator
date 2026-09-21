// ===== SIMULATION TYPE DEFINITIONS =====

export type DisasterType = "earthquake" | "eruption";
export type SimulationState = "idle" | "running" | "paused" | "completed";
export type PlaybackSpeed = 1 | 2 | 4;

// --- Earthquake Types ---

export type ShakingIntensity = "negligible" | "light" | "moderate" | "strong" | "very_strong" | "severe" | "extreme";
export type EnvironmentType = "urban" | "rural" | "coastal";
export type DamageLevel = "none" | "minor" | "moderate" | "major" | "severe" | "catastrophic";

export interface EarthquakeParameters {
  magnitude: number;       // 4.0 - 9.0
  depth: number;           // 1 - 300 km
  duration: number;        // 10 - 60 seconds (simulation duration)
  environment: EnvironmentType;
  location: string;
}

// --- Eruption Types ---

export type ActivityLevel = "normal" | "advisory" | "watch" | "warning";
export type EruptionType = "effusive" | "explosive" | "phreatic";

export interface EruptionParameters {
  activityLevel: ActivityLevel;
  eruptionType: EruptionType;
  volcano: string;
  ashDirection: "north" | "south" | "east" | "west";
  settlementDistance: number; // km from crater
}

export type DisasterParameters = EarthquakeParameters | EruptionParameters;

// --- Timeline ---

export interface EducationalOverlay {
  title: string;
  content: string;
  source?: string;
  sourceUrl?: string;
}

export interface TimelineEvent {
  time: number;              // seconds into simulation
  endTime?: number;          // optional end time (defaults to time + 2)
  event: string;             // event key for animation triggers
  phase: string;             // phase label
  description: string;       // display description
  animations: string[];      // animation keys to trigger
  educationalOverlay?: EducationalOverlay;
  impacts?: Impact[];
}

// --- Impact ---

export type ImpactCategory = "environmental" | "infrastructure" | "human" | "response";
export type Severity = "low" | "moderate" | "high" | "critical";

export interface Impact {
  category: ImpactCategory;
  severity: Severity;
  description: string;
  visualKey?: string;        // key for visual effect
}

// --- Simulation Result ---

export interface MitigationAction {
  step: number;
  action: string;
  detail: string;
  icon?: string;
}

export interface SimulationResult {
  disasterType: DisasterType;
  scenario: string;
  parameters: DisasterParameters;
  impacts: Impact[];
  riskLevel: number;          // 0-100
  riskLabel: string;
  mitigationActions: MitigationAction[];
  learningObjective: string;
  funFact?: string;
  sources: { name: string; url?: string }[];
}

// --- Scenario Definition ---

export interface ScenarioDefinition {
  id: string;
  disasterType: DisasterType;
  name: string;
  location: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  defaultParameters: DisasterParameters;
  parameterRanges: Record<string, { min: number; max: number; step: number; unit: string }>;
  learningObjective: string;
  imageKey?: string;
}

// --- Quiz ---

export interface QuizQuestion {
  id: string;
  question: string;
  options: { key: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  relatedScenario?: string;
}

// --- Computed Simulation State ---

export interface EarthquakeComputedState {
  shakingIntensity: ShakingIntensity;
  shakingIntensityValue: number;   // 0-1
  damageLevel: DamageLevel;
  objectFallProbability: number;   // 0-1
  buildingShakeAmplitude: number;  // 0-1
  groundDisplacement: number;      // 0-1
  infrastructureDamage: number;    // 0-1
  aftershockRisk: number;          // 0-1
  tsunamiPotential?: boolean;
  tsunamiHeight?: number;          // in meters
  landslideRisk?: boolean;
  pgaG?: number;                   // Peak Ground Acceleration in g (0.01 - 1.5g)
  mmiScale?: string;               // Roman numeral MMI scale (I - XII)
  spIntervalSeconds?: number;      // S - P wave travel time arrival gap
  liquefactionPotential?: boolean; // Sand boils and ground liquefaction risk
}

export interface EruptionComputedState {
  eruptionIntensity: number;       // 0-1
  ashColumnHeight: number;         // 0-1 (normalized)
  ashSpreadRadius: number;         // 0-1
  lavaFlowSpeed: number;           // 0-1
  pyroclasticRisk: number;         // 0-1
  visibilityReduction: number;     // 0-1
  evacuationUrgency: Severity;
}

export type ComputedState = EarthquakeComputedState | EruptionComputedState;
