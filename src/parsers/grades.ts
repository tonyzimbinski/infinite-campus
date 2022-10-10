import { Grade, RawGrade } from '../types/grade';

export function gradesParser(grades: RawGrade[]): Grade[] {
	const gradesMap: Grade[] = [];

	grades.forEach(grade => {
		const mappedGrade: Grade = {
			name: grade.taskName
		};

		if (grade.comments) mappedGrade.comments = grade.comments;
		if (grade.progressTotalPoints) mappedGrade.score.maxPoints = grade.progressTotalPoints;
		if (grade.progressPointsEarned) mappedGrade.score.points = grade.progressPointsEarned;

		if (grade.progressScore) mappedGrade.score.name = grade.progressScore;
		else if (grade.score) mappedGrade.score.name = grade.score;

		if (grade.progressPercentage) mappedGrade.score.percentage = parseFloat(grade.progressPercentage);
		else if (grade.score && grade.progressTotalPoints) mappedGrade.score.percentage = (parseFloat(grade.score) / grade.progressTotalPoints) * 100;

		gradesMap.push(mappedGrade);
	});

	return gradesMap;
}