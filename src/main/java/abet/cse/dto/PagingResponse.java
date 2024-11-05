package abet.cse.dto;

import abet.cse.statics.AbetCseStatusEnum;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PagingResponse extends BaseResponse {
  private long total;
  private int currentPage;
  private int lastPage;
  private int pageSize;

  public PagingResponse(AbetCseStatusEnum statusEnum) {
    super(statusEnum);
  }

  public PagingResponse(AbetCseStatusEnum statusEnum, Object data) {
    super(statusEnum, data);
  }

  public void setPage(long total, int currentPage, int lastPage, int pageSize) {
    this.total = total;
    this.currentPage = currentPage;
    this.lastPage = lastPage;
    this.pageSize = pageSize;
  }
}
