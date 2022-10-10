import { Course, RawCourse } from './course';

export interface RawTerm {
	termID: number;
	termName: string;
	termScheduleID: number;
	termScheduleName: string;
	termSeq: number;
	startDate: string;
	endDate: string;
	courses: RawCourse[];
}

export interface Term {
	id: number;
	name: string;
	courses: Course[];
	time: {
		sequence: number;
		start: Date;
		end: Date;
	};
}