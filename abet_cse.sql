-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 13, 2024 at 03:39 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.0.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `abet_cse`
--

-- --------------------------------------------------------

--
-- Table structure for table `attribute`
--

CREATE TABLE `attribute` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `tableName` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `attribute_option`
--

CREATE TABLE `attribute_option` (
  `id` int(11) NOT NULL,
  `attrId` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `class`
--

CREATE TABLE `class` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `course_instance_id` varchar(255) DEFAULT NULL,
  `program_id` varchar(255) DEFAULT NULL,
  `lecturer_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `class_assess`
--

CREATE TABLE `class_assess` (
  `class_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `course_outcome_instance_id` int(11) DEFAULT NULL,
  `class_threshold` float DEFAULT NULL,
  `description` text DEFAULT NULL,
  `cdio` varchar(255) DEFAULT NULL,
  `threshold` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course`
--

CREATE TABLE `course` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `credit` varchar(255) DEFAULT NULL,
  `program_id` varchar(255) DEFAULT NULL,
  `semester_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course_instance`
--

CREATE TABLE `course_instance` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `credit` varchar(255) DEFAULT NULL,
  `program_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course_instance_class_student`
--

CREATE TABLE `course_instance_class_student` (
  `courseInstanceId` varchar(255) DEFAULT NULL,
  `studentId` varchar(255) NOT NULL,
  `classId` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course_instance_ndct`
--

CREATE TABLE `course_instance_ndct` (
  `id` int(11) NOT NULL,
  `courseId` varchar(255) DEFAULT NULL,
  `program_id` varchar(255) DEFAULT NULL,
  `chuong` varchar(255) DEFAULT NULL,
  `noi_dung` text DEFAULT NULL,
  `hoat_dong_day_va_hoc` text DEFAULT NULL,
  `hoat_dong_danh_gia` text DEFAULT NULL,
  `chuan_dau_ra` text DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course_instance_ndct_course_outcome_instance`
--

CREATE TABLE `course_instance_ndct_course_outcome_instance` (
  `course_instance_ndct_id` int(11) NOT NULL,
  `course_outcome_instance_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course_ndct`
--

CREATE TABLE `course_ndct` (
  `id` int(11) NOT NULL,
  `courseId` varchar(255) DEFAULT NULL,
  `programId` varchar(255) DEFAULT NULL,
  `chuong` varchar(255) DEFAULT NULL,
  `noi_dung` text DEFAULT NULL,
  `hoat_dong_danh_gia` text DEFAULT NULL,
  `chuan_dau_ra` text DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course_ndct_course_outcome`
--

CREATE TABLE `course_ndct_course_outcome` (
  `course_ndct_id` int(11) NOT NULL,
  `course_outcome_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course_outcome_instance`
--

CREATE TABLE `course_outcome_instance` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `program_id` varchar(255) DEFAULT NULL,
  `course_id` varchar(255) DEFAULT NULL,
  `cdio` varchar(255) DEFAULT NULL,
  `threshold` float DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `indicator_name` varchar(255) DEFAULT NULL,
  `percent_indicator` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `class_threshold` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `foundation_test_answer`
--

CREATE TABLE `foundation_test_answer` (
  `question_id` varchar(255) DEFAULT NULL,
  `answer_id` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `foundation_test_question`
--

CREATE TABLE `foundation_test_question` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `answer` text DEFAULT NULL,
  `test_id` varchar(255) DEFAULT NULL,
  `percent` int(11) DEFAULT NULL,
  `outcome_name` varchar(255) DEFAULT NULL,
  `indicator_name` varchar(255) DEFAULT NULL,
  `level` varchar(255) DEFAULT NULL,
  `image` text DEFAULT NULL,
  `lecturer_id` varchar(255) DEFAULT NULL,
  `subject_id` int(11) DEFAULT NULL,
  `time` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `foundation_test_subject`
--

CREATE TABLE `foundation_test_subject` (
  `id` varchar(255) NOT NULL,
  `subject_id` int(11) DEFAULT NULL,
  `foundation_test_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `general_course`
--

CREATE TABLE `general_course` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `groups` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `general_course`
--

INSERT INTO `general_course` (`id`, `name`, `groups`, `description`) VALUES
('1', 'Calculus 1', 1, '12');

-- --------------------------------------------------------

--
-- Table structure for table `general_course_attr_selected`
--

CREATE TABLE `general_course_attr_selected` (
  `attrId` int(11) NOT NULL,
  `value` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `general_program`
--

CREATE TABLE `general_program` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `major` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `general_program`
--

INSERT INTO `general_program` (`id`, `name`, `description`, `major`) VALUES
('CS2020-1', 'CSE', 'undefined', 'Data system');

-- --------------------------------------------------------

--
-- Table structure for table `grading`
--

CREATE TABLE `grading` (
  `studentId` varchar(255) NOT NULL,
  `classId` varchar(255) DEFAULT NULL,
  `questionCourseOutcomeId` int(11) DEFAULT NULL,
  `score` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `grading_foundation_test`
--

CREATE TABLE `grading_foundation_test` (
  `student_id` varchar(255) NOT NULL,
  `score` double DEFAULT NULL,
  `class_id` varchar(255) DEFAULT NULL,
  `result` varchar(255) DEFAULT NULL,
  `question_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `indicator_level`
--

CREATE TABLE `indicator_level` (
  `level_id` varchar(255) NOT NULL,
  `indicator_name` varchar(255) DEFAULT NULL,
  `program_id` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `indicator_level`
--

INSERT INTO `indicator_level` (`level_id`, `indicator_name`, `program_id`, `description`) VALUES
('124', 'scheduled lambda function', '1', 'adsf'),
('2', 'scheduled lambda function', '1', '1234');

-- --------------------------------------------------------

--
-- Table structure for table `lecturer`
--

CREATE TABLE `lecturer` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `faculty` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `contact_level` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lecturer`
--

INSERT INTO `lecturer` (`id`, `name`, `faculty`, `email`, `department`, `phone_number`, `contact_level`) VALUES
('1', 'Nguyet', 'CSE', 'nguyettran@hcmut.edu.vn', 'MIS', '21442', 'faculty level');

-- --------------------------------------------------------

--
-- Table structure for table `level`
--

CREATE TABLE `level` (
  `levelId` int(11) NOT NULL,
  `levelName` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mon_hoc_song_hanh`
--

CREATE TABLE `mon_hoc_song_hanh` (
  `Id_mon_song_hanh` varchar(255) NOT NULL,
  `Id_mon` varchar(255) DEFAULT NULL,
  `programId` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mon_hoc_tien_quyet`
--

CREATE TABLE `mon_hoc_tien_quyet` (
  `Id_mon_tien_quyet` varchar(255) NOT NULL,
  `Id_mon` varchar(255) DEFAULT NULL,
  `programId` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mon_hoc_truoc`
--

CREATE TABLE `mon_hoc_truoc` (
  `Id_mon_truoc` varchar(255) NOT NULL,
  `Id_mon` varchar(255) DEFAULT NULL,
  `programId` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `peo`
--

CREATE TABLE `peo` (
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `program_id` varchar(255) DEFAULT NULL,
  `priority` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `peo`
--

INSERT INTO `peo` (`name`, `description`, `program_id`, `priority`) VALUES
('PEO1', 'undefined', '1', 1);

-- --------------------------------------------------------

--
-- Table structure for table `peo_outcome`
--

CREATE TABLE `peo_outcome` (
  `program_id` varchar(255) NOT NULL,
  `peo_name` varchar(255) NOT NULL,
  `outcome_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `performance_indicator`
--

CREATE TABLE `performance_indicator` (
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `outcome_name` varchar(255) DEFAULT NULL,
  `program_id` varchar(255) DEFAULT NULL,
  `comment` int(11) DEFAULT NULL,
  `additional_question` text DEFAULT NULL,
  `description_vn` text DEFAULT NULL,
  `cdio` varchar(255) DEFAULT NULL,
  `level` varchar(255) DEFAULT NULL,
  `assessment_comment` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `performance_indicator`
--

INSERT INTO `performance_indicator` (`name`, `description`, `outcome_name`, `program_id`, `comment`, `additional_question`, `description_vn`, `cdio`, `level`, `assessment_comment`) VALUES
('scheduled lambda function', 'undefined', 'Knowledge', '1', 0, 'undefined', NULL, '2', '1', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `program`
--

CREATE TABLE `program` (
  `id` varchar(255) NOT NULL,
  `id_general_program` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `major` varchar(255) DEFAULT NULL,
  `start` int(11) DEFAULT NULL,
  `end` int(11) DEFAULT NULL,
  `apply` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `program`
--

INSERT INTO `program` (`id`, `id_general_program`, `description`, `major`, `start`, `end`, `apply`) VALUES
('1', 'CS2020-1', 'undefined', 'Data system', 2020, 2024, 2020);

-- --------------------------------------------------------

--
-- Table structure for table `program_group`
--

CREATE TABLE `program_group` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `program_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `program_group`
--

INSERT INTO `program_group` (`id`, `name`, `program_id`) VALUES
(1, 'Math and Science', '1');

-- --------------------------------------------------------

--
-- Table structure for table `program_instance`
--

CREATE TABLE `program_instance` (
  `id` int(11) NOT NULL,
  `year` int(11) DEFAULT NULL,
  `semester` int(11) DEFAULT NULL,
  `program_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `program_instance`
--

INSERT INTO `program_instance` (`id`, `year`, `semester`, `program_id`) VALUES
(1, 2022, 1, 'cS');

-- --------------------------------------------------------

--
-- Table structure for table `program_outcome`
--

CREATE TABLE `program_outcome` (
  `outcome_name` varchar(255) NOT NULL,
  `program_id` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `cdio` varchar(255) DEFAULT NULL,
  `description_vn` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `program_outcome`
--

INSERT INTO `program_outcome` (`outcome_name`, `program_id`, `description`, `cdio`, `description_vn`) VALUES
('Knowledge', '1', 'Có thể hiểu và áp dụng kiến thức chương trình học vào thực tế', '3', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `program_outcome_course`
--

CREATE TABLE `program_outcome_course` (
  `program_id` varchar(255) NOT NULL,
  `outcome_name` varchar(255) NOT NULL,
  `course_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `question`
--

CREATE TABLE `question` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `testId` varchar(255) DEFAULT NULL,
  `percent` int(11) DEFAULT NULL,
  `maxScore` float DEFAULT NULL,
  `attachFile` varchar(255) DEFAULT NULL,
  `classId` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `question_course_outcome`
--

CREATE TABLE `question_course_outcome` (
  `id` int(11) NOT NULL,
  `questionId` varchar(255) DEFAULT NULL,
  `courseOutcomeId` int(11) DEFAULT NULL,
  `courseOutcomeName` varchar(255) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `percent` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `semester`
--

CREATE TABLE `semester` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `program_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `semester`
--

INSERT INTO `semester` (`id`, `name`, `program_id`) VALUES
(241, '2425-1', '1');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `major` varchar(255) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`id`, `name`, `major`, `year`, `email`) VALUES
('2013391', 'Nguyễn Khánh Hưng', 'CS', 2002, 'hung.nguyennkhungg@hcmut.edu.vn');

-- --------------------------------------------------------

--
-- Table structure for table `subject`
--

CREATE TABLE `subject` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `survey`
--

CREATE TABLE `survey` (
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `survey_kind_name` varchar(255) DEFAULT NULL,
  `program_instance_id` int(11) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `lock` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `survey_addition_question_level`
--

CREATE TABLE `survey_addition_question_level` (
  `id` int(11) NOT NULL,
  `surveyIndicatorId` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `survey_indicator`
--

CREATE TABLE `survey_indicator` (
  `id` int(11) NOT NULL,
  `surveyName` varchar(255) DEFAULT NULL,
  `programId` varchar(255) DEFAULT NULL,
  `indicatorName` varchar(255) DEFAULT NULL,
  `additionalQuestion` text DEFAULT NULL,
  `comment` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `priority` int(11) DEFAULT NULL,
  `maxGrade` tinyint(4) DEFAULT NULL,
  `outcome` varchar(255) DEFAULT NULL,
  `mode` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `survey_indicator_level`
--

CREATE TABLE `survey_indicator_level` (
  `levelId` varchar(255) NOT NULL,
  `surveyIndicatorId` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `minGrade` tinyint(4) DEFAULT NULL,
  `maxGrade` tinyint(4) DEFAULT NULL,
  `minGradeFlag` tinyint(4) DEFAULT NULL,
  `maxGradeFlag` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `survey_kind`
--

CREATE TABLE `survey_kind` (
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `survey_type`
--

CREATE TABLE `survey_type` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `surveyKind` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_nhomquyen`
--

CREATE TABLE `tbl_nhomquyen` (
  `id` bigint(20) NOT NULL,
  `tenNhomQuyen` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_nhomquyen`
--

INSERT INTO `tbl_nhomquyen` (`id`, `tenNhomQuyen`) VALUES
(1, 'ADMIN'),
(2, 'LECTURER'),
(3, 'STUDENT');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_taikhoan`
--

CREATE TABLE `tbl_taikhoan` (
  `id` bigint(20) NOT NULL,
  `display_name` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `MaNhomQuyen` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_taikhoan`
--

INSERT INTO `tbl_taikhoan` (`id`, `display_name`, `username`, `password`, `MaNhomQuyen`) VALUES
(1, 'Hưng', 'nkhungg', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 1),
(2, 'Nguyet', 'nguyettran', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 2);

-- --------------------------------------------------------

--
-- Table structure for table `test`
--

CREATE TABLE `test` (
  `id` varchar(255) NOT NULL,
  `percent` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `programInstanceId` int(11) DEFAULT NULL,
  `courseInstanceId` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `test_course_outcome`
--

CREATE TABLE `test_course_outcome` (
  `id` int(11) NOT NULL,
  `testId` varchar(255) DEFAULT NULL,
  `courseOutcomeId` int(11) DEFAULT NULL,
  `percent` float DEFAULT NULL,
  `comment` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `thesis_project`
--

CREATE TABLE `thesis_project` (
  `project_id` varchar(255) NOT NULL,
  `project_name` varchar(255) DEFAULT NULL,
  `reviewer_id` varchar(255) DEFAULT NULL,
  `council` varchar(255) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `semester` int(11) DEFAULT NULL,
  `program_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `thesis_project_lecturer`
--

CREATE TABLE `thesis_project_lecturer` (
  `id` int(11) NOT NULL,
  `projectId` varchar(255) DEFAULT NULL,
  `lecturerId` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attribute`
--
ALTER TABLE `attribute`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `attribute_option`
--
ALTER TABLE `attribute_option`
  ADD PRIMARY KEY (`id`),
  ADD KEY `attrId` (`attrId`);

--
-- Indexes for table `class`
--
ALTER TABLE `class`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_class_course_instance` (`course_instance_id`),
  ADD KEY `fk_class_program` (`program_id`),
  ADD KEY `fk_class_lecturer` (`lecturer_id`);

--
-- Indexes for table `class_assess`
--
ALTER TABLE `class_assess`
  ADD PRIMARY KEY (`class_id`,`name`),
  ADD KEY `fk_class_assess_course_outcome` (`course_outcome_instance_id`);

--
-- Indexes for table `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_course_program` (`program_id`),
  ADD KEY `fk_course_semester` (`semester_id`);

--
-- Indexes for table `course_instance`
--
ALTER TABLE `course_instance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_course_instance_program` (`program_id`);

--
-- Indexes for table `course_instance_class_student`
--
ALTER TABLE `course_instance_class_student`
  ADD PRIMARY KEY (`studentId`);

--
-- Indexes for table `course_instance_ndct`
--
ALTER TABLE `course_instance_ndct`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `course_instance_ndct_course_outcome_instance`
--
ALTER TABLE `course_instance_ndct_course_outcome_instance`
  ADD PRIMARY KEY (`course_instance_ndct_id`,`course_outcome_instance_id`),
  ADD KEY `course_outcome_instance_id` (`course_outcome_instance_id`);

--
-- Indexes for table `course_ndct`
--
ALTER TABLE `course_ndct`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_course_ndct_course` (`courseId`);

--
-- Indexes for table `course_ndct_course_outcome`
--
ALTER TABLE `course_ndct_course_outcome`
  ADD PRIMARY KEY (`course_ndct_id`,`course_outcome_id`);

--
-- Indexes for table `course_outcome_instance`
--
ALTER TABLE `course_outcome_instance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_course_outcome_instance_program` (`program_id`),
  ADD KEY `fk_course_outcome_instance_course` (`course_id`);

--
-- Indexes for table `foundation_test_answer`
--
ALTER TABLE `foundation_test_answer`
  ADD PRIMARY KEY (`answer_id`),
  ADD KEY `fk_foundation_test_answer_question` (`question_id`);

--
-- Indexes for table `foundation_test_question`
--
ALTER TABLE `foundation_test_question`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_foundation_test_question_test` (`test_id`);

--
-- Indexes for table `foundation_test_subject`
--
ALTER TABLE `foundation_test_subject`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `general_course`
--
ALTER TABLE `general_course`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `general_course_attr_selected`
--
ALTER TABLE `general_course_attr_selected`
  ADD PRIMARY KEY (`attrId`);

--
-- Indexes for table `general_program`
--
ALTER TABLE `general_program`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `grading`
--
ALTER TABLE `grading`
  ADD PRIMARY KEY (`studentId`),
  ADD KEY `fk_grading_class` (`classId`),
  ADD KEY `fk_grading_question_course_outcome` (`questionCourseOutcomeId`);

--
-- Indexes for table `grading_foundation_test`
--
ALTER TABLE `grading_foundation_test`
  ADD PRIMARY KEY (`student_id`),
  ADD KEY `fk_grading_foundation_test_question` (`question_id`);

--
-- Indexes for table `indicator_level`
--
ALTER TABLE `indicator_level`
  ADD PRIMARY KEY (`level_id`);

--
-- Indexes for table `lecturer`
--
ALTER TABLE `lecturer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `level`
--
ALTER TABLE `level`
  ADD PRIMARY KEY (`levelId`);

--
-- Indexes for table `mon_hoc_song_hanh`
--
ALTER TABLE `mon_hoc_song_hanh`
  ADD PRIMARY KEY (`Id_mon_song_hanh`),
  ADD KEY `fk_mon_hoc_song_hanh_program` (`programId`);

--
-- Indexes for table `mon_hoc_tien_quyet`
--
ALTER TABLE `mon_hoc_tien_quyet`
  ADD PRIMARY KEY (`Id_mon_tien_quyet`),
  ADD KEY `fk_mon_hoc_tien_quyet_program` (`programId`);

--
-- Indexes for table `mon_hoc_truoc`
--
ALTER TABLE `mon_hoc_truoc`
  ADD PRIMARY KEY (`Id_mon_truoc`),
  ADD KEY `fk_mon_hoc_truoc_program` (`programId`);

--
-- Indexes for table `peo`
--
ALTER TABLE `peo`
  ADD PRIMARY KEY (`name`),
  ADD KEY `fk_peo_program` (`program_id`);

--
-- Indexes for table `peo_outcome`
--
ALTER TABLE `peo_outcome`
  ADD PRIMARY KEY (`program_id`,`peo_name`,`outcome_name`);

--
-- Indexes for table `performance_indicator`
--
ALTER TABLE `performance_indicator`
  ADD PRIMARY KEY (`name`);

--
-- Indexes for table `program`
--
ALTER TABLE `program`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `program_group`
--
ALTER TABLE `program_group`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `program_instance`
--
ALTER TABLE `program_instance`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `program_outcome`
--
ALTER TABLE `program_outcome`
  ADD PRIMARY KEY (`outcome_name`);

--
-- Indexes for table `program_outcome_course`
--
ALTER TABLE `program_outcome_course`
  ADD PRIMARY KEY (`program_id`,`outcome_name`,`course_id`);

--
-- Indexes for table `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `question_course_outcome`
--
ALTER TABLE `question_course_outcome`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_question_course_outcome_question` (`questionId`);

--
-- Indexes for table `semester`
--
ALTER TABLE `semester`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `subject`
--
ALTER TABLE `subject`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `survey`
--
ALTER TABLE `survey`
  ADD PRIMARY KEY (`name`);

--
-- Indexes for table `survey_addition_question_level`
--
ALTER TABLE `survey_addition_question_level`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `survey_indicator`
--
ALTER TABLE `survey_indicator`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `survey_indicator_level`
--
ALTER TABLE `survey_indicator_level`
  ADD PRIMARY KEY (`levelId`);

--
-- Indexes for table `survey_kind`
--
ALTER TABLE `survey_kind`
  ADD PRIMARY KEY (`name`);

--
-- Indexes for table `survey_type`
--
ALTER TABLE `survey_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_nhomquyen`
--
ALTER TABLE `tbl_nhomquyen`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_taikhoan`
--
ALTER TABLE `tbl_taikhoan`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `fk_taikhoan_nhomquyen` (`MaNhomQuyen`);

--
-- Indexes for table `test`
--
ALTER TABLE `test`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `test_course_outcome`
--
ALTER TABLE `test_course_outcome`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `thesis_project`
--
ALTER TABLE `thesis_project`
  ADD PRIMARY KEY (`project_id`),
  ADD KEY `fk_thesis_project_program` (`program_id`),
  ADD KEY `fk_thesis_project_reviewer` (`reviewer_id`);

--
-- Indexes for table `thesis_project_lecturer`
--
ALTER TABLE `thesis_project_lecturer`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_thesis_project_lecturer_project` (`projectId`),
  ADD KEY `fk_thesis_project_lecturer_lecturer` (`lecturerId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attribute`
--
ALTER TABLE `attribute`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `attribute_option`
--
ALTER TABLE `attribute_option`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `course_instance_ndct`
--
ALTER TABLE `course_instance_ndct`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `course_ndct`
--
ALTER TABLE `course_ndct`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `course_outcome_instance`
--
ALTER TABLE `course_outcome_instance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `level`
--
ALTER TABLE `level`
  MODIFY `levelId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `program_group`
--
ALTER TABLE `program_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `question_course_outcome`
--
ALTER TABLE `question_course_outcome`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `survey_addition_question_level`
--
ALTER TABLE `survey_addition_question_level`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `survey_indicator`
--
ALTER TABLE `survey_indicator`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `survey_type`
--
ALTER TABLE `survey_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_taikhoan`
--
ALTER TABLE `tbl_taikhoan`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `test_course_outcome`
--
ALTER TABLE `test_course_outcome`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `thesis_project_lecturer`
--
ALTER TABLE `thesis_project_lecturer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attribute_option`
--
ALTER TABLE `attribute_option`
  ADD CONSTRAINT `attribute_option_ibfk_1` FOREIGN KEY (`attrId`) REFERENCES `attribute` (`id`);

--
-- Constraints for table `class`
--
ALTER TABLE `class`
  ADD CONSTRAINT `fk_class_course_instance` FOREIGN KEY (`course_instance_id`) REFERENCES `course_instance` (`id`),
  ADD CONSTRAINT `fk_class_lecturer` FOREIGN KEY (`lecturer_id`) REFERENCES `lecturer` (`id`),
  ADD CONSTRAINT `fk_class_program` FOREIGN KEY (`program_id`) REFERENCES `program` (`id`);

--
-- Constraints for table `class_assess`
--
ALTER TABLE `class_assess`
  ADD CONSTRAINT `fk_class_assess_class` FOREIGN KEY (`class_id`) REFERENCES `class` (`id`),
  ADD CONSTRAINT `fk_class_assess_course_outcome` FOREIGN KEY (`course_outcome_instance_id`) REFERENCES `course_outcome_instance` (`id`);

--
-- Constraints for table `course`
--
ALTER TABLE `course`
  ADD CONSTRAINT `fk_course_program` FOREIGN KEY (`program_id`) REFERENCES `program` (`id`),
  ADD CONSTRAINT `fk_course_semester` FOREIGN KEY (`semester_id`) REFERENCES `semester` (`id`);

--
-- Constraints for table `course_instance`
--
ALTER TABLE `course_instance`
  ADD CONSTRAINT `fk_course_instance_program` FOREIGN KEY (`program_id`) REFERENCES `program_instance` (`id`);

--
-- Constraints for table `course_instance_ndct_course_outcome_instance`
--
ALTER TABLE `course_instance_ndct_course_outcome_instance`
  ADD CONSTRAINT `course_instance_ndct_course_outcome_instance_ibfk_1` FOREIGN KEY (`course_instance_ndct_id`) REFERENCES `course_instance_ndct` (`id`),
  ADD CONSTRAINT `course_instance_ndct_course_outcome_instance_ibfk_2` FOREIGN KEY (`course_outcome_instance_id`) REFERENCES `course_outcome_instance` (`id`);

--
-- Constraints for table `course_ndct`
--
ALTER TABLE `course_ndct`
  ADD CONSTRAINT `fk_course_ndct_course` FOREIGN KEY (`courseId`) REFERENCES `course` (`id`);

--
-- Constraints for table `course_ndct_course_outcome`
--
ALTER TABLE `course_ndct_course_outcome`
  ADD CONSTRAINT `course_ndct_course_outcome_ibfk_1` FOREIGN KEY (`course_ndct_id`) REFERENCES `course_ndct` (`id`);

--
-- Constraints for table `course_outcome_instance`
--
ALTER TABLE `course_outcome_instance`
  ADD CONSTRAINT `fk_course_outcome_instance_course` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`),
  ADD CONSTRAINT `fk_course_outcome_instance_program` FOREIGN KEY (`program_id`) REFERENCES `program` (`id`);

--
-- Constraints for table `foundation_test_answer`
--
ALTER TABLE `foundation_test_answer`
  ADD CONSTRAINT `fk_foundation_test_answer_question` FOREIGN KEY (`question_id`) REFERENCES `foundation_test_question` (`id`),
  ADD CONSTRAINT `foundation_test_answer_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `foundation_test_question` (`id`);

--
-- Constraints for table `foundation_test_question`
--
ALTER TABLE `foundation_test_question`
  ADD CONSTRAINT `fk_foundation_test_question_test` FOREIGN KEY (`test_id`) REFERENCES `foundation_test_subject` (`id`);

--
-- Constraints for table `grading`
--
ALTER TABLE `grading`
  ADD CONSTRAINT `fk_grading_class` FOREIGN KEY (`classId`) REFERENCES `class` (`id`),
  ADD CONSTRAINT `fk_grading_question_course_outcome` FOREIGN KEY (`questionCourseOutcomeId`) REFERENCES `question_course_outcome` (`id`),
  ADD CONSTRAINT `fk_grading_student` FOREIGN KEY (`studentId`) REFERENCES `student` (`id`);

--
-- Constraints for table `grading_foundation_test`
--
ALTER TABLE `grading_foundation_test`
  ADD CONSTRAINT `fk_grading_foundation_test_question` FOREIGN KEY (`question_id`) REFERENCES `foundation_test_question` (`id`),
  ADD CONSTRAINT `fk_grading_foundation_test_student` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`);

--
-- Constraints for table `mon_hoc_song_hanh`
--
ALTER TABLE `mon_hoc_song_hanh`
  ADD CONSTRAINT `fk_mon_hoc_song_hanh_program` FOREIGN KEY (`programId`) REFERENCES `program` (`id`);

--
-- Constraints for table `mon_hoc_tien_quyet`
--
ALTER TABLE `mon_hoc_tien_quyet`
  ADD CONSTRAINT `fk_mon_hoc_tien_quyet_program` FOREIGN KEY (`programId`) REFERENCES `program` (`id`);

--
-- Constraints for table `mon_hoc_truoc`
--
ALTER TABLE `mon_hoc_truoc`
  ADD CONSTRAINT `fk_mon_hoc_truoc_program` FOREIGN KEY (`programId`) REFERENCES `program` (`id`);

--
-- Constraints for table `peo`
--
ALTER TABLE `peo`
  ADD CONSTRAINT `fk_peo_program` FOREIGN KEY (`program_id`) REFERENCES `program` (`id`);

--
-- Constraints for table `question_course_outcome`
--
ALTER TABLE `question_course_outcome`
  ADD CONSTRAINT `fk_question_course_outcome_question` FOREIGN KEY (`questionId`) REFERENCES `question` (`id`);

--
-- Constraints for table `tbl_taikhoan`
--
ALTER TABLE `tbl_taikhoan`
  ADD CONSTRAINT `fk_taikhoan_nhomquyen` FOREIGN KEY (`MaNhomQuyen`) REFERENCES `tbl_nhomquyen` (`id`);

--
-- Constraints for table `thesis_project`
--
ALTER TABLE `thesis_project`
  ADD CONSTRAINT `fk_thesis_project_program` FOREIGN KEY (`program_id`) REFERENCES `program` (`id`),
  ADD CONSTRAINT `fk_thesis_project_reviewer` FOREIGN KEY (`reviewer_id`) REFERENCES `lecturer` (`id`);

--
-- Constraints for table `thesis_project_lecturer`
--
ALTER TABLE `thesis_project_lecturer`
  ADD CONSTRAINT `fk_thesis_project_lecturer_lecturer` FOREIGN KEY (`lecturerId`) REFERENCES `lecturer` (`id`),
  ADD CONSTRAINT `fk_thesis_project_lecturer_project` FOREIGN KEY (`projectId`) REFERENCES `thesis_project` (`project_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
