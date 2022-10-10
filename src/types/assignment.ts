import { Course } from './course';
import { Term } from './term';

export interface RawAssignment {
	objectSectionID: number;
	parentObjectSectionID: number;
	type: number;
	personID: number;
	taskID: number;
	groupActivityID: number;
	termIDs: number[];
	assignmentName: string;
	calendarID: number;
	structureID: number;
	sectionID: number;
	dueDate: string;
	assignedDate: string;
	modifiedDate: string;
	courseName: string;
	active: boolean;
	scoringType: string;
	score: string;
	scorePoints: string;
	scorePercentage: string;
	totalPoints: number;
	comments: string;
	feedback: string;
	late: boolean;
	missing: boolean;
	dropped: boolean;
	cheated: boolean;
	incomplete: boolean;
	turnedIn: boolean;
	wysiwygSubmission: boolean;
	upload: boolean;
	driveSubmission: boolean;
	multiplier: number;
	hasStudentHTML: any;
	hasTeacherHTML: any;
	hasQuiz: any;
	hasLTI: any;
	hasLTIAcceptsScores: any;
	hasFile: any;
	hasExternalFile: any;
	hasSubmission: any;
	hasDiscussion: any;
	hasRubric: any;
	notGraded: boolean;
	isValidRubric: boolean;
	isValidMark: boolean;
	includeCampusLearning: boolean;
}

export interface Assignment {
	name: string;
	terms: Term[];
	course: Course;
	comments: string;
	feedback: string;
	dates: {
		due: Date;
		assigned: Date;
		lastModified: Date;
	};
	points: {
		score: number | string;
		percentage: number;
		maxPoints: number;
	};
	status: {
		missing: boolean;
		cheated: boolean;
		dropped: boolean;
		incomplete: boolean;
		turnedIn: boolean;
		notGraded: boolean;
	};
}