import axios from '../axios';

import { Assignment, RawAssignment } from '../types/assignment';
import { Course, RawCourse } from '../types/course';
import { RawRosterItem, RosterItem } from '../types/roster';
import { RawTerm, Term } from '../types/term';

import { assignmentsParser } from '../parsers/assignments';
import { coursesParser } from '../parsers/courses';
import { DistrictData } from '../types/districtData';
import { termsParser } from '../parsers/terms';

class User {
	useRawData = false;
	private district: DistrictData;

	constructor(district: DistrictData) {
		this.district = district;
	}

	async getAssignments(): Promise<Assignment[] | RawAssignment[]> {
		return null;
	}

	async getCourses(): Promise<Course[] | RawCourse[]> {
		return null;
	}

	async getTerms(): Promise<Term[] | RawTerm[]> {
		return null;
	}

	async getRoster(): Promise<RosterItem[] | RawRosterItem[]> {
		return null;
	}
}

export default User;