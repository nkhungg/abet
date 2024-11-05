package abet.cse.dto.attribute;

import abet.cse.model.AttrOptionModel;
import abet.cse.model.AttributeModel;
import java.util.List;
import lombok.Data;

@Data
public class AttrResponse {

  private int id;
  private String name;
  private String type;
  private String tableName;
  private List<AttrOptionModel> attrOptionList;

  public AttrResponse(AttributeModel attributeModel, List<AttrOptionModel> attrOptionModelList) {
    this.id = attributeModel.getId();
    this.name = attributeModel.getName();
    this.type = attributeModel.getType();
    this.tableName = attributeModel.getTableName();
    this.attrOptionList = attrOptionModelList;
  }
}
