Link Postman
https://www.getpostman.com/collections/b21f5004a4fe602c5c60

CREATE TABLE abet_123.`semester` (
    `id` int(11) NOT NULL,
    `name` varchar(255) NOT NULL,
    `program_id` varchar(45) NOT NULL,
    PRIMARY KEY (`id`,`program_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

INSERT INTO `abet_123`.`semester`
(`id`, `name`, `program_id`)
VALUES (1, 'Semester 1', 'CS2014'),
       (2, 'Semester 2', 'CS2014'),
       (3, 'Semester 3', 'CS2014'),
       (4, 'Semester 4', 'CS2014'),
       (5, 'Semester 5', 'CS2014'),
       (6, 'Semester 6', 'CS2014'),
       (7, 'Semester 7', 'CS2014'),
       (8, 'Semester 8', 'CS2014');

CREATE TABLE abet_123.`program_group` (
     `id` int(11) NOT NULL,
     `name` varchar(255) NOT NULL,
     `program_id` varchar(45) NOT NULL,
     PRIMARY KEY (`id`,`program_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

INSERT INTO `abet_123`.`program_group`
(`id`, `name`, `program_id`)
VALUES (20, 'Mandatory-Elective Group', 'CS2014'),
       (21, 'Elective Group', 'CS2014'),
       (22, 'Social-science Group', 'CS2014'),
       (23, 'Basic-science Group', 'CS2014');

ALTER TABLE `abet_123`.`course`
    ADD COLUMN `group_id` INT(11) NULL DEFAULT NULL AFTER `semester_id`,
CHANGE COLUMN `semester` `semester_id` INT(11) NULL DEFAULT NULL ;

create table attribute
create table attr_option
create table general_course_attr_selected

UPDATE abet_123.course AS course1, abet_123.course AS course2
SET course1.group_id = course2.semester_id
WHERE course1.id = course2.id AND course1.program_id = course2.program_id AND course2.semester_id > 10;


Convert primary key of course_outcome to id

ALTER TABLE `abet_123`.`program_instance`
DROP PRIMARY KEY, ADD PRIMARY KEY (`id`);


ALTER TABLE `abet_123`.`lecturer`
    ADD COLUMN `department` VARCHAR(255) NULL DEFAULT NULL AFTER `email`,
    ADD COLUMN `phone_number` VARCHAR(45) NULL DEFAULT NULL AFTER `department`,
    ADD COLUMN `contact_level` ENUM("university level", "faculty level") NULL DEFAULT NULL AFTER `phone_number`;


ALTER TABLE `abet_123`.`test_course_outcome`
    ADD COLUMN `comment` VARCHAR(255) NULL DEFAULT NULL AFTER `percent`,

ALTER TABLE `abet_123`.`question`
    ADD COLUMN `class_id` VARCHAR(45) NULL DEFAULT NULL AFTER `attach_file`,
ADD INDEX `class_id_fk2_idx` (`class_id` ASC) VISIBLE;
;
ALTER TABLE `abet_123`.`question`
    ADD CONSTRAINT `class_id_fk2`
        FOREIGN KEY (`class_id`)
            REFERENCES `abet_123`.`class` (`Id`)
            ON DELETE CASCADE
            ON UPDATE NO ACTION;

ALTER TABLE `abet_123`.`thesis_project`
    ADD COLUMN `program_id` VARCHAR(45) NULL DEFAULT NULL AFTER `semester`;

create table abet_123.thesis_project_lecturer (
    id int auto_increment primary key,
    project_id  varchar(255) not null,
    lecturer_id varchar(45) not null,
    role enum ('primary supervisor', 'secondary supervisor', 'reviewer mid term', 'reviewer final term') not null
);

create index lecturer_id_fk_idx on abet_123.thesis_project_lecturer (lecturer_id);
create index project_id_fk_idx on abet_123.thesis_project_lecturer (project_id);

CREATE TABLE `abet_123`.`survey_type` (
      `id` INT NOT NULL,
      `name` VARCHAR(45) NOT NULL,
      `survey_kind` VARCHAR(45) NOT NULL,
      PRIMARY KEY (`id`));

INSERT INTO abet_123.survey_type (id, name, survey_kind) VALUES (1, 'Supervisor Assess', 'CapstoneProject');
INSERT INTO abet_123.survey_type (id, name, survey_kind) VALUES (2, 'Reviewer Assess', 'CapstoneProject');
INSERT INTO abet_123.survey_type (id, name, survey_kind) VALUES (3, 'Member Assess', 'CapstoneProject');
INSERT INTO abet_123.survey_type (id, name, survey_kind) VALUES (4, 'Participant Assess', 'CapstoneProject');
INSERT INTO abet_123.survey_type (id, name, survey_kind) VALUES (5, 'ExitSurvey', 'ExitSurvey');
INSERT INTO abet_123.survey_type (id, name, survey_kind) VALUES (6, 'Internship', 'Internship');
INSERT INTO abet_123.survey_type (id, name, survey_kind) VALUES (8, 'TTTN-HD', 'TTTN');
INSERT INTO abet_123.survey_type (id, name, survey_kind) VALUES (9, 'TTTN-Participant', 'TTTN');
INSERT INTO abet_123.survey_type (id, name, survey_kind) VALUES (10, 'TTTN-Supervisor', 'TTTN');
INSERT INTO abet_123.survey_type (id, name, survey_kind) VALUES (11, 'Committee Assess', 'CapstoneProject');

ALTER TABLE `abet_123`.`survey_indicator_level`
    CHANGE COLUMN `min_grade_flag` `min_grade_flag` TINYINT(2) NULL DEFAULT NULL ,
    CHANGE COLUMN `max_grade_flag` `max_grade_flag` TINYINT(2) NULL DEFAULT NULL ;

ALTER TABLE `abet_123`.`par_assess`
    ADD COLUMN `student_id` INT(11) NULL DEFAULT NULL AFTER `mark`;

UPDATE abet_123.test
SET id = 'CS2014_2014_1_CO1007_BT-TH'
WHERE id = 'CS2014_2014_1_CO1007_BT/TH';