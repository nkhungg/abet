import React from "react";
import { FormattedMessage } from "react-intl";

export default function MatrixOutcomeTest() {
  return (
    <div className="matrix-outcome-indicator my-2">
      <div className="d-flex justify-content-between align-items-center mt-3 mb-2">
        <h5 className="m-0">
          <FormattedMessage id="MATRIX_OUTCOMES_TEST" />
        </h5>
      </div>
    </div>
  );
}
