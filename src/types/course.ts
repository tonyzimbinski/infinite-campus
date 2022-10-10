import { Grade, RawGrade } from './grade';

export interface RawCourse {
	_id: string;
	rosterID: number;
	personID: number;
	structureID: number;
	calendarID: number;
	schoolID: number;
	courseID: number;
	sectionID: number;
	courseName: string;
	couseNumber: string;
	isResponsive: boolean;
	sectionNumber: string;
	endYear: number;
	schoolName: string;
	trialID: number;
	trialActive: boolean;
	roomName: string;
	teacherDisplay: string;
	hideStandardsOnPortal: boolean;
	dropped: boolean;
	gradingTasks: RawGrade[];
	sectionPlacements: any[];
	_model: string;
	_hashCode: string;
}

export interface Course {
	id: number;
	name: string;
	teacher: string;
	dropped: boolean;
	room: string;
	grades: Grade[];
	school: {
		name: string;
		id: number;
	};
	time: {
		period?: string;
		periodSeq?: number;
		start: string;
		end: string;
	};
}