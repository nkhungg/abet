package abet.cse.controller;

import abet.cse.dto.CourseInsOutcomeExtend;
import abet.cse.dto.CourseOutcomeExtend;
import abet.cse.model.CourseDetails;
import abet.cse.model.CourseInsDetails;
import abet.cse.model.CourseInsOutcome;
import abet.cse.model.CourseInsOutline;
import abet.cse.model.CourseOutcome;
import abet.cse.model.CourseOutline;
import abet.cse.model.ProgramIns;
import abet.cse.model.SurveyIndicatorExt;
import abet.cse.model.SurveyIndicatorLevel;
import abet.cse.repository.CourseDetailsRepo;
import abet.cse.repository.CourseInsDetailsRepo;
import abet.cse.repository.CourseInsOutcomeRepo;
import abet.cse.repository.CourseInsOutlineRepo;
import abet.cse.repository.CourseOutcomeRepo;
import abet.cse.repository.CourseOutlineRepo;
import abet.cse.repository.ParallelCourseRepo;
import abet.cse.repository.PrerequisiteCourseRepo;
import abet.cse.repository.PriorCourseRepo;
import abet.cse.repository.ProgramInsRepo;
import abet.cse.repository.SurveyIndicatorRepo;
import abet.cse.statics.Constant;
import abet.cse.utils.Utils;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
@RequiredArgsConstructor
public class ExportController {

	private final ParallelCourseRepo parallelCourseRepo;
	private final PriorCourseRepo priorCourseRepo;
	private final PrerequisiteCourseRepo prerequisiteCourseRepo;

	private final CourseOutlineRepo courseOutlineRepo;
	private final CourseOutcomeRepo courseOutcomeRepo;
	private final CourseDetailsRepo courseDetailsRepo;

	private final ProgramInsRepo programInsRepo;
	private final CourseInsOutlineRepo courseInsOutlineRepo;
	private final CourseInsOutcomeRepo courseInsOutcomeRepo;
	private final CourseInsDetailsRepo courseInsDetailsRepo;

	private final SurveyIndicatorRepo surveyIndicatorRepo;

	@GetMapping(value = { "api/programs/{programId}/courses/{courseId}/export" })
	public String exportCourseOutlineToWord(Model model, @PathVariable("programId") String programId,
			@PathVariable("courseId") String courseId) {

		CourseOutline courseOutline = courseOutlineRepo.findByProgramIdAndId(programId, courseId);
		List<String> parallelCourseList = parallelCourseRepo.findNameByProgramIdAndCourseId(programId, courseId);
		List<String> prerequisiteCourseList = prerequisiteCourseRepo.findNameByProgramIdAndCourseId(programId, courseId);
		List<String> priorCourseList = priorCourseRepo.findNameByProgramIdAndCourseId(programId, courseId);
		List<CourseOutcome> courseOutcomeList = courseOutcomeRepo.findByProgramIdAndCourseId(programId, courseId, 100, 0);
		List<CourseOutcomeExtend> courseOutcomeExtendList = Utils.convertToOutcomeHierarchy(courseOutcomeList);
		List<CourseDetails> courseDetailsList = courseDetailsRepo
				.findByProgramIdAndCourseIdAndType(programId, courseId, 1);

		model.addAttribute("courseOutline", courseOutline);
		model.addAttribute("parallelCourseList", StringUtils.join(parallelCourseList, ", "));
		model.addAttribute("prerequisiteCourseList", StringUtils.join(prerequisiteCourseList, ", "));
		model.addAttribute("priorCourseList", StringUtils.join(priorCourseList, ", "));
		model.addAttribute("courseOutcomeExtendList", courseOutcomeExtendList);
		model.addAttribute("courseDetailsList", courseDetailsList);
		return "courseOutline";
	}

	@GetMapping(value = { "api/program-instances/{programInfo}/course-instances/{courseId}/export" })
	public String exportCourseOutlineInsToWord(Model model, @PathVariable("programInfo") String programInfo,
			@PathVariable("courseId") String courseId) {

		ProgramIns programIns = Utils.getProgramInstanceId(programInsRepo, programInfo);
		Integer programInsId = programIns.getId();
		String programId = programIns.getProgramId();

		CourseInsOutline courseInsOutline = courseInsOutlineRepo.findByProgramIdAndId(programInsId, courseId);
		List<String> parallelCourseList = parallelCourseRepo.findNameByProgramIdAndCourseId(programId, courseId);
		List<String> prerequisiteCourseList = prerequisiteCourseRepo.findNameByProgramIdAndCourseId(programId, courseId);
		List<String> priorCourseList = priorCourseRepo.findNameByProgramIdAndCourseId(programId, courseId);
		List<CourseInsOutcome> courseInsOutcomeList = courseInsOutcomeRepo.findByProgramInsIdAndCourseId(programInsId, courseId, 100, 0);
		List<CourseInsOutcomeExtend> courseOutcomeExtendList = Utils.convertToInsOutcomeHierarchy(courseInsOutcomeList);
		List<CourseInsDetails> courseDetailsList = courseInsDetailsRepo
				.findByProgramInsIdAndCourseIdAndType(programInsId, courseId, 1);

		model.addAttribute("courseInsOutline", courseInsOutline);
		model.addAttribute("parallelCourseList", StringUtils.join(parallelCourseList, ", "));
		model.addAttribute("prerequisiteCourseList", StringUtils.join(prerequisiteCourseList, ", "));
		model.addAttribute("priorCourseList", StringUtils.join(priorCourseList, ", "));
		model.addAttribute("courseInsOutcomeExtendList", courseOutcomeExtendList);
		model.addAttribute("courseInsDetailsList", courseDetailsList);

		return "courseInsOutline";
	}

	@GetMapping(value = { "api/program-instances/{programInfo}/surveys/{surveyName}/export" })
	public String exportSurveyToWord(Model model, @PathVariable("programInfo") String programInfo,
			@PathVariable("surveyName") String surveyName) {
		List<SurveyIndicatorExt> surveyIndicatorExtList = surveyIndicatorRepo.find(surveyName, 100, 0);
		for (SurveyIndicatorExt surveyIndicatorExt : surveyIndicatorExtList) {
			String optionStr = surveyIndicatorExt.getOptionStr();
			String[] optionArr = optionStr == null ? new String[0] : surveyIndicatorExt.getOptionStr().split("\\|");
			surveyIndicatorExt.setOptionSet(optionArr);
			for (SurveyIndicatorLevel surveyIndicatorLevel: surveyIndicatorExt.getAnswerSet()) {
				String description = surveyIndicatorLevel.getDescription() + Utils.getLimitGrade(surveyIndicatorLevel);
				surveyIndicatorLevel.setDescription(description);
			}
		}
		model.addAttribute("surveyName", surveyName);
		model.addAttribute("surveyIndicatorList", surveyIndicatorExtList);
		model.addAttribute("optionStatement", Constant.OPTION_STATEMENT);
		model.addAttribute("otherIdea", Constant.OTHER_IDEA);
		return "survey";
	}
}
