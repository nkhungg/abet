package abet.cse.dto.attribute;

import abet.cse.model.AttrOptionModel;
import abet.cse.model.AttributeModel;
import abet.cse.model.GeneralCourseAttr;
import lombok.Data;

@Data
public class AttrSelectedResponse {

  private int attrId;
  private String name;
  private String type;
  private String table;
  private int valueId;
  private String value;

  public AttrSelectedResponse(GeneralCourseAttr generalCourseAttr,
      AttributeModel attributeModel, AttrOptionModel attrOptionModel) {
    this.attrId = attributeModel.getId();
    this.name = attributeModel.getName();
    this.type = attributeModel.getType();
    this.table = attributeModel.getTableName();
    if (attrOptionModel == null) {
      this.value = generalCourseAttr.getValue();
      this.valueId = -1;
    } else {
      this.valueId = attrOptionModel.getId();
      this.value = attrOptionModel.getName();
    }
  }
}
