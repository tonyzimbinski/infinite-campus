import { RawTerm, Term } from '../types/term';
import { coursesParser } from './courses';
import { RawRosterItem } from '../types/roster';

import type User from '../user';

export function termsParser(terms: RawTerm[], user: User): Term[] {
	const termsMap: Term[] = [];

	terms.forEach(async term => {
		termsMap.push({
			id: term.termID,
			name: term.termName,
			courses: await coursesParser(term.courses, user),
			time: {
				sequence: term.termSeq,
				start: new Date(term.startDate),
				end: new Date(term.endDate)
			}
		});
	});

	return termsMap;
}