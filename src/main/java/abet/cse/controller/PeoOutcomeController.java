package abet.cse.controller;

import abet.cse.dto.BaseResponse;
import abet.cse.dto.PagingResponse;
import abet.cse.dto.matrix.MatrixResponse;
import abet.cse.dto.matrix.MatrixRow;
import abet.cse.dto.matrix.PeoOutcomeCell;
import abet.cse.model.Outcome;
import abet.cse.model.Peo;
import abet.cse.model.PeoOutcome;
import abet.cse.repository.OutcomeRepo;
import abet.cse.repository.PeoOutcomeRepo;
import abet.cse.repository.PeoRepo;
import abet.cse.statics.AbetCseStatusEnum;
import abet.cse.statics.Constant;
import abet.cse.utils.ObjectUtils;
import abet.cse.utils.Utils;
import abet.cse.validator.Validator;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jdbc.core.JdbcAggregateTemplate;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("programs/{programId}/peo-outcome")
@RequiredArgsConstructor
@Slf4j
public class PeoOutcomeController {

  private final PeoRepo peoRepo;
  private final OutcomeRepo outcomeRepo;
  private final PeoOutcomeRepo peoOutcomeRepo;
  private final JdbcAggregateTemplate jdbcAggregateTemplate;
  private final JdbcTemplate jdbcTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getPeoOutcome(@PathVariable("programId") String programId,
      @RequestParam(value = "currentPage", defaultValue = "1") int currentPage,
      @RequestParam(value = "pageSize", defaultValue = "15") int pageSize) {
    PagingResponse response;
    try {
      int offset = pageSize * (currentPage - 1);
      List<Peo> peoList = peoRepo.findByProgramId(programId, 100, 0);
      List<Outcome> outcomeList = outcomeRepo.findByProgramId(programId, pageSize, offset);
      long total = outcomeRepo.countByProgramId(programId);
      List<PeoOutcome> peoOutcomeList = peoOutcomeRepo.findByProgramId(programId, 100, 0);

      List<MatrixRow> matrixRowList = new ArrayList<>();
      for (Outcome outcome : outcomeList) {
        MatrixRow<PeoOutcomeCell> matrixRow = new MatrixRow<>();

        List<PeoOutcomeCell> peoOutcomeCellList = new ArrayList<>();
        for (Peo peo : peoList) {
          boolean result = Validator.checkPeoOutcomeMatrix(
              peoOutcomeList, outcome.getOutcomeName(),peo.getName());
          PeoOutcomeCell peoOutcomeCell = new PeoOutcomeCell(peo.getName(), outcome.getOutcomeName(), result);
          peoOutcomeCellList.add(peoOutcomeCell);
        }

        matrixRow.setTitle(outcome.getOutcomeName());
        matrixRow.setData(peoOutcomeCellList);
        matrixRowList.add(matrixRow);
      }

      int lastPage = Utils.calculateLastPage(total, pageSize);
      List<String> peoNameList = peoList.stream().map(Peo::getName)
          .collect(Collectors.toCollection(LinkedList::new));
      peoNameList.add(0, Constant.PEO_OUTCOME);

      MatrixResponse matrixResponse = new MatrixResponse(peoNameList, matrixRowList);
      response = new PagingResponse(AbetCseStatusEnum.REQUEST_OK, matrixResponse);
      response.setPage(total, currentPage, lastPage, pageSize);
      log.info("getPeoOutcome SUCCESS with [PagingResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getPeoOutcome ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity postPeoOutcome(@PathVariable("programId") String programId,
      @RequestBody PeoOutcomeCell peoOutcomeCell) {
    BaseResponse response;
    try {
      PeoOutcome peoOutcome = new PeoOutcome(programId, peoOutcomeCell);
      if (peoOutcomeCell.isCheck()) {
        jdbcAggregateTemplate.insert(peoOutcome);
      } else {
        String sql = "DELETE FROM peo_outcome WHERE program_id = ? AND peo_name = ? AND outcome_name = ?";
        jdbcTemplate.update(sql, programId, peoOutcomeCell.getPeoName(), peoOutcomeCell.getOutcomeName());
      }
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK);
      log.info("postPeoOutcome SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("postPeoOutcome ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
