import { Course } from './course';
import { Term } from './term';

export interface RawRosterItem {
	_id: string;
	sectionID: number;
	termID: number;
	termName: string;
	termSeq: number;
	periodID: number;
	trialID: number;
	periodSequnce: number;
	term: {
		_id: string;
		termID: number;
		termScheduleID: number;
		seq: number;
		startDate: string;
		endDate: string;
		stateCode: string;
		termName: string;
		structureID: number;
		isPrimary: boolean;
		termScheduleName: string;
		calendarID: number;
		scheduleStructureName: string;
		_model: string;
		_hashCode: string;
	};
	periodScheduleID: number;
	startTime: string;
	endTime: string;
	periodName: string;
	periodScheduleName: string;
	teacherDisplay: string;
	periodScheduleSequnce: number;
	structureID: number;
	courseID: number;
	courseNumber: string;
	sectionNumber: string;
	courseName: string;
	termScheduleID: number;
	startDate: string;
	endDate: string;
	roomID: number;
	roomName: string;
	unitAttendance: boolean;
	attaendance: boolean;
	isResponsive: boolean;
	_model: string;
	_hashCode: string;
}

export interface RosterItem {
	id: number;
	term: Term;
	period: {
		name: string;
		sequence: number;
		start: Date;
		end: Date;
	};
	course: Course;
}