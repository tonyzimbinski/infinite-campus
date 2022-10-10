export interface RawGrade {
	_id: string;
	personID: number;
	trialID: number;
	calendarID: number;
	structureID: number;
	courseID: number;
	courseName: string;
	sectionID: number;
	taskID: number;
	termID: number;
	hasAssignments: boolean;
	hasCompositeTasks: boolean;
	taskName: string;
	gradedOnce: boolean;
	treeTraversalSeq: number;
	calcMethod: string;
	groupWeighted?: boolean;
	usePercent: boolean;
	scoreID?: number;
	score?: string;
	comments?: string;
	hasDetail: boolean;
	_model: string;
	_hashCode: string;
	termName: string;
	termSeq: number;
	cumulativeTermSeq?: number;
	maxAssignments?: number;
	curveID?: number;
	progressScore?: string;
	progressPointsEarned?: number;
	progressTotalPoints?: number;
	progressPercentage?: string;
}

export interface Grade {
	name: string;
	comments?: string;
	score?: {
		name?: string;
		percentage?: number;
		points?: number;
		maxPoints?: number;
	};
}