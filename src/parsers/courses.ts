import { Course, RawCourse } from '../types/course';
import { RawRosterItem, RosterItem } from '../types/roster';
import { gradesParser } from './grades';

import type User from '../user';

export async function coursesParser(courses: RawCourse[], user: User): Promise<Course[]> {
	const coursesMap: Course[] = [];

	user.useRawData = true;
	const roster: RawRosterItem[] = (await user.getRoster() as RawRosterItem[]);
	user.useRawData = false;

	courses.forEach(course => {
		const rosterItem = roster.find(item => item.courseID == course.courseID);

		coursesMap.push({
			id: course.courseID,
			name: course.courseName,
			teacher: course.teacherDisplay,
			dropped: course.dropped,
			room: course.roomName,
			grades: gradesParser(course.gradingTasks),
			school: {
				name: course.schoolName,
				id: course.schoolID
			},
			time: {
				start: rosterItem.startTime,
				end: rosterItem.endTime
			}
		});
	});

	return coursesMap;
}