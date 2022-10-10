import { RawRosterItem, RosterItem } from '../types/roster';
import { RawTerm, Term } from '../types/term';
import { Course } from '../types/course';

import type User from '../user';

export async function parseRoster(roster: RawRosterItem[], user: User): Promise<RosterItem[]> {
	const mapped: RosterItem[] = [];
	const terms = (await user.getTerms() as Term[]);
	const courses = (await user.getCourses() as Course[]);

	roster.forEach(async (item) => {
		const term = terms.find(term => term.id == item.termID);
		const course = courses.find(course => course.id == item.courseID);

		mapped.push({
			id: parseInt(item._id),
			term,
			course,
			period: {
				name: item.periodName,
				sequence: item.periodSequnce,
				start: new Date(item.startTime),
				end: new Date(item.endTime)
			}
		});
	});

	return mapped;
}