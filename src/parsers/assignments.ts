import { Assignment, RawAssignment } from '../types/assignment';
import { Course } from '../types/course';
import { Term } from '../types/term';

import type User from '../user';

export async function assignmentsParser(assignments: RawAssignment[], user: User): Promise<Assignment[]> {
	const mapped: Assignment[] = [];

	assignments.forEach(async (assignment) => {
		let score;
		let percentage;

		isNaN(parseFloat(assignment.score)) ? score = assignment.score : score = parseFloat(assignment.score);
		isNaN(parseFloat(assignment.scorePercentage)) ? percentage = assignment.scorePercentage : percentage = parseFloat(assignment.scorePercentage);

		const terms: Term[] = [];
		(await user.getTerms()).forEach(term => {
			if (assignment.termIDs.includes(term.termID))
				terms.push(term);
		});

		const course = ((await user.getCourses()) as Course[]).filter(course => course.name == assignment.courseName)[0];

		mapped.push({
			name: assignment.assignmentName,
			terms: terms,
			course: course,
			comments: assignment.comments,
			feedback: assignment.feedback,
			dates: {
				due: new Date(assignment.dueDate),
				assigned: new Date(assignment.assignedDate),
				lastModified: new Date(assignment.modifiedDate)
			},
			points: {
				score,
				percentage,
				maxPoints: assignment.totalPoints
			},
			status: {
				missing: assignment.missing,
				cheated: assignment.cheated,
				dropped: assignment.dropped,
				incomplete: assignment.incomplete,
				turnedIn: assignment.turnedIn,
				notGraded: assignment.notGraded
			}
		});
	});

	return mapped;
}