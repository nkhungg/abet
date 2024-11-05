package abet.cse.controller;

import abet.cse.dto.PagingResponse;
import abet.cse.dto.attribute.AttrResponse;
import abet.cse.model.AttrOptionModel;
import abet.cse.model.AttributeModel;
import abet.cse.repository.AttrOptionRepo;
import abet.cse.repository.AttributeRepo;
import abet.cse.statics.AbetCseStatusEnum;
import abet.cse.statics.Constant;
import abet.cse.utils.ObjectUtils;
import abet.cse.utils.Utils;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("")
@RequiredArgsConstructor
@Slf4j
public class AttributeController {

  private final AttributeRepo attributeRepo;
  private final AttrOptionRepo attrOptionRepo;

  @GetMapping(value = "/attributes", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getAttributeList(
      @RequestParam(value = "tableName", required = false) String tableName,
      @RequestParam(value = "currentPage", defaultValue = "1") int currentPage,
      @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
    PagingResponse response;
    List<AttrResponse> attrResponseList = new ArrayList<>();
    try {
      int offset = pageSize * (currentPage - 1);
      List<AttributeModel> attributeModelList;

      long total;
      if (StringUtils.isBlank(tableName)) {
        attributeModelList = attributeRepo.findAll(pageSize, offset);
        total = attributeRepo.count();
      } else {
        attributeModelList = attributeRepo.findByTable(tableName, pageSize, offset);
        total = attributeRepo.countByTable(tableName);
      }
      for (int i = 0; i < attributeModelList.size(); i++) {
        AttributeModel attributeModel = attributeModelList.get(i);
        List<AttrOptionModel> attrOptionModelList = null;
        if (attributeModel.getType().equalsIgnoreCase(Constant.SELECT)) {
          attrOptionModelList = attrOptionRepo.findByAttrId(attributeModel.getId());
        }
        AttrResponse attrResponse = new AttrResponse(attributeModel, attrOptionModelList);
        attrResponseList.add(attrResponse);
      }
      int lastPage = Utils.calculateLastPage(total, pageSize);

      response = new PagingResponse(AbetCseStatusEnum.REQUEST_OK, attrResponseList);
      response.setTotal(total);
      response.setCurrentPage(currentPage);
      response.setLastPage(lastPage);
      response.setPageSize(pageSize);
      log.info("getAttributeList SUCCESS with [PagingResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getAttributeList ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
